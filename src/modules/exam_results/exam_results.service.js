const { query } = require("../../config/database");
const examResultQueries = require("./exam_results.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const { formatEgyptTime } = require("../../utils/timezone");

// ============================================
// HELPER: Format exam date for WhatsApp
// ============================================

function formatExamDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return formatEgyptTime(date, "DD/MM/YYYY");
  } catch {
    return "";
  }
}

// ============================================
// HELPER: Format exam day for WhatsApp
// ============================================

function formatExamDay(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const egyptDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
    );

    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];

    return days[egyptDate.getDay()];
  } catch {
    return "";
  }
}

// ============================================
// HELPER: Validate degree against exam total
// ============================================

const validateDegree = (exam, degree) => {
  const numericDegree = Number(degree);

  if (isNaN(numericDegree)) {
    throw new Error("الدرجة يجب أن تكون رقماً");
  }

  if (numericDegree < 0) {
    throw new Error("الدرجة لا يمكن أن تكون سالبة");
  }

  if (numericDegree > Number(exam.total_degree)) {
    throw new Error(
      `الدرجة (${numericDegree}) تتجاوز الدرجة الكلية (${exam.total_degree})`,
    );
  }

  return numericDegree;
};

// ============================================
// HELPER: Enqueue WhatsApp notification
// ============================================

const enqueueExamNotification = async (student, exam, degree) => {
  try {
    const formattedDate = formatExamDate(exam.exam_date);
    const formattedDay = formatExamDay(exam.exam_date);

    const examData = {
      score: Number(degree) || 0,
      fullMark: Number(exam.total_degree) || 100,
      date: formattedDate || "غير محدد",
      day: formattedDay || "غير محدد",
    };

    const examMessage = whatsappDispatcher.generateExamMessage(
      student,
      examData,
    );

    await whatsappDispatcher.enqueueForStudentAndParent(student, "exam", {
      message: examMessage,
      examData,
    });
  } catch (error) {
    console.error("Error enqueueing exam result message:", error.message);
  }
};

// ============================================
// CREATE EXAM RESULT
// ============================================

const createExamResult = async (examResultData) => {
  const { exam_id, student_id, degree, notes } = examResultData;

  // Get exam
  const examResult = await query(examResultQueries.getExamById, [exam_id]);
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  // Validate degree
  const numericDegree = validateDegree(exam, degree);

  // Create result
  const result = await query(examResultQueries.createExamResult, [
    exam_id,
    student_id,
    numericDegree,
    notes,
  ]);

  const examResultRow = result.rows[0];

  // Send WhatsApp notification
  if (examResultRow) {
    const studentResult = await query(
      "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
      [student_id],
    );
    const student = studentResult.rows[0];

    if (student) {
      await enqueueExamNotification(student, exam, numericDegree);
    }
  }

  return examResultRow;
};

// ============================================
// UPSERT EXAM RESULT
// ============================================

const upsertExamResult = async (examResultData) => {
  const { exam_id, student_id, degree, notes } = examResultData;

  // Get exam
  const examResult = await query(examResultQueries.getExamById, [exam_id]);
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  // Validate degree
  const numericDegree = validateDegree(exam, degree);

  // Upsert result
  const result = await query(examResultQueries.upsertExamResult, [
    exam_id,
    student_id,
    numericDegree,
    notes,
  ]);

  const examResultRow = result.rows[0];

  // Send WhatsApp notification
  if (examResultRow) {
    const studentResult = await query(
      "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
      [student_id],
    );
    const student = studentResult.rows[0];

    if (student) {
      await enqueueExamNotification(student, exam, numericDegree);
    }
  }

  return examResultRow;
};

// ============================================
// UPSERT BATCH EXAM RESULTS (OPTIMIZED)
// ============================================

