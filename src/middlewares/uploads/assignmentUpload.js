const createUpload = require("./baseUpload");

// Configure assignment file upload
const assignmentUpload = createUpload({
  uploadDir: "uploads/assignments",
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

module.exports = assignmentUpload;
