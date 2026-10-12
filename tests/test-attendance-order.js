const { query } = require("../src/config/database");
const attendanceService = require("../src/modules/attendance/attendance.service");
const { renderAttendanceReportHtml } = require("../src/utils/pdfHtmlExporter");

async function runTests() {
  console.log("==================================================");
  console.log("   AUTOMATED VERIFICATION: ATTENDANCE ORDERING    ");
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
    await query("SELECT 1").catch(() => {});
    // 1. Setup temporary group and students
    const today = "2026-10-11";
    const groupRes = await query(
      `INSERT INTO groups (name, grade_id, days, start_time, end_time, deleted)
       VALUES ('مجموعة اختبار الترتيب', 1, '["Sunday"]', '10:00', '12:00', 0)
       RETURNING id, name`
    );
    const testGroupId = groupRes.rows[0].id;

    // Create 4 students with names designed to test sorting:
    // Student 1: "أحمد غائب" (absent - starts with A)
    // Student 2: "زياد حاضر" (present - starts with Z)
    // Student 3: "إبراهيم حاضر" (present - starts with E)
    // Student 4: "ياسر غائب" (absent - starts with Y)
    const std1 = await query(
      `INSERT INTO students (full_name, barcode, phone, group_id, grade_id, parent_token, deleted, is_active)
       VALUES ('أحمد غائب', 'BAR_ORD_01', '01011111111', $1, 1, 'TOK_ORD_01', 0, true) RETURNING id`,
      [testGroupId]
    );
    const std2 = await query(
      `INSERT INTO students (full_name, barcode, phone, group_id, grade_id, parent_token, deleted, is_active)
       VALUES ('زياد حاضر', 'BAR_ORD_02', '01022222222', $1, 1, 'TOK_ORD_02', 0, true) RETURNING id`,
      [testGroupId]
    );
    const std3 = await query(
      `INSERT INTO students (full_name, barcode, phone, group_id, grade_id, parent_token, deleted, is_active)
       VALUES ('إبراهيم حاضر', 'BAR_ORD_03', '01033333333', $1, 1, 'TOK_ORD_03', 0, true) RETURNING id`,
      [testGroupId]
    );
    const std4 = await query(
      `INSERT INTO students (full_name, barcode, phone, group_id, grade_id, parent_token, deleted, is_active)
       VALUES ('ياسر غائب', 'BAR_ORD_04', '01044444444', $1, 1, 'TOK_ORD_04', 0, true) RETURNING id`,
      [testGroupId]
    );

    // Insert attendance records:
    // std1 (أحمد) -> absent
    // std2 (زياد) -> present
    // std3 (إبراهيم) -> present
    // std4 (ياسر) -> absent
    await query(
      `INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method)
       VALUES ($1, $2, 1, $3, 'absent', NOW(), 'manual')`,
      [std1.rows[0].id, testGroupId, today]
    );
    await query(
      `INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method)
       VALUES ($1, $2, 1, $3, 'present', NOW(), 'barcode')`,
      [std2.rows[0].id, testGroupId, today]
    );
    await query(
      `INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method)
       VALUES ($1, $2, 1, $3, 'present', NOW(), 'barcode')`,
      [std3.rows[0].id, testGroupId, today]
    );
    await query(
      `INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method)
       VALUES ($1, $2, 1, $3, 'absent', NOW(), 'manual')`,
      [std4.rows[0].id, testGroupId, today]
    );

    // 2. Fetch using attendanceService.getAttendanceByGroupAndDate
    console.log("--- 1. Testing getAttendanceByGroupAndDate SQL Sorting ---");
    const records = await attendanceService.getAttendanceByGroupAndDate(testGroupId, today);

    assert(records.length === 4, `Returned 4 records (actual: ${records.length})`);

    // Verify ordering:
    // Present students must be indexes 0 and 1
    // Absent students must be indexes 2 and 3
    assert(
      records[0].status === "present" && records[1].status === "present",
      `First two records are attendees (present): [${records[0].full_name} (${records[0].status}), ${records[1].full_name} (${records[1].status})]`
    );

    assert(
      records[2].status === "absent" && records[3].status === "absent",
      `Last two records are absentees (absent): [${records[2].full_name} (${records[2].status}), ${records[3].full_name} (${records[3].status})]`
    );

    // Verify alphabetical sort within each status group:
    // Within present: "إبراهيم حاضر" comes before "زياد حاضر"
    assert(
      records[0].full_name === "إبراهيم حاضر" && records[1].full_name === "زياد حاضر",
      `Present students are alphabetically sorted: [1: ${records[0].full_name}, 2: ${records[1].full_name}]`
    );

    // Within absent: "أحمد غائب" comes before "ياسر غائب"
    assert(
      records[2].full_name === "أحمد غائب" && records[3].full_name === "ياسر غائب",
      `Absent students are alphabetically sorted: [3: ${records[2].full_name}, 4: ${records[3].full_name}]`
    );

    // 3. Testing PDF Exporter Generator renderAttendanceReportHtml
    console.log("\n--- 2. Testing renderAttendanceReportHtml ---");
    // Pass intentionally reversed array to renderAttendanceReportHtml to test its own internal sorting safeguard
    const reversedRecords = [...records].reverse();
    const htmlReport = renderAttendanceReportHtml({
      attendance: reversedRecords,
      meta: {
        title: "كشف حضور وغياب تجريبي",
        groupName: "مجموعة اختبار الترتيب",
        date: today,
      },
    });

    assert(
      htmlReport.includes("كشف الحضور والغياب") || htmlReport.includes("كشف حضور وغياب تجريبي"),
      "HTML Report contains report title"
    );

    assert(
      htmlReport.includes("عدد الحاضرين") && htmlReport.includes("عدد الغائبين"),
      "HTML Report contains stats cards for attendees and absentees"
    );

    assert(
      htmlReport.includes("window.print()"),
      "HTML Report includes print/PDF button with window.print()"
    );

    // Check that in the generated HTML table, "إبراهيم حاضر" appears before "أحمد غائب"
    const posEbrahim = htmlReport.indexOf("إبراهيم حاضر");
    const posZeyad = htmlReport.indexOf("زياد حاضر");
    const posAhmed = htmlReport.indexOf("أحمد غائب");
    const posYasser = htmlReport.indexOf("ياسر غائب");

    assert(
      posEbrahim !== -1 && posZeyad !== -1 && posAhmed !== -1 && posYasser !== -1,
      "All 4 students are rendered in HTML report"
    );

    assert(
      posEbrahim < posAhmed && posZeyad < posAhmed,
      `In HTML report, all present students appear BEFORE absent students: (Ebrahim: ${posEbrahim}, Zeyad: ${posZeyad} < Ahmed: ${posAhmed}, Yasser: ${posYasser})`
    );

    // 3. Testing controller exportAttendancePdf handler
    console.log("\n--- 3. Testing exportAttendancePdf controller ---");
    const attendanceController = require("../src/modules/attendance/attendance.controller");
    let sentStatus = null;
    let sentHeaders = {};
    let sentBody = "";
    const mockReq = {
      params: { groupId: testGroupId, date: today },
      query: {},
    };
    const mockRes = {
      status(code) { sentStatus = code; return this; },
      setHeader(name, val) { sentHeaders[name] = val; },
      send(body) { sentBody = body; return this; },
    };
    await attendanceController.exportAttendancePdf(mockReq, mockRes, (err) => { if (err) throw err; });

    assert(
      sentHeaders["Content-Type"]?.includes("text/html"),
      "exportAttendancePdf sets Content-Type to text/html"
    );
    assert(
      sentBody.includes("كشف الحضور والغياب") && sentBody.includes("مجموعة اختبار الترتيب"),
      "exportAttendancePdf sends HTML report with group name"
    );

    // 4. Clean up test data
    console.log("\n--- 4. Cleanup ---");
    await query("DELETE FROM attendance WHERE group_id = $1", [testGroupId]);
    await query("DELETE FROM students WHERE group_id = $1", [testGroupId]);
    await query("DELETE FROM groups WHERE id = $1", [testGroupId]);
    console.log("[CLEANUP] Deleted test attendance, students, and group.");

  } catch (err) {
    console.error("Test error:", err);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`TOTAL PASSED: ${passed}`);
  console.log(`TOTAL FAILED: ${failed}`);
  console.log("==================================================");

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
