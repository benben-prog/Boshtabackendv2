const createUpload = require("./baseUpload");

// Configure Excel file upload
const excelUpload = createUpload({
  uploadDir: "uploads/excel",
  allowedTypes: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  allowedExtensions: ["xls", "xlsx"],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  errorMessages: {
    invalidType: "مسموح فقط بملفات Excel",
  },
});

module.exports = excelUpload;
