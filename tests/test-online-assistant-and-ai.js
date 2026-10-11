// tests/test-online-assistant-and-ai.js
// Automated verification for:
// 1. Online Assistant API route access & center route lockdown
// 2. Online Assistant AI tool isolation (Center tools strictly blocked)
// 3. AI Arabic Language Subject Gate & File Guard

const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const env = require("../src/config/env");
const { getSystemPrompt } = require("../src/modules/ai/ai.prompts");
const {
  onlineAssistantFunctionDeclarations,
  assistantFunctionDeclarations,
  executeAssistantTool,
} = require("../src/modules/ai/tools/assistant.tools");

async function runTests() {
  console.log("==================================================================");
  console.log("TEST SUITE: Online Assistant Permissions, AI Scope & File Gate");
  console.log("==================================================================");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // 1. Online Assistant Tool Isolation Tests
  // -------------------------------------------------------------------------
  console.log("\n--- 1. Testing AI Function Declarations Isolation ---");

  test("onlineAssistantFunctionDeclarations must exist and have tools", () => {
    assert.ok(Array.isArray(onlineAssistantFunctionDeclarations));
    assert.ok(onlineAssistantFunctionDeclarations.length > 0);
  });

  test("Center-only tools must be excluded from onlineAssistantFunctionDeclarations", () => {
    const onlineToolNames = new Set(onlineAssistantFunctionDeclarations.map((t) => t.name));

    const forbiddenTools = [
      "create_student",
      "update_student_details",
      "toggle_student_status",
      "reset_student_password",
      "search_student_details",
      "get_students_summary",
      "record_student_payment",
      "get_student_payment_status",
      "record_student_attendance",
      "start_attendance_session",
      "close_attendance_session",
      "get_attendance_report",
      "create_paper_exam",
      "record_paper_exam_result",
      "delete_paper_exam",
      "create_group",
      "update_group",
      "generate_parent_whatsapp_report",
    ];

    for (const tool of forbiddenTools) {
      assert.strictEqual(
        onlineToolNames.has(tool),
        false,
        `Tool [${tool}] MUST NOT be available to Online Assistant`,
      );
    }
  });

  test("Allowed online tools must be present in onlineAssistantFunctionDeclarations", () => {
    const onlineToolNames = new Set(onlineAssistantFunctionDeclarations.map((t) => t.name));

    const allowedTools = [
      "create_online_exam",
      "delete_online_exam",
      "get_online_exams_list",
      "get_exam_results_stats",
      "create_assignment",
      "grade_assignment_submission",
      "create_live_session",
      "get_live_sessions",
      "delete_live_session",
      "create_playlist",
      "get_playlists",
      "add_video_to_playlist",
      "change_assistant_password",
      "get_platform_info",
    ];

    for (const tool of allowedTools) {
      assert.ok(
        onlineToolNames.has(tool),
        `Tool [${tool}] should be available to Online Assistant`,
      );
    }
  });

  // -------------------------------------------------------------------------
  // 2. Runtime Execution RBAC Tool Guard Tests
  // -------------------------------------------------------------------------
  console.log("\n--- 2. Testing AI Tool Execution RBAC Enforcement ---");

  const onlineContext = {
    userId: 99,
    userRole: "assistant",
    userType: "assistant",
    userName: "مساعد أونلاين تجريبي",
    permissions: "online_management",
    rawPermissions: "online_management",
    isOnlineAssistant: true,
  };

  await asyncTest("Calling create_student as Online Assistant must be rejected", async () => {
    const result = await executeAssistantTool("create_student", { full_name: "طالب سنتر" }, onlineContext);
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes("صلاحية إدارة الأونلاين فقط"));
  });

  await asyncTest("Calling record_student_attendance as Online Assistant must be rejected", async () => {
    const result = await executeAssistantTool("record_student_attendance", { barcode: "123" }, onlineContext);
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes("صلاحية إدارة الأونلاين فقط"));
  });

  await asyncTest("Calling record_student_payment as Online Assistant must be rejected", async () => {
    const result = await executeAssistantTool("record_student_payment", { student_id: 1 }, onlineContext);
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes("صلاحية إدارة الأونلاين فقط"));
  });

  await asyncTest("Calling create_paper_exam as Online Assistant must be rejected", async () => {
    const result = await executeAssistantTool("create_paper_exam", { title: "امتحان ورقي" }, onlineContext);
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes("صلاحية إدارة الأونلاين فقط"));
  });

  // -------------------------------------------------------------------------
  // 3. AI Arabic Language Subject & File Gate Tests
  // -------------------------------------------------------------------------
  console.log("\n--- 3. Testing System Prompt Guardrails & Arabic-Only Gate ---");

  test("System prompt must include mandatory Arabic Subject Gate for attachments", () => {
    const prompt = getSystemPrompt("assistant", onlineContext);
    assert.ok(prompt.includes("الحظر المطلق لشرح أو تحليل أي ملف أو سؤال خارج نطاق مادة"));
    assert.ok(prompt.includes("أكواد برمجية"));
    assert.ok(prompt.includes("اللغة العربية"));
    assert.ok(prompt.includes("مساعد الأونلاين"));
    assert.ok(prompt.includes("إدارة الأونلاين والمنظومة الرقمية فقط"));
  });

  // -------------------------------------------------------------------------
  // 4. HTTP Routes Isolation (Online Assistant Token vs Routes)
  // -------------------------------------------------------------------------
  console.log("\n--- 4. Testing HTTP Routes Access via Local Test Server ---");

  const app = require("../src/app");
  const testPort = 8995;
  const server = app.listen(testPort, async () => {
    const BASE_URL = `http://127.0.0.1:${testPort}`;

    const onlineToken = jwt.sign(
      { id: 99, role: "assistant", permissions: "online_management" },
      env.JWT_SECRET || "default_jwt_secret_key_for_testing",
      { expiresIn: "1h" },
    );

    const basicAuth = "Basic " + Buffer.from(`${env.API_USERNAME}:${env.API_PASSWORD}`).toString("base64");
    const headers = {
      Authorization: basicAuth,
      "x-client-key": onlineToken,
    };

    // Test A: Online Assistant MUST access Online routes
    await asyncTest("Online Assistant CAN access GET /api/assistant/online-exams", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/online-exams`, { headers });
      assert.strictEqual(res.status, 200);
    });

    await asyncTest("Online Assistant CAN access GET /api/assistant/live-sessions", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/live-sessions`, { headers });
      assert.strictEqual(res.status, 200);
    });

    await asyncTest("Online Assistant CAN access GET /api/assistant/ai/quota", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/ai/quota`, { headers });
      assert.strictEqual(res.status, 200);
    });

    await asyncTest("Online Assistant CAN access GET /api/assistant/student-answers/essay/pending", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/student-answers/essay/pending`, { headers });
      assert.strictEqual(res.status, 200);
    });

    await asyncTest("Online Assistant CAN access read-only GET /api/assistant/grades", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/grades`, { headers });
      assert.strictEqual(res.status, 200);
    });

    // Test B: Online Assistant MUST BE BLOCKED on Center routes with 403
    await asyncTest("Online Assistant BLOCKED from GET /api/assistant/students (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/students`, { headers });
      assert.strictEqual(res.status, 403);
      const data = await res.json();
      assert.ok(data.message.includes("يتطلب صلاحية إدارة كاملة"));
    });

    await asyncTest("Online Assistant BLOCKED from GET /api/assistant/attendance/sessions (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/attendance/sessions`, { headers });
      assert.strictEqual(res.status, 403);
    });

    await asyncTest("Online Assistant BLOCKED from GET /api/assistant/payments (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/payments`, { headers });
      assert.strictEqual(res.status, 403);
    });

    await asyncTest("Online Assistant BLOCKED from GET /api/assistant/exams (paper exams) (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/exams`, { headers });
      assert.strictEqual(res.status, 403);
    });

    await asyncTest("Online Assistant BLOCKED from GET /api/assistant/whatsapp/dashboard (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/whatsapp/dashboard`, { headers });
      assert.strictEqual(res.status, 403);
    });

    await asyncTest("Online Assistant BLOCKED from POST /api/assistant/grades (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/grades`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "صف جديد" }),
      });
      assert.strictEqual(res.status, 403);
    });

    await asyncTest("Online Assistant BLOCKED from POST /api/assistant/groups (403)", async () => {
      const res = await fetch(`${BASE_URL}/api/assistant/groups`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "مجموعة جديدة", grade_id: 1 }),
      });
      assert.strictEqual(res.status, 403);
    });

    console.log("\n==================================================================");
    console.log(`FINAL RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================================");

    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  });
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
