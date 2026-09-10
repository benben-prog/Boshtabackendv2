const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Directories for video files and thumbnails
const thumbnailDir = "uploads/videoFiles/thumbnails";
const filesDir = "uploads/videoFiles/files";

// Ensure both directories exist
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// Configure storage for video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, thumbnailDir);
    } else if (file.fieldname === "file") {
      cb(null, filesDir);
    } else {
      cb(new Error("اسم الحقل غير صحيح"));
    }
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}${extension}`;
    cb(null, fileName);
  },
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    const allowedImages = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("مسموح فقط بالصور jpg و jpeg و png"));
    }
  } else if (file.fieldname === "file") {
    const allowedFiles = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedFiles.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("مسموح فقط بملفات PDF و Word"));
    }
  } else {
    cb(new Error("اسم الحقل غير صحيح"));
  }
};

// Create multer instance
const videoFilesUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = videoFilesUpload;
