const multer = require("multer");
const path = require("path");
const { ensureUploadDir, wrapUpload } = require("../../utils/fileStorage");
const createUpload = require("./baseUpload");

// Directories for video files and thumbnails
const thumbnailDir = ensureUploadDir("videoFiles/thumbnails");
const filesDir = ensureUploadDir("videoFiles/files");

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
    cb(null, createUpload.generateSimpleFileName(file.originalname));
  },
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  try {
    const fixedName = Buffer.from(file.originalname, "latin1").toString("utf8");
    if (fixedName && !fixedName.includes("\ufffd") && fixedName !== file.originalname) {
      file.originalname = fixedName;
    }
  } catch (_) {}

  const rawExt = path.extname(file.originalname).toLowerCase().slice(1);
  const extension = rawExt.replace(/[^a-z0-9]/g, "");

  if (file.fieldname === "thumbnail") {
    const allowedImages = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedImages.includes(file.mimetype) && ["jpg", "jpeg", "png"].includes(extension)) {
      cb(null, true);
    } else {
      const error = new Error("مسموح فقط بالصور jpg و jpeg و png");
      error.code = "INVALID_FILE_TYPE";
      error.statusCode = 415;
      cb(error);
    }
  } else if (file.fieldname === "file") {
    const allowedFiles = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedFiles.includes(file.mimetype) && ["pdf", "doc", "docx"].includes(extension)) {
      cb(null, true);
    } else {
      const error = new Error("مسموح فقط بملفات PDF و Word");
      error.code = "INVALID_FILE_TYPE";
      error.statusCode = 415;
      cb(error);
    }
  } else {
    cb(new Error("اسم الحقل غير صحيح"));
  }
};

// Create multer instance
const videoFilesUpload = wrapUpload(
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 2,
      fields: 50,
      fieldSize: 1024 * 1024,
      parts: 52,
    },
  }),
);

module.exports = videoFilesUpload;
