const { query } = require("../../config/database");
const { cleanNumber } = require("../../utils/excelValidator");

/**
 * معالجة بيانات الدرجات من Excel
 * @param {string|number} examId - معرف الامتحان
 * @param {Array} data - البيانات المنظفة
 * @returns {Object} - تقرير النتائج
 */
const processExamResultsBulk = async (examId, data) => {
  // التحقق من وجود الامتحان
  const examResult = await query(
    "SELECT id, title, total_degree, grade_id, group_id FROM exams WHERE id = $1 AND deleted = 0",
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

  // مصفوفات للـ bulk insert
  const barcodes = [];
  const examIds = [];
  const studentIds = [];
  const degrees = [];
  const notesList = [];

  // معالجة كل صف
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2; // +2 لأن الصف الأول هو العناوين

    try {
      // ✅ دعم اسم الطالب (اختياري) + الباركود (مطلوب) + الدرجة (مطلوبة)
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

      // التحقق من أن الدرجة لا تتجاوز الدرجة الكلية
      if (degree < 0) {
        throw new Error(`الدرجة لا يمكن أن تكون سالبة: ${degree}`);
      }

      if (degree > exam.total_degree) {
        throw new Error(
          `الدرجة (${degree}) تتجاوز الدرجة الكلية (${exam.total_degree})`,
        );
      }

      // التحقق من عدم تكرار الباركود في الملف
      if (barcodes.includes(barcode)) {
        throw new Error(`الباركود مكرر في الملف: ${barcode}`);
      }

      // البحث عن الطالب بالباركود
      const studentResult = await query(
        "SELECT id, full_name, grade_id, group_id FROM students WHERE barcode = $1 AND deleted = 0",
        [barcode],
      );
      const student = studentResult.rows[0];

      if (!student) {
        // ✅ لو الطالب مش موجود بالباركود، جرب البحث بالاسم
        if (studentName) {
          const studentByName = await query(
            "SELECT id, full_name, grade_id, group_id FROM students WHERE full_name = $1 AND deleted = 0",
            [String(studentName).trim()],
          );

          if (studentByName.rows[0]) {
            // ✅ الطالب موجود بالاسم - استخدمه
            const foundStudent = studentByName.rows[0];

            // التحقق من أن الطالب في نفس صف الامتحان
            if (exam.grade_id && foundStudent.grade_id !== exam.grade_id) {
              throw new Error(
                `الطالب ${foundStudent.full_name} ليس في صف الامتحان`,
              );
            }

            // التحقق من أن الطالب في نفس مجموعة الامتحان
            if (exam.group_id && foundStudent.group_id !== exam.group_id) {
              throw new Error(
                `الطالب ${foundStudent.full_name} ليس في مجموعة الامتحان`,
              );
            }

            // إضافة البيانات
            barcodes.push(barcode);
            examIds.push(examId);
            studentIds.push(foundStudent.id);
            degrees.push(degree);
            notesList.push(notes);

            results.push({
              row_number: rowNumber,
              barcode,
              student_name: foundStudent.full_name,
              degree,
              status: "success",
              matched_by: "name", // ✅ توضيح إنه اتطابق بالاسم
            });
            successCount++;
            continue; // ✅ انتقل للصف التالي
          }
        }

        throw new Error(`الطالب غير موجود: ${barcode}`);
      }

      // ✅ لو الطالب موجود بالباركود، تحقق من الاسم لو موجود
      if (studentName && student.full_name !== String(studentName).trim()) {
        throw new Error(
          `الباركود (${barcode}) لا يطابق الاسم (${studentName}) - الاسم الصحيح: ${student.full_name}`,
        );
      }

      // التحقق من أن الطالب في نفس صف الامتحان
      if (exam.grade_id && student.grade_id !== exam.grade_id) {
        throw new Error(`الطالب ${student.full_name} ليس في صف الامتحان`);
      }

      // التحقق من أن الطالب في نفس مجموعة الامتحان
      if (exam.group_id && student.group_id !== exam.group_id) {
        throw new Error(`الطالب ${student.full_name} ليس في مجموعة الامتحان`);
      }

      // إضافة البيانات للمصفوفات
      barcodes.push(barcode);
      examIds.push(examId);
      studentIds.push(student.id);
      degrees.push(degree);
      notesList.push(notes);

      results.push({
        row_number: rowNumber,
        barcode,
        student_name: student.full_name,
        degree,
        status: "success",
        matched_by: "barcode", // ✅ توضيح إنه اتطابق بالباركود
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

  // Bulk upsert للصفوف الصحيحة
  if (studentIds.length > 0) {
    try {
      // استخدام UNNEST مع ON CONFLICT للتحديث
      const insertResult = await query(
        `INSERT INTO exam_results (exam_id, student_id, degree, notes)
         SELECT * FROM UNNEST(
           $1::int[],
           $2::int[],
           $3::numeric[],
           $4::text[]
         )
         ON CONFLICT (exam_id, student_id)
         DO UPDATE SET
           degree = EXCLUDED.degree,
           notes = EXCLUDED.notes,
           updated_at = NOW()
         RETURNING id, student_id, degree`,
        [examIds, studentIds, degrees, notesList],
      );

      // تحديث النتائج بالـ IDs
      const insertedResults = insertResult.rows;
      results.forEach((result) => {
        const inserted = insertedResults.find(
          (r) => r.degree === result.degree,
        );
        if (inserted) {
          result.exam_result_id = inserted.id;
        }
      });
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
