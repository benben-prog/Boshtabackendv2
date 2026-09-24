const createUpload = require("./baseUpload");

// Configure playlist thumbnail upload
const playlistThumbnailUpload = createUpload({
  uploadDir: "uploads/thumbnails",
  allowedTypes: ["image/jpeg", "image/jpg", "image/png"],
  allowedExtensions: ["jpg", "jpeg", "png"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  errorMessages: {
    invalidType: "مسموح فقط بالصور jpg و jpeg و png",
  },
});

module.exports = playlistThumbnailUpload;
