const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { ensureUploadDir, wrapUpload } = require("../../utils/fileStorage");

// Create a reusable multer upload configuration
const createUpload = (options) => {
  const {
    uploadDir,
    allowedTypes = [],
    allowedExtensions = [],
    maxFileSize = 10 * 1024 * 1024,
    maxFiles = 1,
    errorMessages = {},
  } = options;

  const destinationDir = ensureUploadDir(uploadDir);
  const normalizedExtensions = allowedExtensions.map((extension) =>
    extension.toLowerCase().replace(/^\./, ""),
  );

  // Configure storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${extension}`);
    },
  });

  // Configure file filter
  const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase().slice(1);
    const validMime = allowedTypes.includes(file.mimetype);
    const validExtension =
      normalizedExtensions.length === 0 || normalizedExtensions.includes(extension);
    if (validMime && validExtension) return cb(null, true);
    const error = new Error(errorMessages.invalidType || "نوع الملف غير مسموح به");
    error.code = "INVALID_FILE_TYPE";
    error.statusCode = 415;
    cb(error);
  };

  // Create multer instance
  return wrapUpload(multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
      fields: 50,
      fieldSize: 1024 * 1024,
      parts: maxFiles + 50,
    },
  }));
};

module.exports = createUpload;
