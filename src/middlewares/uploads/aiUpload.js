const createUpload = require("./baseUpload");

const aiUpload = createUpload({
  uploadDir: "ai_files",
  allowedTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  allowedExtensions: ["pdf", "jpg", "jpeg", "png", "webp"],
  maxFileSize: 25 * 1024 * 1024, // 25 MB
  maxFiles: 1,
  errorMessages: {
    invalidType: "نوع الملف غير مدعوم. يرجى رفع ملف PDF أو صورة (JPG, PNG, WEBP)",
    fileTooLarge: "حجم الملف كبير جداً. الحد الأقصى 25 ميجابايت",
  },
});

module.exports = aiUpload;
