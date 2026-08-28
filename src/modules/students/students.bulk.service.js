const { query } = require("../../config/database");
const crypto = require("crypto");
const {
  validateEgyptianPhone,
  cleanPhone,
} = require("../../utils/excelValidator");

/**
 * توليد parent_token
 */
const generateParentToken = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * معالجة بيانات الطلاب من Excel
 * @param {Array} data - البيانات المنظفة
 * @returns {Object} - تقرير النتائج
 */
const processStudentsBulk = async (data) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  // مصفوفات للـ bulk insert
  const barcodes = [];
  const fullNames = [];
  const phones = [];
  const parentPhones = [];
  const parentTokens = [];
  const gradeIds = [];
  const groupIds = [];
  const notesList = [];

  // معالجة كل صف
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2; // +2 لأن الصف الأول هو العناوين

    try {
      // التحقق من البيانات المطلوبة
      const barcode = String(row.barcode || "").trim();
      const full_name = String(row.full_name || "").trim();
      const grade_name = String(row.grade_name || "").trim();
      const group_name = String(row.group_name || "").trim();

      if (!barcode) {
        throw new Error("الباركود مطلوب");
      }

      if (!full_name) {
        throw new Error("اسم الطالب مطلوب");
      }

      if (!grade_name) {
        throw new Error("اسم الصف مطلوب");
      }

      if (!group_name) {
        throw new Error("اسم المجموعة مطلوب");
      }

      // التحقق من الهاتف
      const phone = cleanPhone(row.phone);
      if (phone && !validateEgyptianPhone(phone)) {
        throw new Error(`رقم الهاتف غير صحيح: ${row.phone}`);
      }

      const parent_phone = cleanPhone(row.parent_phone);
      if (parent_phone && !validateEgyptianPhone(parent_phone)) {
        throw new Error(`رقم هاتف ولي الأمر غير صحيح: ${row.parent_phone}`);
      }

      // التحقق من عدم تكرار الباركود في الملف
      if (barcodes.includes(barcode)) {
        throw new Error(`الباركود مكرر في الملف: ${barcode}`);
      }

      // التحقق من عدم وجود الباركود في قاعدة البيانات
      const existingBarcode = await query(
        "SELECT id FROM students WHERE barcode = $1 AND deleted = 0",
        [barcode],
      );
      if (existingBarcode.rows[0]) {
        throw new Error(`الباركود موجود مسبقاً: ${barcode}`);
      }

      // البحث عن الصف
      const gradeResult = await query(
        "SELECT id FROM grades WHERE name = $1 AND deleted = 0",
        [grade_name],
      );
      const grade = gradeResult.rows[0];
      if (!grade) {
        throw new Error(`الصف غير موجود: ${grade_name}`);
      }

      // البحث عن المجموعة
      const groupResult = await query(
        "SELECT id FROM groups WHERE name = $1 AND grade_id = $2 AND deleted = 0",
        [group_name, grade.id],
      );
      const group = groupResult.rows[0];
      if (!group) {
        throw new Error(`المجموعة غير موجودة: ${group_name} في صف ${grade_name}`);
      }

      // إضافة البيانات للمصفوفات
      barcodes.push(barcode);
      fullNames.push(full_name);
      phones.push(phone);
      parentPhones.push(parent_phone);
      parentTokens.push(generateParentToken());
      gradeIds.push(grade.id);
      groupIds.push(group.id);
      notesList.push(row.notes ? String(row.notes).trim() : null);

      results.push({
        row_number: rowNumber,
        barcode,
        full_name,
        status: "success",
      });
      successCount++;
    } catch (error) {
      errors.push({
        row_number: rowNumber,
        barcode: row.barcode || null,
        error: error.message,
        status: "error",
      });
      errorCount++;
    }
  }

  // Bulk insert للصفوف الصحيحة
  if (barcodes.length > 0) {
    try {
      const insertResult = await query(
        `INSERT INTO students (barcode, full_name, phone, parent_phone, parent_token, grade_id, group_id, notes)
         SELECT * FROM UNNEST(
           $1::text[],
           $2::text[],
           $3::text[],
           $4::text[],
           $5::text[],
           $6::int[],
           $7::int[],
           $8::text[]
         )
         RETURNING id, barcode, full_name`,
        [
          barcodes,
          fullNames,
          phones,
          parentPhones,
          parentTokens,
          gradeIds,
          groupIds,
          notesList,
        ],
      );

      // تحديث النتائج بالـ IDs
      const insertedStudents = insertResult.rows;
      results.forEach((result) => {
        const inserted = insertedStudents.find(
          (s) => s.barcode === result.barcode,
        );
        if (inserted) {
          result.student_id = inserted.id;
        }
      });
    } catch (error) {
      console.error("❌ Bulk insert error:", error);
      // لو فشل الـ bulk insert، نرجع خطأ عام
      throw new Error(`فشل إدخال البيانات: ${error.message}`);
    }
  }

  return {
    total_rows: data.length,
    success_count: successCount,
    error_count: errorCount,
    success_records: results,
    error_records: errors,
  };
};

module.exports = {
  processStudentsBulk,
};