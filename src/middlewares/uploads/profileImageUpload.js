const createUpload = require("./baseUpload");

// Configure profile image upload
const profileImageUpload = createUpload({
  uploadDir: "uploads/photos",
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  errorMessages: {
    invalidType: "مسموح فقط بالصور",
  },
});

module.exports = profileImageUpload;
