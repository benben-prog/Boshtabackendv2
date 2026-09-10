const createUpload = require("./baseUpload");

// Configure exam file upload
const examUpload = createUpload({
  uploadDir: "uploads/exams",
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  errorMessages: {
    invalidType: "مسموح فقط بملفات PDF و Word والصور",
  },
});

module.exports = examUpload;
