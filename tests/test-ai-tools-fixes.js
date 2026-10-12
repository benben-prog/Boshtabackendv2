const { executeAssistantTool } = require("../src/modules/ai/tools/assistant.tools");
const { query } = require("../src/config/database");
const { formatEgyptTime, getNowEgypt } = require("../src/utils/timezone");

async function runTests() {
  await query("SELECT 1").catch(() => {});
  console.log("=== STARTING AI TOOLS FIXES VERIFICATION TESTS ===");
  const nowEgypt = getNowEgypt();
  console.log("Current Egypt Time:", formatEgyptTime(nowEgypt));

  const teacherContext = {
    userId: 1,
    userRole: "teacher",
    permissions: "full",
  };

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      throw new Error(`Test failed: ${message}`);
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: create_online_exam with Cairo Timezone & No Early Expiry
    // ----------------------------------------------------
    console.log("\n--- TEST 1: create_online_exam Timezone & Expiry Check ---");
    const onlineExamRes = await executeAssistantTool(
      "create_online_exam",
      {
        title: "امتحان اختبار التوقيت التلقائي",
        start_at: "الساعة 11:45 مساءً",
        duration_minutes: 90,
        questions: [
          {
            question_text: "ما إعراب كلمة 'العلمُ' في: العلمُ نورٌ؟",
            question_type: "multiple_choice",
            degree: 2,
            options: [
              { option_text: "مبتدأ مرفوع", is_correct: true },
              { option_text: "خبر مرفوع", is_correct: false },
              { option_text: "فاعل مرفوع", is_correct: false },
              { option_text: "مفعول به", is_correct: false },
            ],
          },
        ],
      },
      teacherContext
    );

    assert(onlineExamRes.success === true, "create_online_exam succeeded");
    const createdExamId = onlineExamRes.exam.id;
    console.log("Created exam ID:", createdExamId);
    console.log("Start Cairo:", onlineExamRes.exam.start_at_cairo);
    console.log("End Cairo:", onlineExamRes.exam.end_at_cairo);

    // Verify DB record and compare with NOW() AT TIME ZONE 'Africa/Cairo'
    const examDbRes = await query(
      `SELECT id, title, start_at, end_at,
              (end_at < NOW() AT TIME ZONE 'Africa/Cairo') AS is_expired_in_db
       FROM online_exams WHERE id = $1`,
      [createdExamId]
    );
    assert(examDbRes.rows.length === 1, "Exam found in database");
    const examRow = examDbRes.rows[0];
    console.log("DB start_at:", examRow.start_at);
    console.log("DB end_at:", examRow.end_at);
    console.log("DB is_expired_in_db:", examRow.is_expired_in_db);

    // Notice: Since start_at was set to 11:45 PM today (or relative), end_at is later than now, so it MUST NOT be expired!
    assert(examRow.is_expired_in_db === false, "Exam is NOT immediately expired in database!");

    // Clean up exam
    await executeAssistantTool("delete_online_exam", { exam_id: createdExamId }, teacherContext);
    console.log("Cleaned up online exam test record.");

    // ----------------------------------------------------
    // TEST 2: create_assignment (Homework) with File Context & Cairo Deadline
    // ----------------------------------------------------
    console.log("\n--- TEST 2: create_assignment Distinction & File Context ---");
    const assignmentContext = {
      ...teacherContext,
      uploadedFilePath: "/uploads/assignments/arabic_homework_test.pdf",
      uploadedFileName: "arabic_homework_test.pdf",
    };

    const assignmentRes = await executeAssistantTool(
      "create_assignment",
      {
        title: "واجب إلكتروني على الوحدة الأولى نحو",
        description: "حل التدريبات المرفقة في شيت الواجب",
        deadline: "الساعة 10:00 مساءً",
        full_mark: 20,
      },
      assignmentContext
    );

    assert(assignmentRes.success === true, "create_assignment succeeded");
    const createdAssignmentId = assignmentRes.assignment.id;
    console.log("Created assignment ID:", createdAssignmentId);
    console.log("Assignment deadline:", assignmentRes.assignment.deadline);
    console.log("Assignment file_path:", assignmentRes.assignment.file_path);

    assert(assignmentRes.assignment.file_path === "/uploads/assignments/arabic_homework_test.pdf", "Assignment correctly received uploaded file path");

    const assignDbRes = await query("SELECT id, title, deadline, file_path FROM assignments WHERE id = $1", [createdAssignmentId]);
    assert(assignDbRes.rows.length === 1, "Assignment found in DB");
    assert(assignDbRes.rows[0].file_path === "/uploads/assignments/arabic_homework_test.pdf", "Assignment DB file_path matches");

    // Clean up assignment
    await query("DELETE FROM assignments WHERE id = $1", [createdAssignmentId]);
    console.log("Cleaned up assignment test record.");

    // ----------------------------------------------------
    // TEST 3: create_paper_exam with Defaults & Direct Execution
    // ----------------------------------------------------
    console.log("\n--- TEST 3: create_paper_exam Creation & Defaults ---");
    const paperExamRes = await executeAssistantTool(
      "create_paper_exam",
      {
        title: "امتحان ورقي شامل في السنتر",
        total_degree: 60,
      },
      teacherContext
    );

    assert(paperExamRes.success === true, "create_paper_exam succeeded");
    const createdPaperExamId = paperExamRes.exam.id;
    console.log("Created Paper Exam ID:", createdPaperExamId);
    console.log("Total degree:", paperExamRes.exam.total_degree);
    assert(Number(paperExamRes.exam.total_degree) === 60, "Paper exam total degree matches 60");

    const paperDbRes = await query("SELECT id, title, total_degree, exam_date FROM exams WHERE id = $1", [createdPaperExamId]);
    assert(paperDbRes.rows.length === 1, "Paper exam found in DB");

    // Clean up paper exam
    await query("DELETE FROM exams WHERE id = $1", [createdPaperExamId]);
    console.log("Cleaned up paper exam test record.");

    // ----------------------------------------------------
    // TEST 4: update_student_details Flexible Resolution & Attributes
    // ----------------------------------------------------
    console.log("\n--- TEST 4: update_student_details Flexible Resolution & Updates ---");
    // Create a temporary student to test update safely
    const firstGroup = await query("SELECT id, grade_id FROM groups WHERE deleted = 0 ORDER BY id ASC LIMIT 1");
    const gradeId = firstGroup.rows[0].grade_id;
    const groupId = firstGroup.rows[0].id;
    const testBarcode = "TEST_BC_" + Date.now();
    const parentToken = "pt_" + Date.now();

    const insertStudentRes = await query(
      `INSERT INTO students (full_name, phone, parent_phone, barcode, parent_token, grade_id, group_id, is_active, created_at, updated_at)
       VALUES ('طالب تجريبي للاختبار', '01011112222', '01033334444', $1, $2, $3, $4, true, NOW(), NOW())
       RETURNING id, full_name, barcode, phone`,
      [testBarcode, parentToken, gradeId, groupId]
    );
    const testStudentId = insertStudentRes.rows[0].id;
    console.log("Inserted test student with ID:", testStudentId, "and barcode:", testBarcode);

    // 4.1 Update using student_name: "الطالب طالب تجريبي للاختبار"
    const updateRes1 = await executeAssistantTool(
      "update_student_details",
      {
        student_name: "الطالب طالب تجريبي للاختبار",
        phone: "01099998888",
        parent_phone: "01077776666",
        notes: "تم تحديث البيانات بواسطة الذكاء الاصطناعي",
      },
      teacherContext
    );
    assert(updateRes1.success === true, "update_student_details with 'الطالب ...' prefix succeeded");
    console.log("Updated phone:", updateRes1.student.phone);
    assert(updateRes1.student.phone === "01099998888", "Student phone was updated");

    // 4.2 Update using student_id
    const updateRes2 = await executeAssistantTool(
      "update_student_details",
      {
        student_id: testStudentId,
        full_name: "طالب تجريبي محدث بالكامل",
      },
      teacherContext
    );
    assert(updateRes2.success === true, "update_student_details by ID succeeded");
    assert(updateRes2.student.full_name === "طالب تجريبي محدث بالكامل", "Student full_name was updated");

    // 4.3 Update barcode using student_barcode
    const newBarcode = "NEW_BC_" + Date.now();
    const updateRes3 = await executeAssistantTool(
      "update_student_details",
      {
        student_barcode: testBarcode,
        new_barcode: newBarcode,
      },
      teacherContext
    );
    assert(updateRes3.success === true, "update_student_details barcode change succeeded");
    assert(updateRes3.student.barcode === newBarcode, "Student new_barcode matches");

    // Verify in database
    const verifyDbStudent = await query("SELECT id, full_name, phone, barcode, notes FROM students WHERE id = $1", [testStudentId]);
    assert(verifyDbStudent.rows[0].full_name === "طالب تجريبي محدث بالكامل", "DB has updated name");
    assert(verifyDbStudent.rows[0].barcode === newBarcode, "DB has new barcode");

    // Clean up test student
    await query("DELETE FROM students WHERE id = $1", [testStudentId]);
    console.log("Cleaned up test student record.");

    console.log(`\n========================================`);
    console.log(`ALL TESTS PASSED SUCCESSFULLY! (${passedTests}/${totalTests})`);
    console.log(`========================================`);
    process.exit(0);
  } catch (err) {
    console.error("Test Suite Error:", err);
    process.exit(1);
  }
}

runTests();
