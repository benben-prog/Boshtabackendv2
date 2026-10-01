const createUpload = require("./baseUpload");

// Configure live session study materials upload
const liveMaterialUpload = createUpload({
  uploadDir: "uploads/live_materials",
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ],
  allowedExtensions: [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "zip",
    "rar",
    "jpg",
    "jpeg",
    "png",
    "webp",
  ],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  errorMessages: {
    invalidType: "مسموح فقط بملفات PDF و Word و PowerPoint و Excel والصور والملفات المضغوطة",
  },
});

module.exports = liveMaterialUpload;