const upsertBatchExamResults = async (examId, records) => {
  // Get exam
  const examResultData = await query(examResultQueries.getExamById, [examId]);
  const exam = examResultData.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  // ============================================
  // Step 1: Collect all student IDs
  // ============================================

  const studentIds = records
    .map((r) => Number(r.student_id))
    .filter((id) => !isNaN(id) && id > 0);

  // Fetch all students in one query
  const studentsResult =
    studentIds.length > 0
      ? await query(examResultQueries.getStudentsByIds, [studentIds])
      : { rows: [] };

  const studentsMap = new Map(studentsResult.rows.map((s) => [s.id, s]));

  // ============================================
  // Step 2: Validate all records first
  // ============================================

  const validRows = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const recordIndex = i + 1;

    try {
      const { student_id, degree, notes = null } = record;

      // Validate student_id
      if (!student_id || isNaN(Number(student_id))) {
        throw new Error("الطالب مطلوب");
      }

      const studentId = Number(student_id);

      // Validate degree
      const numericDegree = validateDegree(exam, degree);

      // Check student exists
      const student = studentsMap.get(studentId);
      if (!student) {
        throw new Error(`الطالب غير موجود (ID: ${studentId})`);
      }

      // Check for duplicate in same batch
      const duplicate = validRows.find((r) => r.student_id === studentId);
      if (duplicate) {
        throw new Error(`الطالب مكرر في الطلب (ID: ${studentId})`);
      }

      validRows.push({
        record_index: recordIndex,
        student_id: studentId,
        degree: numericDegree,
        notes,
        student,
      });
    } catch (error) {
      errors.push({
        record_index: recordIndex,
        student_id: record.student_id || null,
        error: error.message,
        status: "error",
      });
      errorCount++;
    }
  }

  // ============================================
  // Step 3: Bulk upsert valid rows
  // ============================================

  if (validRows.length > 0) {
    try {
      const examIdsArr = validRows.map(() => examId);
      const studentIdsArr = validRows.map((r) => r.student_id);
      const degreesArr = validRows.map((r) => r.degree);
      const notesArr = validRows.map((r) => r.notes);

      const insertResult = await query(
        examResultQueries.bulkUpsertExamResults,
        [examIdsArr, studentIdsArr, degreesArr, notesArr],
      );

      const insertedResults = insertResult.rows;

      // Map results by student_id
      const insertedMap = new Map(
        insertedResults.map((r) => [r.student_id, r]),
      );

      // Build success records
      for (const row of validRows) {
        const inserted = insertedMap.get(row.student_id);

        results.push({
          record_index: row.record_index,
          student_id: row.student_id,
          student_name: row.student.full_name,
          barcode: row.student.barcode,
          degree: row.degree,
          exam_result_id: inserted?.id || null,
          status: "success",
        });
        successCount++;
      }

      // ============================================
      // Step 4: Send WhatsApp notifications
      // ============================================

      for (const row of validRows) {
        await enqueueExamNotification(row.student, exam, row.degree);
      }
    } catch (error) {
      console.error("Bulk upsert error:", error);
      throw new Error(`فشل إدخال الدرجات: ${error.message}`);
    }
  }

  return {
    exam_id: examId,
    exam_title: exam.title,
    total_degree: exam.total_degree,
    total_records: records.length,
    success_count: successCount,
    error_count: errorCount,
    results,
    errors,
  };
};

// ============================================
// UPDATE EXAM RESULT (OPTIMIZED)
// ============================================

const updateExamResult = async (id, examResultData) => {
  const { degree, notes } = examResultData;

  // Get result + exam in one query
  const existingResult = await query(examResultQueries.getExamResultWithExam, [
    id,
  ]);

  const existing = existingResult.rows[0];

  if (!existing) {
    throw new Error("النتيجة غير موجودة");
  }

  // Validate degree against existing exam
  const exam = {
    id: existing.exam_id,
    total_degree: existing.total_degree,
    exam_date: existing.exam_date,
  };

  const numericDegree = validateDegree(exam, degree);

  // Update
  const result = await query(examResultQueries.updateExamResult, [
    numericDegree,
    notes,
    id,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE EXAM RESULT
// ============================================

const deleteExamResult = async (id) => {
  const result = await query(examResultQueries.deleteExamResult, [id]);
  return result.rows[0];
};

// ============================================
// GETTERS
// ============================================

const getExamResults = async (examId) => {
  const result = await query(examResultQueries.getExamResults, [examId]);
  return result.rows;
};

const getExamResultStats = async (examId) => {
  const result = await query(examResultQueries.getExamResultStats, [examId]);
  return result.rows[0];
};

const getGradeExamResultsStats = async (gradeId) => {
  const result = await query(examResultQueries.getGradeExamResultsStats, [
    gradeId,
  ]);
  return result.rows;
};

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
