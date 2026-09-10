const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create a reusable multer upload configuration
const createUpload = (options) => {
  const {
    uploadDir,
    allowedTypes = [],
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    errorMessages = {},
  } = options;

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
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
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        errorMessages.invalidType || "نوع الملف غير مسموح به"
      );
      cb(error);
    }
  };

  // Create multer instance
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });
};

module.exports = createUpload;