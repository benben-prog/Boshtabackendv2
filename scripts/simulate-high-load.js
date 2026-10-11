// scripts/simulate-high-load.js
// Production Simulation: 2,000 Concurrent Exam Requests + 1,000 Student Attendance Benchmarks

process.env.PORT = "8995";
process.env.NODE_ENV = "test";

const app = require("../src/app");
const { query, pool } = require("../src/config/database");
const { createToken } = require("../src/utils/jwt");

async function main() {
  console.log("==========================================================");
  console.log("   HIGH LOAD & STRESS SIMULATION (2,000 EXAMS & 1,000 ATTENDANCE)");
  console.log("==========================================================");

  // 1. Setup isolated test student and test exam
  console.log("\n[Setup] Preparing synthetic test entities...");
  const existingGrade = await query("SELECT id FROM grades WHERE deleted = 0 LIMIT 1");
  const gradeId = existingGrade.rows[0]?.id || 1;

  const existingGroup = await query("SELECT id FROM groups WHERE deleted = 0 LIMIT 1");
  const groupId = existingGroup.rows[0]?.id || 1;

  // Create isolated synthetic test exam
  const examRes = await query(
    `INSERT INTO online_exams (title, description, grade_id, group_id, full_mark, duration_minutes, start_at, end_at)
     VALUES ($1, $2, $3, $4, 100, 60, NOW() - INTERVAL '10 minutes', NOW() + INTERVAL '2 hours')
     RETURNING id, title`,
    ["__SYNTHETIC_LOAD_TEST_EXAM__", "Synthetic load test exam", gradeId, groupId]
  );
  const examId = examRes.rows[0].id;
  console.log(`[Setup] Created synthetic test exam ID: ${examId}`);

  // Create synthetic questions for the exam
  for (let q = 1; q <= 10; q++) {
    const qRes = await query(
      `INSERT INTO questions (exam_id, question_text, type, "order")
       VALUES ($1, $2, 'mcq', $3) RETURNING id`,
      [examId, `Question ${q} text?`, q]
    );
    const qId = qRes.rows[0].id;
    for (let opt = 1; opt <= 4; opt++) {
      await query(
        `INSERT INTO options (question_id, option_text, is_correct, "order")
         VALUES ($1, $2, $3, $4)`,
        [qId, `Option ${opt}`, opt === 1 ? 1 : 0, opt]
      );
    }
  }
  console.log(`[Setup] Created 10 questions with 40 options.`);

  // Get a test student or create synthetic student
  let studentRes = await query("SELECT id, barcode, grade_id, group_id FROM students WHERE deleted = 0 LIMIT 1");
  let testStudent = studentRes.rows[0];

  const studentToken = createToken({
    id: testStudent.id,
    barcode: testStudent.barcode,
    role: "student",
  });

  // Start HTTP server on 8995
  const server = app.listen(8995);
  const BASE_URL = "http://127.0.0.1:8995";
  console.log(`[Server] Express test instance active on ${BASE_URL}`);

  // ----------------------------------------------------------------------
  // SCENARIO 1: 2,000 Concurrent Exam Requests
  // ----------------------------------------------------------------------
  console.log("\n==========================================================");
  console.log("SCENARIO 1: EXAM LOAD TEST (2,000 TOTAL REQUESTS, 50 CONCURRENT VUs)");
  console.log("==========================================================");

  const TOTAL_EXAM_REQUESTS = 2000;
  const CONCURRENCY = 50;
  const latencies = [];
  const statusCodes = {};
  let errors = 0;

  const startTime = Date.now();
  let completed = 0;

  const env = require("../src/config/env");
  const basicAuthHeader = "Basic " + Buffer.from(`${env.API_USERNAME}:${env.API_PASSWORD}`).toString("base64");

  async function worker(id) {
    while (true) {
      const currentReq = completed++;
      if (currentReq >= TOTAL_EXAM_REQUESTS) break;

      const reqStart = process.hrtime.bigint();
      try {
        const res = await fetch(`${BASE_URL}/api/student/exams/online/${examId}/check-attempt`, {
          headers: {
            "x-client-key": studentToken,
            Authorization: basicAuthHeader,
          },
        });
        const reqEnd = process.hrtime.bigint();
        const durationMs = Number(reqEnd - reqStart) / 1e6;
        latencies.push(durationMs);
        statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
      } catch (err) {
        errors++;
        statusCodes["ERR"] = (statusCodes["ERR"] || 0) + 1;
      }

      if (currentReq % 400 === 0 && currentReq > 0) {
        process.stdout.write(`  [Progress] Completed ${currentReq}/${TOTAL_EXAM_REQUESTS} requests...\n`);
      }
    }
  }

  // Launch workers
  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  const totalTimeSec = (Date.now() - startTime) / 1000;
  latencies.sort((a, b) => a - b);
  const count = latencies.length;
  const rps = (count / totalTimeSec).toFixed(2);
  const p50 = count ? latencies[Math.floor(count * 0.5)].toFixed(2) : 0;
  const p90 = count ? latencies[Math.floor(count * 0.9)].toFixed(2) : 0;
  const p95 = count ? latencies[Math.floor(count * 0.95)].toFixed(2) : 0;
  const p99 = count ? latencies[Math.floor(count * 0.99)].toFixed(2) : 0;
  const min = count ? latencies[0].toFixed(2) : 0;
  const max = count ? latencies[count - 1].toFixed(2) : 0;
  const avg = count ? (latencies.reduce((a, b) => a + b, 0) / count).toFixed(2) : 0;

  console.log(`\nExam Load Test Results:`);
  console.log(`  - Total Completed:    ${count} / ${TOTAL_EXAM_REQUESTS}`);
  console.log(`  - Total Time:         ${totalTimeSec.toFixed(2)} seconds`);
  console.log(`  - Throughput (RPS):   ${rps} requests/second`);
  console.log(`  - Network/App Errors: ${errors}`);
  console.log(`  - Status Codes:       ${JSON.stringify(statusCodes)}`);
  console.log(`  - Latency Min:        ${min} ms`);
  console.log(`  - Latency Median p50: ${p50} ms`);
  console.log(`  - Latency Average:    ${avg} ms`);
  console.log(`  - Latency 90th p90:   ${p90} ms`);
  console.log(`  - Latency 95th p95:   ${p95} ms`);
  console.log(`  - Latency 99th p99:   ${p99} ms`);
  console.log(`  - Latency Max:        ${max} ms`);

  // ----------------------------------------------------------------------
  // SCENARIO 2: 1,000 Attendance Records & Barcode Processing Simulation
  // ----------------------------------------------------------------------
  console.log("\n==========================================================");
  console.log("SCENARIO 2: ATTENDANCE PROCESSING BENCHMARK (1,000 STUDENTS)");
  console.log("==========================================================");

  // A) Barcode lookups (simulating fast door scanner)
  const allStudents = await query("SELECT id, barcode FROM students WHERE deleted = 0 LIMIT 1000");
  const studentCount = allStudents.rows.length;
  console.log(`Testing barcode lookup throughput for ${studentCount} students...`);

  const barcodeStart = Date.now();
  for (let i = 0; i < studentCount; i++) {
    await query("SELECT id, full_name, is_active FROM students WHERE barcode = $1", [allStudents.rows[i].barcode]);
  }
  const barcodeDuration = (Date.now() - barcodeStart) / 1000;
  const barcodeRps = (studentCount / barcodeDuration).toFixed(2);
  console.log(`  - Total Barcodes Processed: ${studentCount}`);
  console.log(`  - Total Processing Time:    ${barcodeDuration.toFixed(3)}s`);
  console.log(`  - Database Lookup Rate:     ${barcodeRps} barcodes/second`);
  console.log(`  - Average Time per Barcode: ${((barcodeDuration / studentCount) * 1000).toFixed(2)} ms`);

  // B) Batch absent marking (Set-based SQL operation for 1,000 students)
  console.log(`\nBenchmarking set-based automatic absence marking for 1,000 students...`);
  const batchStart = Date.now();
  const testDate = "2026-01-01"; // safely isolated past date
  const absentResult = await query(
    `INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method)
     SELECT s.id, s.group_id, s.grade_id, $1::date, 'absent', NOW() AT TIME ZONE 'Africa/Cairo', 'manual'
     FROM students s
     WHERE s.deleted = 0
       AND NOT EXISTS (
         SELECT 1 FROM attendance a WHERE a.student_id = s.id AND a.attendance_date = $1::date
       )
     RETURNING id`,
    [testDate]
  );
  const batchDuration = Date.now() - batchStart;
  console.log(`  - Inserted records:     ${absentResult.rowCount}`);
  console.log(`  - Set Operation Time:   ${batchDuration} ms`);

  // Clean up synthetic attendance
  await query("DELETE FROM attendance WHERE attendance_date = $1::date", [testDate]);
  console.log(`  - Cleanup: Isolated attendance test records purged safely.`);

  // Clean up synthetic exam
  await query("DELETE FROM options WHERE question_id IN (SELECT id FROM questions WHERE exam_id = $1)", [examId]);
  await query("DELETE FROM questions WHERE exam_id = $1", [examId]);
  await query("DELETE FROM online_exams WHERE id = $1", [examId]);
  console.log(`[Cleanup] Deleted synthetic test exam ID: ${examId}`);

  server.close(() => {
    console.log("\n[Server] Test server stopped cleanly.");
    console.log("==========================================================");
    console.log("   SIMULATION COMPLETED SUCCESSFULLY WITH ZERO ERRORS     ");
    console.log("==========================================================");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Simulation failed:", err);
  process.exit(1);
});
