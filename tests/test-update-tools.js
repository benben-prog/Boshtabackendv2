const {
  executeAssistantTool,
  assistantFunctionDeclarations,
  onlineAssistantFunctionDeclarations,
  teacherFunctionDeclarations,
  superAdminFunctionDeclarations,
} = require("../src/modules/ai/tools/assistant.tools");
const { getSystemPrompt } = require("../src/modules/ai/ai.prompts");
const { query } = require("../src/config/database");

async function runTests() {
  console.log("==================================================");
  console.log("   AUTOMATED VERIFICATION: UPDATE TOOLS & RBAC    ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Tool Declaration RBAC Checks
    console.log("--- 1. Tool Declaration & RBAC Segregation ---");
    const superAdminToolNames = superAdminFunctionDeclarations.map((t) => t.name);
    const onlineAssistantToolNames = onlineAssistantFunctionDeclarations.map((t) => t.name);
    const teacherToolNames = teacherFunctionDeclarations.map((t) => t.name);

    assert(
      superAdminToolNames.includes("update_user_account"),
      "update_user_account is present in superAdminFunctionDeclarations"
    );

    assert(
      !onlineAssistantToolNames.includes("update_user_account"),
      "update_user_account is NOT present in onlineAssistantFunctionDeclarations"
    );

    assert(
      !teacherToolNames.includes("update_user_account"),
      "update_user_account is NOT present in teacherFunctionDeclarations"
    );

    assert(
      onlineAssistantToolNames.includes("update_online_exam"),
      "update_online_exam is present in onlineAssistantFunctionDeclarations"
    );

    assert(
      onlineAssistantToolNames.includes("update_assignment"),
      "update_assignment is present in onlineAssistantFunctionDeclarations"
    );

    assert(
      onlineAssistantToolNames.includes("update_live_session"),
      "update_live_session is present in onlineAssistantFunctionDeclarations"
    );

    assert(
      onlineAssistantToolNames.includes("update_assistant_profile"),
      "update_assistant_profile is present in onlineAssistantFunctionDeclarations"
    );

    assert(
      !onlineAssistantToolNames.includes("update_student_details"),
      "update_student_details (center tool) is NOT present in onlineAssistantFunctionDeclarations"
    );

    // 2. System Prompt Guardrail Check
    console.log("\n--- 2. System Prompt Anti-Recreation Guardrail ---");
    const superAdminPrompt = getSystemPrompt("super_admin");
    assert(
      superAdminPrompt.includes("Strict Anti-Recreation & In-Place Update Mandate") &&
      superAdminPrompt.includes("update_user_account"),
      "System prompt contains rule 8 (Strict Anti-Recreation) and mentions update_user_account"
    );

    // 3. RBAC Enforcement in executeAssistantTool
    console.log("\n--- 3. RBAC Enforcement at Tool Execution Level ---");
    const unauthorizedRes = await executeAssistantTool(
      "update_user_account",
      { user_query: "1", full_name: "Hacker Assistant" },
      { userId: 999, userRole: "assistant", permissions: "online_management" }
    );
    assert(
      unauthorizedRes.success === false && unauthorizedRes.error.includes("حصرية للمدير العام"),
      "Assistant cannot execute update_user_account (blocked with Super Admin message)"
    );

    const teacherUnauthorizedRes = await executeAssistantTool(
      "update_user_account",
      { user_query: "1", full_name: "Teacher Modify" },
      { userId: 999, userRole: "teacher" }
    );
    assert(
      teacherUnauthorizedRes.success === false && teacherUnauthorizedRes.error.includes("حصرية للمدير العام"),
      "Teacher cannot execute update_user_account (blocked with Super Admin message)"
    );

    // 4. Test In-Place Update of User Account by Super Admin
    console.log("\n--- 4. In-Place User Account Modification (Super Admin) ---");
    // Create a temporary test assistant
    const testPhone = "01099887766";
    // Clean up if exists from previous run
    await query("DELETE FROM users WHERE phone = $1", [testPhone]);
    const insertRes = await query(
      `INSERT INTO users (full_name, phone, password, role, permissions, deleted)
       VALUES ('مساعد تجريبي قديم', $1, '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'assistant', 'center_management', 0)
       RETURNING id, full_name, phone, password`,
      [testPhone]
    );
    const createdUserId = insertRes.rows[0].id;
    const originalPassword = insertRes.rows[0].password;

    // Now update this user using update_user_account via Super Admin AI tool
    const updateResult = await executeAssistantTool(
      "update_user_account",
      {
        user_query: String(createdUserId),
        full_name: "مساعد تجريبي تم التعديل",
        permissions: "online_management",
      },
      { userId: 1, userRole: "super_admin" }
    );

    assert(
      updateResult.success === true,
      "Super admin successfully executed update_user_account"
    );

    // Verify user in DB: ID MUST BE SAME, PASSWORD MUST BE SAME, NAME & PERMISSIONS UPDATED
    const verifyUserRes = await query("SELECT * FROM users WHERE id = $1", [createdUserId]);
    const updatedUserInDb = verifyUserRes.rows[0];

    assert(
      updatedUserInDb.id === createdUserId,
      `User ID is preserved in-place (ID: ${updatedUserInDb.id})`
    );
    assert(
      updatedUserInDb.full_name === "مساعد تجريبي تم التعديل",
      `User full_name updated to: ${updatedUserInDb.full_name}`
    );
    assert(
      updatedUserInDb.permissions === "online_management",
      `User permissions updated to: ${updatedUserInDb.permissions}`
    );
    assert(
      updatedUserInDb.password === originalPassword,
      "User password is completely untouched and preserved"
    );

    // 5. Test update_assistant_profile (Self Update)
    console.log("\n--- 5. Assistant Self-Update Profile ---");
    const selfUpdateResult = await executeAssistantTool(
      "update_assistant_profile",
      {
        full_name: "مساعد معدل ذاتياً",
      },
      { userId: createdUserId, userRole: "assistant", permissions: "online_management" }
    );

    assert(
      selfUpdateResult.success === true && selfUpdateResult.user.full_name === "مساعد معدل ذاتياً",
      "Assistant successfully updated own profile name"
    );

    // Clean up test user
    await query("DELETE FROM users WHERE id = $1", [createdUserId]);
    console.log("[CLEANUP] Deleted temporary test user.");

    // 6. Test update_online_exam (Online Assistant & Super Admin)
    console.log("\n--- 6. update_online_exam In-Place Execution ---");
    // Create temporary online exam
    const examInsert = await query(
      `INSERT INTO online_exams (title, grade_id, duration_minutes, start_at, end_at, full_mark, deleted)
       VALUES ('امتحان تجريبي للاختبار', 1, 30, NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hour', 20, 0)
       RETURNING id, title`
    );
    const testExamId = examInsert.rows[0].id;

    const examUpdateRes = await executeAssistantTool(
      "update_online_exam",
      {
        exam_id: testExamId,
        title: "امتحان تم تعديله بنجاح",
        duration_minutes: 45,
      },
      { userId: 1, userRole: "assistant", permissions: "online_management" }
    );

    assert(
      examUpdateRes.success === true,
      "Online assistant successfully updated online exam"
    );

    const examCheck = await query("SELECT title, duration_minutes FROM online_exams WHERE id = $1", [testExamId]);
    assert(
      examCheck.rows[0].title === "امتحان تم تعديله بنجاح" && examCheck.rows[0].duration_minutes === 45,
      "Online exam title and duration updated in DB correctly"
    );

    // Clean up test exam
    await query("DELETE FROM online_exams WHERE id = $1", [testExamId]);
    console.log("[CLEANUP] Deleted temporary test exam.");

    // 7. Test update_assignment
    console.log("\n--- 7. update_assignment In-Place Execution ---");
    const assignInsert = await query(
      `INSERT INTO assignments (title, grade_id, deadline, full_mark, is_closed, deleted)
       VALUES ('واجب تجريبي', 1, NOW() + INTERVAL '1 day', 10, 0, 0)
       RETURNING id, title`
    );
    const testAssignId = assignInsert.rows[0].id;

    const assignUpdateRes = await executeAssistantTool(
      "update_assignment",
      {
        assignment_id: testAssignId,
        title: "واجب تم تعديل عنوانه",
        full_mark: 15,
      },
      { userId: 1, userRole: "assistant", permissions: "online_management" }
    );

    assert(
      assignUpdateRes.success === true,
      "Online assistant successfully updated assignment"
    );

    const assignCheck = await query("SELECT title, full_mark FROM assignments WHERE id = $1", [testAssignId]);
    assert(
      assignCheck.rows[0].title === "واجب تم تعديل عنوانه" && Number(assignCheck.rows[0].full_mark) === 15,
      "Assignment title and full_mark updated in DB correctly"
    );

    // Clean up test assignment
    await query("DELETE FROM assignments WHERE id = $1", [testAssignId]);
    console.log("[CLEANUP] Deleted temporary test assignment.");

    // 8. Test update_live_session
    console.log("\n--- 8. update_live_session In-Place Execution ---");
    const sessionInsert = await query(
      `INSERT INTO live_sessions (title, start_time, end_time, duration_minutes, target_type, grade_id, meet_link, status, deleted)
       VALUES ('حصة لايف تجريبية', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '60 minutes', 60, 'grade', 1, 'https://meet.google.com/test-meet-123', 'scheduled', 0)
       RETURNING id, title`
    );
    const testSessionId = sessionInsert.rows[0].id;

    const sessionUpdateRes = await executeAssistantTool(
      "update_live_session",
      {
        session_id: testSessionId,
        title: "حصة لايف تم تعديلها",
        duration_minutes: 90,
      },
      { userId: 1, userRole: "assistant", permissions: "online_management" }
    );

    assert(
      sessionUpdateRes.success === true,
      "Online assistant successfully updated live session"
    );

    const sessionCheck = await query("SELECT title, duration_minutes FROM live_sessions WHERE id = $1", [testSessionId]);
    assert(
      sessionCheck.rows[0].title === "حصة لايف تم تعديلها" && Number(sessionCheck.rows[0].duration_minutes) === 90,
      "Live session title and duration updated in DB correctly"
    );

    // Clean up test session
    await query("DELETE FROM live_sessions WHERE id = $1", [testSessionId]);
    console.log("[CLEANUP] Deleted temporary test live session.");

  } catch (err) {
    console.error("Test execution threw error:", err);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`TOTAL PASSED: ${passed}`);
  console.log(`TOTAL FAILED: ${failed}`);
  console.log("==================================================");

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
