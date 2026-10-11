// tests/final-system-readiness-check.js
// Complete End-to-End Handover Readiness Audit & Role Permissions Matrix Test

const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const env = require("../src/config/env");
const app = require("../src/app");
const {
  onlineAssistantFunctionDeclarations,
  assistantFunctionDeclarations,
  teacherFunctionDeclarations,
  superAdminFunctionDeclarations,
  executeAssistantTool,
} = require("../src/modules/ai/tools/assistant.tools");
const { getSystemPrompt } = require("../src/modules/ai/ai.prompts");

const PORT = 8996;

async function runAudit() {
  console.log("================================================================================");
  console.log("🏆 FINAL COMPREHENSIVE PRODUCTION READINESS & RBAC SECURITY AUDIT");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  async function check(category, testName, fn) {
    try {
      await fn();
      console.log(`  [PASS] [${category}] ${testName}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] [${category}] ${testName}: ${err.message}`);
      failed++;
    }
  }

  // 1. AI Assistant RBAC & Guardrails Layer
  console.log("\n--- LAYER 1: AI Assistant & Subject Gate RBAC ---");

  await check("AI-RBAC", "Online Assistant function declarations contain zero center tools", async () => {
    const onlineTools = new Set(onlineAssistantFunctionDeclarations.map((t) => t.name));
    const forbidden = [
      "create_student", "record_student_attendance", "record_student_payment",
      "create_paper_exam", "create_group", "start_attendance_session", "close_attendance_session"
    ];
    for (const t of forbidden) {
      assert.strictEqual(onlineTools.has(t), false, `Tool ${t} must not be declared for online assistant`);
    }
  });

  await check("AI-RBAC", "Online Assistant cannot execute center tools at runtime", async () => {
    const ctx = {
      userId: 10,
      userRole: "assistant",
      userType: "assistant",
      permissions: "online_management",
      rawPermissions: "online_management",
      isOnlineAssistant: true,
    };
    const res = await executeAssistantTool("create_student", { full_name: "test" }, ctx);
    assert.strictEqual(res.success, false);
    assert.ok(res.error.includes("صلاحية إدارة الأونلاين فقط"));
  });

  await check("AI-RBAC", "Center Assistant has both center and operational tools", async () => {
    const allTools = new Set(assistantFunctionDeclarations.map((t) => t.name));
    assert.ok(allTools.has("create_student"));
    assert.ok(allTools.has("record_student_attendance"));
    assert.ok(allTools.has("create_online_exam"));
  });

  await check("AI-GATE", "System prompt enforces Arabic-only subject gate and blocks code/programming", async () => {
    const prompt = getSystemPrompt("assistant", {
      userName: "مساعد تجريبي",
      permissions: "online_management",
      isOnlineAssistant: true,
    });
    assert.ok(prompt.includes("الحظر المطلق لشرح أو تحليل أي ملف أو سؤال خارج نطاق مادة"));
    assert.ok(prompt.includes("أكواد برمجية"));
    assert.ok(prompt.includes("اللغة العربية"));
  });

  // 2. HTTP Server & Role-Based Access Control (RBAC) Layer
  console.log("\n--- LAYER 2: HTTP Route RBAC Permissions Matrix ---");

  const server = app.listen(PORT, async () => {
    const BASE = `http://127.0.0.1:${PORT}`;

    const basicAuth = "Basic " + Buffer.from(`${env.API_USERNAME}:${env.API_PASSWORD}`).toString("base64");
    const secret = env.JWT_SECRET || "default_jwt_secret_key_for_testing";

    // Tokens for all distinct platform roles
    const superAdminToken = jwt.sign({ id: 1, role: "super_admin", permissions: "center_management" }, secret, { expiresIn: "1h" });
    const teacherToken = jwt.sign({ id: 2, role: "teacher", permissions: "all" }, secret, { expiresIn: "1h" });
    const centerAssistantToken = jwt.sign({ id: 3, role: "assistant", permissions: "center_management" }, secret, { expiresIn: "1h" });
    const onlineAssistantToken = jwt.sign({ id: 4, role: "assistant", permissions: "online_management" }, secret, { expiresIn: "1h" });
    const studentToken = jwt.sign({ id: 5, role: "student" }, secret, { expiresIn: "1h" });

    const reqOptions = (token, method = "GET", body = null) => ({
      method,
      headers: {
        Authorization: basicAuth,
        ...(token ? { "x-client-key": token } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    // --- Anonymous / Unauthenticated checks ---
    await check("ANON-SEC", "Unauthenticated request to /api/assistant/students is 401", async () => {
      const res = await fetch(`${BASE}/api/assistant/students`, reqOptions(null));
      assert.strictEqual(res.status, 401);
    });

    await check("ANON-SEC", "Unauthenticated student excel export is 401 (P0 Leak fixed)", async () => {
      const res = await fetch(`${BASE}/api/teacher/students/export/excel`, reqOptions(null));
      assert.strictEqual(res.status, 401);
    });

    await check("ANON-SEC", "Forged JWT token rejected with 401", async () => {
      const res = await fetch(`${BASE}/api/assistant/students`, reqOptions("forged.invalid.token"));
      assert.strictEqual(res.status, 401);
    });

    // --- Online Assistant Permission Boundary checks ---
    await check("ONLINE-AST", "Online Assistant CAN access Online Exams (200)", async () => {
      const res = await fetch(`${BASE}/api/assistant/online-exams`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 200);
    });

    await check("ONLINE-AST", "Online Assistant CAN access Live Sessions (200)", async () => {
      const res = await fetch(`${BASE}/api/assistant/live-sessions`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 200);
    });

    await check("ONLINE-AST", "Online Assistant CAN access AI Copilot Quota (200)", async () => {
      const res = await fetch(`${BASE}/api/assistant/ai/quota`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 200);
    });

    await check("ONLINE-AST", "Online Assistant CAN access read-only Grades (200)", async () => {
      const res = await fetch(`${BASE}/api/assistant/grades`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 200);
    });

    await check("ONLINE-AST", "Online Assistant BLOCKED from Students list (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/students`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 403);
    });

    await check("ONLINE-AST", "Online Assistant BLOCKED from Attendance sessions (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/attendance/sessions`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 403);
    });

    await check("ONLINE-AST", "Online Assistant BLOCKED from Payments (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/payments`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 403);
    });

    await check("ONLINE-AST", "Online Assistant BLOCKED from Paper Exams (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/exams`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 403);
    });

    await check("ONLINE-AST", "Online Assistant BLOCKED from creating Center Grade (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/grades`, reqOptions(onlineAssistantToken, "POST", { name: "صف جديد" }));
      assert.strictEqual(res.status, 403);
    });

    await check("ONLINE-AST", "Online Assistant BLOCKED from WhatsApp dashboard (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/whatsapp/dashboard`, reqOptions(onlineAssistantToken));
      assert.strictEqual(res.status, 403);
    });

    // --- Center Assistant Permission Boundary checks ---
    await check("CENTER-AST", "Center Assistant CAN access Center Students list (200)", async () => {
      const res = await fetch(`${BASE}/api/assistant/students`, reqOptions(centerAssistantToken));
      assert.strictEqual(res.status, 200);
    });

    await check("CENTER-AST", "Center Assistant CAN access Online Exams too (200)", async () => {
      const res = await fetch(`${BASE}/api/assistant/online-exams`, reqOptions(centerAssistantToken));
      assert.strictEqual(res.status, 200);
    });

    await check("CENTER-AST", "Center Assistant BLOCKED from Super Admin endpoints (401/403)", async () => {
      const res = await fetch(`${BASE}/api/super-admin/users`, reqOptions(centerAssistantToken));
      assert.ok(res.status === 401 || res.status === 403, `Expected 401 or 403, got ${res.status}`);
    });

    // --- Teacher Permission Boundary checks ---
    await check("TEACHER", "Teacher CAN access teacher overview & students (200)", async () => {
      const res = await fetch(`${BASE}/api/teacher/students`, reqOptions(teacherToken));
      assert.strictEqual(res.status, 200);
    });

    await check("TEACHER", "Teacher BLOCKED from Super Admin system user mutations (401/403)", async () => {
      const res = await fetch(`${BASE}/api/super-admin/users`, reqOptions(teacherToken));
      assert.ok(res.status === 401 || res.status === 403, `Expected 401 or 403, got ${res.status}`);
    });

    // --- Super Admin Permission Boundary checks ---
    await check("SUPER-ADMIN", "Super Admin CAN access super-admin users (200)", async () => {
      const res = await fetch(`${BASE}/api/super-admin/users`, reqOptions(superAdminToken));
      assert.strictEqual(res.status, 200);
    });

    // --- Student Permission Boundary checks ---
    await check("STUDENT", "Student BLOCKED from Teacher routes (403)", async () => {
      const res = await fetch(`${BASE}/api/teacher/students`, reqOptions(studentToken));
      assert.strictEqual(res.status, 403);
    });

    await check("STUDENT", "Student BLOCKED from Assistant routes (403)", async () => {
      const res = await fetch(`${BASE}/api/assistant/students`, reqOptions(studentToken));
      assert.strictEqual(res.status, 403);
    });

    // --- Security Hygiene & Production Hardening checks ---
    console.log("\n--- LAYER 3: Security & Infrastructure Hardening ---");

    await check("INFRA-SEC", "Root GET / returns clean sanitized response without info disclosure", async () => {
      const res = await fetch(`${BASE}/`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.version, undefined);
      assert.strictEqual(data.environment, undefined);
    });

    await check("INFRA-SEC", "Health check GET /health returns 200 with uptime", async () => {
      const res = await fetch(`${BASE}/health`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(typeof data.uptime === "number");
    });

    await check("INFRA-SEC", "Nonexistent route returns clean 404 JSON", async () => {
      const res = await fetch(`${BASE}/api/nonexistent-route-xyz`);
      assert.strictEqual(res.status, 404);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    await check("INFRA-SEC", "Auth rate limiting headers are returned on login endpoints", async () => {
      const res = await fetch(`${BASE}/api/auth/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "01000000000", password: "wrong" }),
      });
      assert.strictEqual(res.status, 401);
      assert.ok(res.headers.get("ratelimit-limit"), "RateLimit header should exist");
    });

    console.log("\n================================================================================");
    console.log(`AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED (${passed + failed} TOTAL CHECKS)`);
    console.log("================================================================================");

    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  });
}

runAudit().catch((err) => {
  console.error("Audit runner failed:", err);
  process.exit(1);
});
