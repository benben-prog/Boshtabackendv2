// src/modules/exam_results/exam_results.bulk.service.js
const { query } = require("../../config/database");
const { cleanNumber } = require("../../utils/excelValidator");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const { formatEgyptTime } = require("../../utils/timezone");

const processExamResultsBulk = async (examId, data) => {
  const examResult = await query(
    "SELECT id, title, total_degree, grade_id, group_id, exam_date FROM exams WHERE id = $1 AND deleted = 0",
    [examId],
  );
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود!");
  }

  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  const barcodes = [];
  const examIds = [];
  const studentIds = [];
  const degrees = [];
  const notesList = [];

  const enrolledStudents = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    try {
      const barcode = String(row.barcode || "").trim();
      const studentName = row.student_name || row.full_name || row.name || "";
      const degree = cleanNumber(row.degree);
      const notes = row.notes ? String(row.notes).trim() : null;

      if (!barcode) {
        throw new Error("الباركود مطلوب");
      }

      if (degree === null || degree === undefined || isNaN(degree)) {
        throw new Error(`الدرجة غير صحيحة: ${row.degree}`);
      }

      if (degree < 0) {
        throw new Error(`الدرجة لا يمكن أن تكون سالبة: ${degree}`);
      }

      if (degree > exam.total_degree) {
        throw new Error(
          `الدرجة (${degree}) تتجاوز الدرجة الكلية (${exam.total_degree})`,
        );
      }

      if (barcodes.includes(barcode)) {
        throw new Error(`الباركود مكرر في الملف: ${barcode}`);
      }

      const studentResult = await query(
        "SELECT id, full_name, grade_id, group_id, phone, parent_phone, parent_token FROM students WHERE barcode = $1 AND deleted = 0",
        [barcode],
      );
      const student = studentResult.rows[0];

      if (!student) {
        if (studentName) {
          const studentByName = await query(
            "SELECT id, full_name, grade_id, group_id, phone, parent_phone, parent_token FROM students WHERE full_name = $1 AND deleted = 0",
            [String(studentName).trim()],
          );

          if (studentByName.rows[0]) {
            const foundStudent = studentByName.rows[0];

            if (exam.grade_id && foundStudent.grade_id !== exam.grade_id) {
              throw new Error(
                `الطالب ${foundStudent.full_name} ليس في صف الامتحان`,
              );
            }

            if (exam.group_id && foundStudent.group_id !== exam.group_id) {
              throw new Error(
                `الطالب ${foundStudent.full_name} ليس في مجموعة الامتحان`,
              );
            }

            barcodes.push(barcode);
            examIds.push(examId);
            studentIds.push(foundStudent.id);
            degrees.push(degree);
            notesList.push(notes);
            enrolledStudents.push(foundStudent);

            results.push({
              row_number: rowNumber,
              barcode,
              student_name: foundStudent.full_name,
              degree,
              status: "success",
              matched_by: "name",
            });
            successCount++;
            continue;
          }
        }

        throw new Error(`الطالب غير موجود: ${barcode}`);
      }

      if (studentName && student.full_name !== String(studentName).trim()) {
        throw new Error(
          `الباركود (${barcode}) لا يطابق الاسم (${studentName}) - الاسم الصحيح: ${student.full_name}`,
        );
      }

      if (exam.grade_id && student.grade_id !== exam.grade_id) {
        throw new Error(`الطالب ${student.full_name} ليس في صف الامتحان`);
      }

      if (exam.group_id && student.group_id !== exam.group_id) {
        throw new Error(`الطالب ${student.full_name} ليس في مجموعة الامتحان`);
      }

      barcodes.push(barcode);
      examIds.push(examId);
      studentIds.push(student.id);
      degrees.push(degree);
      notesList.push(notes);
      enrolledStudents.push(student);

      results.push({
        row_number: rowNumber,
        barcode,
        student_name: student.full_name,
        degree,
        status: "success",
        matched_by: "barcode",
      });
      successCount++;
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

  if (studentIds.length > 0) {
    try {
      const examDate = exam.exam_date
        ? formatEgyptTime(exam.exam_date, "DD/MM/YYYY")
        : "غير محدد";

      const dayName = exam.exam_date
        ? new Date(exam.exam_date).toLocaleString("en-US", {
            timeZone: "Africa/Cairo",
            weekday: "long",
          })
        : "غير محدد";

      const insertResult = await query(
        `INSERT INTO exam_results (exam_id, student_id, degree, notes)
         SELECT unnest($1::int[]), unnest($2::int[]), unnest($3::numeric[]), unnest($4::text[])
         ON CONFLICT (exam_id, student_id)
         DO UPDATE SET
           degree = EXCLUDED.degree,
           notes = EXCLUDED.notes,
           updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
         RETURNING id, student_id, degree`,
        [examIds, studentIds, degrees, notesList],
      );

      const insertedResults = insertResult.rows;

      results.forEach((result) => {
        const inserted = insertedResults.find(
          (r) => r.degree === result.degree,
        );
        if (inserted) {
          result.exam_result_id = inserted.id;
        }
      });

      // Send WhatsApp notifications
      for (let i = 0; i < enrolledStudents.length; i++) {
        try {
          const student = enrolledStudents[i];
          const degree = degrees[i];

          const examData = {
            score: Number(degree) || 0,
            fullMark: Number(exam.total_degree) || 100,
            date: examDate,
            day: dayName,
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
          console.error("Error enqueueing exam result message:", error);
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
