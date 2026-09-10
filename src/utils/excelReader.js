const XLSX = require("xlsx");
const fs = require("fs");

// Read Excel file and convert to JSON
const readExcelFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("الملف غير موجود");
    }

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("الملف لا يحتوي على أي شيت");
    }

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false,
    });

    return data;
  } catch (error) {
    console.error("Error reading Excel file:", error.message);
    throw new Error(`فشل قراءة ملف Excel: ${error.message}`);
  }
};

// Clean and normalize Excel data
const cleanExcelData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("الملف فارغ");
  }

  // Remove empty rows
  const nonEmptyRows = data.filter((row) => {
    return Object.values(row).some(
      (value) => value !== "" && value !== null && value !== undefined,
    );
  });

  if (nonEmptyRows.length === 0) {
    throw new Error("الملف لا يحتوي على بيانات");
  }

  // Trim keys and values
  const cleanedData = nonEmptyRows.map((row) => {
    const cleanedRow = {};
    Object.keys(row).forEach((key) => {
      const trimmedKey = String(key).trim();
      let value = row[key];

      if (typeof value === "string") {
        value = value.trim();
      }

      cleanedRow[trimmedKey] = value;
    });
    return cleanedRow;
  });

  return cleanedData;
};

// Validate that required columns exist
const validateColumns = (data, requiredColumns) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("لا توجد بيانات للتحقق منها");
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

// Delete Excel file after processing
const deleteExcelFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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
