const { query } = require("../../config/database");
const examResultQueries = require("./exam_results.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const { formatEgyptTime } = require("../../utils/timezone");

// Helper function to format exam date
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

// Helper function to format exam day
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

const createExamResult = async (examResultData) => {
  const { exam_id, student_id, degree, notes } = examResultData;
  const result = await query(examResultQueries.createExamResult, [
    exam_id,
    student_id,
    degree,
    notes,
  ]);

  const examResult = result.rows[0];

  if (examResult) {
    try {
      const studentResult = await query(
        "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
        [student_id],
      );
      const student = studentResult.rows[0];

      if (student) {
        const examInfoResult = await query(
          "SELECT id, title, total_degree, exam_date FROM exams WHERE id = $1 AND deleted = 0",
          [exam_id],
        );
        const exam = examInfoResult.rows[0];

        if (exam) {
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
        }
      }
    } catch (error) {
      console.error("Error enqueueing exam result message:", error);
    }
  }

  return examResult;
};

const upsertExamResult = async (examResultData) => {
  const { exam_id, student_id, degree, notes } = examResultData;
  const result = await query(examResultQueries.upsertExamResult, [
    exam_id,
    student_id,
    degree,
    notes,
  ]);

  const examResult = result.rows[0];

  if (examResult) {
    try {
      const studentResult = await query(
        "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
        [student_id],
      );
      const student = studentResult.rows[0];

      if (student) {
        const examInfoResult = await query(
          "SELECT id, title, total_degree, exam_date FROM exams WHERE id = $1 AND deleted = 0",
          [exam_id],
        );
        const exam = examInfoResult.rows[0];

        if (exam) {
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
        }
      }
    } catch (error) {
      console.error("Error enqueueing exam result message:", error);
    }
  }

  return examResult;
};

const upsertBatchExamResults = async (examId, records) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  const examResultData = await query(
    "SELECT id, title, total_degree, exam_date FROM exams WHERE id = $1 AND deleted = 0",
    [examId],
  );
  const exam = examResultData.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  const examDateFormatted = formatExamDate(exam.exam_date);
  const examDayFormatted = formatExamDay(exam.exam_date);

  for (const record of records) {
    const { barcode, degree, notes = null } = record;

    if (!barcode) {
      errors.push({ barcode: null, error: "الباركود مفقود" });
      errorCount++;
      continue;
    }

    const studentResult = await query(
      "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE barcode = $1 AND deleted = 0",
      [barcode],
    );
    const student = studentResult.rows[0];

    if (!student) {
      errors.push({ barcode, error: "الطالب غير موجود" });
      errorCount++;
      continue;
    }

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

        try {
          const examData = {
            score: Number(degree) || 0,
            fullMark: Number(exam.total_degree) || 100,
            date: examDateFormatted || "غير محدد",
            day: examDayFormatted || "غير محدد",
          };

          const examMessage = whatsappDispatcher.generateExamMessage(
            student,
            examData,
          );

          await whatsappDispatcher.enqueueForStudentAndParent(student, "exam", {
            message: examMessage,
            examData,
          });
        } catch (whatsappError) {
          console.error("Error enqueueing exam result message:", whatsappError);
        }
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

const updateExamResult = async (id, examResultData) => {
  const { degree, notes } = examResultData;
  const result = await query(examResultQueries.updateExamResult, [
    degree,
    notes,
    id,
  ]);
  return result.rows[0];
};

const deleteExamResult = async (id) => {
  const result = await query(examResultQueries.deleteExamResult, [id]);
  return result.rows[0];
};

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
