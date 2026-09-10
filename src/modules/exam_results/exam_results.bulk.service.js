// src/modules/exam_results/exam_results.bulk.service.js
const { query } = require("../../config/database");
const { cleanNumber } = require("../../utils/excelValidator");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const { formatEgyptTime } = require("../../utils/timezone");
const examResultQueries = require("./exam_results.queries");

// ============================================
// HELPER: Format exam date
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
// HELPER: Format exam day
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
// PROCESS EXAM RESULTS BULK (OPTIMIZED)
// ============================================

const processExamResultsBulk = async (examId, data) => {
  // ============================================
  // Get exam details
  // ============================================

  const examResult = await query(examResultQueries.getExamById, [examId]);
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  // ============================================
  // Batch fetch students by barcodes AND names
  // ============================================

  const barcodes = data
    .map((row) => String(row.barcode || "").trim())
    .filter(Boolean);

  const studentNames = data
    .map((row) =>
      String(row.student_name || row.full_name || row.name || "").trim(),
    )
    .filter(Boolean);

  const [studentsByBarcodeResult, studentsByNameResult] = await Promise.all([
    barcodes.length > 0
      ? query(examResultQueries.getStudentsByBarcodes, [barcodes])
      : Promise.resolve({ rows: [] }),
    studentNames.length > 0
      ? query(examResultQueries.getStudentsByNames, [studentNames])
      : Promise.resolve({ rows: [] }),
  ]);

  const studentsByBarcode = new Map(
    studentsByBarcodeResult.rows.map((s) => [s.barcode, s]),
  );

  const studentsByName = new Map(
    studentsByNameResult.rows.map((s) => [s.full_name, s]),
  );

  // ============================================
  // Prepare bulk insert data
  // ============================================

  const validRows = [];
  const usedBarcodes = new Set();

  // ============================================
  // Process each row
  // ============================================

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    try {
      const barcode = String(row.barcode || "").trim();
      const studentName = String(
        row.student_name || row.full_name || row.name || "",
      ).trim();
      const degree = cleanNumber(row.degree);
      const notes = row.notes ? String(row.notes).trim() : null;

      // ============================================
      // Validation
      // ============================================

      if (!barcode) {
        throw new Error("الباركود مطلوب");
      }

      if (degree === null || degree === undefined || isNaN(degree)) {
        throw new Error(`الدرجة غير صحيحة: ${row.degree}`);
      }

      if (degree < 0) {
        throw new Error(`الدرجة لا يمكن أن تكون سالبة: ${degree}`);
      }

      // ✅ Validation: Check against exam total
      if (Number(degree) > Number(exam.total_degree)) {
        throw new Error(
          `الدرجة (${degree}) تتجاوز الدرجة الكلية (${exam.total_degree})`,
        );
      }

      if (usedBarcodes.has(barcode)) {
        throw new Error(`الباركود مكرر في الملف: ${barcode}`);
      }

      // ============================================
      // Find student
      // ============================================

      let student = studentsByBarcode.get(barcode);
      let matchedBy = "barcode";

      if (!student && studentName) {
        student = studentsByName.get(studentName);
        matchedBy = "name";
      }

      if (!student) {
        throw new Error(`الطالب غير موجود: ${barcode}`);
      }

      // ============================================
      // Validate student belongs to exam
      // ============================================

      if (exam.grade_id && student.grade_id !== exam.grade_id) {
        throw new Error(`الطالب ${student.full_name} ليس في صف الامتحان`);
      }

      if (exam.group_id && student.group_id !== exam.group_id) {
        throw new Error(`الطالب ${student.full_name} ليس في مجموعة الامتحان`);
      }

      // ============================================
      // Validate name match (if provided)
      // ============================================

      if (
        studentName &&
        student.full_name !== studentName &&
        matchedBy === "barcode"
      ) {
        throw new Error(
          `الباركود (${barcode}) لا يطابق الاسم (${studentName}) - الاسم الصحيح: ${student.full_name}`,
        );
      }

      // ============================================
      // Add to valid rows
      // ============================================

      usedBarcodes.add(barcode);

      validRows.push({
        row_number: rowNumber,
        barcode,
        student_id: student.id,
        student,
        degree,
        notes,
        matched_by: matchedBy,
      });
    } catch (error) {
      errors.push({
        row_number: rowNumber,
        barcode: row.barcode || null,
        student_name: row.student_name || row.full_name || row.name || null,
        error: error.message,
        status: "error",
      });
      errorCount++;
    }
  }

  // ============================================
  // Bulk insert valid rows
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

      // Map by student_id
      const insertedMap = new Map(
        insertedResults.map((r) => [r.student_id, r]),
      );

      // Build success records
      for (const row of validRows) {
        const inserted = insertedMap.get(row.student_id);

        results.push({
          row_number: row.row_number,
          barcode: row.barcode,
          student_id: row.student_id,
          student_name: row.student.full_name,
          degree: row.degree,
          exam_result_id: inserted?.id || null,
          status: "success",
          matched_by: row.matched_by,
        });
        successCount++;
      }

      // ============================================
      // Send WhatsApp notifications
      // ============================================

      const examDate = exam.exam_date
        ? formatEgyptTime(exam.exam_date, "DD/MM/YYYY")
        : "غير محدد";
      const dayName = formatExamDay(exam.exam_date) || "غير محدد";

      for (const row of validRows) {
        try {
          const examData = {
            score: Number(row.degree) || 0,
            fullMark: Number(exam.total_degree) || 100,
            date: examDate,
            day: dayName,
          };

          const examMessage = whatsappDispatcher.generateExamMessage(
            row.student,
            examData,
          );

          await whatsappDispatcher.enqueueForStudentAndParent(
            row.student,
            "exam",
            {
              message: examMessage,
              examData,
            },
          );
        } catch (error) {
          console.error("Error enqueueing exam result message:", error.message);
        }
      }
    } catch (error) {
      console.error("Bulk insert error:", error);
      throw new Error(`فشل إدخال الدرجات: ${error.message}`);
    }
  }

  return {
    exam_id: examId,
    exam_title: exam.title,
    total_degree: exam.total_degree,
    total_rows: data.length,
    success_count: successCount,
    error_count: errorCount,
    success_records: results,
    error_records: errors,
  };
};

module.exports = {
  processExamResultsBulk,
};
