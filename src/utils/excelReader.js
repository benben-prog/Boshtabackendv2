const XLSX = require("xlsx");
const fs = require("fs");

/**
 * قراءة ملف Excel وتحويله لـ JSON
 * @param {string} filePath - مسار الملف
 * @returns {Array} - مصفوفة من الكائنات
 */
const readExcelFile = (filePath) => {
  try {
    // التحقق من وجود الملف
    if (!fs.existsSync(filePath)) {
      throw new Error("الملف غير موجود!");
    }

    // قراءة الملف
    const workbook = XLSX.readFile(filePath);

    // جلب أول شيت
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("الملف لا يحتوي على أي شيت!");
    }

    const worksheet = workbook.Sheets[sheetName];

    // تحويل الشيت لـ JSON
    const data = XLSX.utils.sheet_to_json(worksheet, {
      defval: "", // القيمة الافتراضية للخلايا الفارغة
      raw: false, // تحويل كل القيم لنص
    });

    return data;
  } catch (error) {
    console.error(" Error reading Excel file:", error.message);
    throw new Error(`فشل قراءة ملف Excel: ${error.message}`);
  }
};

/**
 * تنظيف البيانات المقروءة
 * @param {Array} data - البيانات الخام
 * @returns {Array} - البيانات المنظفة
 */
const cleanExcelData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("الملف فارغ!");
  }

  // إزالة الصفوف الفارغة
  const nonEmptyRows = data.filter((row) => {
    return Object.values(row).some(
      (value) => value !== "" && value !== null && value !== undefined,
    );
  });

  if (nonEmptyRows.length === 0) {
    throw new Error("الملف لا يحتوي على بيانات!");
  }

  // تنظيف كل صف
  const cleanedData = nonEmptyRows.map((row) => {
    const cleanedRow = {};
    Object.keys(row).forEach((key) => {
      const trimmedKey = String(key).trim();
      let value = row[key];

      // تنظيف القيمة
      if (typeof value === "string") {
        value = value.trim();
      }

      cleanedRow[trimmedKey] = value;
    });
    return cleanedRow;
  });

  return cleanedData;
};

/**
 * التحقق من الأعمدة المطلوبة
 * @param {Array} data - البيانات
 * @param {Array} requiredColumns - الأعمدة المطلوبة
 * @returns {boolean} - هل الأعمدة موجودة
 */
const validateColumns = (data, requiredColumns) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("لا توجد بيانات للتحقق منها!");
  }

  const actualColumns = Object.keys(data[0]);
  const missingColumns = requiredColumns.filter(
    (col) => !actualColumns.includes(col),
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `الأعمدة المفقودة: ${missingColumns.join(", ")}\n` +
        `الأعمدة المتوقعة: ${requiredColumns.join(", ")}\n` +
        `الأعمدة الموجودة: ${actualColumns.join(", ")}`,
    );
  }

  return true;
};

/**
 * حذف ملف Excel بعد المعالجة
 * @param {string} filePath - مسار الملف
 */
const deleteExcelFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(` تم حذف الملف: ${filePath}`);
    }
  } catch (error) {
    console.error("Error deleting Excel file:", error.message);
  }
};

module.exports = {
  readExcelFile,
  cleanExcelData,
  validateColumns,
  deleteExcelFile,
};