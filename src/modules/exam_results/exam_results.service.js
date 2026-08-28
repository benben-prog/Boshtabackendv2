const { query } = require("../../config/database");
const examResultQueries = require("./exam_results.queries");

// Create exam result
const createExamResult = async (examResultData) => {
  const { exam_id, student_id, degree, notes } = examResultData;
  const result = await query(examResultQueries.createExamResult, [
    exam_id,
    student_id,
    degree,
    notes,
  ]);
  return result.rows[0];
};

// Upsert exam result
const upsertExamResult = async (examResultData) => {
  const { exam_id, student_id, degree, notes } = examResultData;
  const result = await query(examResultQueries.upsertExamResult, [
    exam_id,
    student_id,
    degree,
    notes,
  ]);
  return result.rows[0];
};

// Upsert batch exam results
// بدل الفانكشن الحالية
const upsertBatchExamResults = async (examId, records) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    const { barcode, degree, notes = null } = record;

    // التحقق من وجود الباركود
    if (!barcode) {
      errors.push({ barcode: null, error: "الباركود مفقود" });
      errorCount++;
      continue;
    }

    // البحث عن الطالب بالباركود
    const studentResult = await query(
      "SELECT id, full_name FROM students WHERE barcode = $1 AND deleted = 0",
      [barcode],
    );
    const student = studentResult.rows[0];

    // لو الطالب مش موجود
    if (!student) {
      errors.push({ barcode, error: "الطالب غير موجود" });
      errorCount++;
      continue;
    }

    // تسجيل أو تحديث الدرجة
    try {
      const result = await query(examResultQueries.upsertExamResult, [
        examId,
        student.id,
        degree,
        notes,
      ]);

      if (result.rows[0]) {
        successCount++;
        results.push({
          barcode,
          student_id: student.id,
          student_name: student.full_name,
          degree,
          status: "success",
        });
      }
    } catch (error) {
      errorCount++;
      errors.push({
        barcode,
        student_name: student.full_name,
        error: error.message,
      });
    }
  }

  return {
    total_records: records.length,
    success_count: successCount,
    error_count: errorCount,
    results,
    errors,
  };
};
// Update exam result
const updateExamResult = async (id, examResultData) => {
  const { degree, notes } = examResultData;
  const result = await query(examResultQueries.updateExamResult, [
    degree,
    notes,
    id,
  ]);
  return result.rows[0];
};

// Delete exam result
const deleteExamResult = async (id) => {
  const result = await query(examResultQueries.deleteExamResult, [id]);
  return result.rows[0];
};

// Get exam results
const getExamResults = async (examId) => {
  const result = await query(examResultQueries.getExamResults, [examId]);
  return result.rows;
};

// Get exam result stats
const getExamResultStats = async (examId) => {
  const result = await query(examResultQueries.getExamResultStats, [examId]);
  return result.rows[0];
};

// Get grade exam results stats
const getGradeExamResultsStats = async (gradeId) => {
  const result = await query(examResultQueries.getGradeExamResultsStats, [
    gradeId,
  ]);
  return result.rows;
};

// Get group exam results stats
const getGroupExamResultsStats = async (groupId) => {
  const result = await query(examResultQueries.getGroupExamResultsStats, [
    groupId,
  ]);
  return result.rows;
};

module.exports = {
  createExamResult,
  upsertExamResult,
  upsertBatchExamResults,
  updateExamResult,
  deleteExamResult,
  getExamResults,
  getExamResultStats,
  getGradeExamResultsStats,
  getGroupExamResultsStats,
};
