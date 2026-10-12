const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { ensureUploadDir, wrapUpload } = require("../../utils/fileStorage");

const getSafeExtension = (originalname) => {
  if (!originalname) return "";
  let ext = path.extname(originalname).toLowerCase();
  ext = ext.replace(/[^a-z0-9.]/g, "");
  return ext;
};

const generateSimpleFileName = (originalname) => {
  const ext = getSafeExtension(originalname);
  const randomSuffix = crypto.randomBytes(4).toString("hex");
  return `${Date.now()}_${randomSuffix}${ext}`;
};

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
      cb(null, generateSimpleFileName(file.originalname));
    },
  });

  // Configure file filter
  const fileFilter = (req, file, cb) => {
    if (!file.originalname || file.originalname.trim() === "") {
      return cb(null, false);
    }

    try {
      const fixedName = Buffer.from(file.originalname, "latin1").toString("utf8");
      if (fixedName && !fixedName.includes("\ufffd") && fixedName !== file.originalname) {
        file.originalname = fixedName;
      }
    } catch (_) {}

    const rawExt = path.extname(file.originalname).toLowerCase().slice(1);
    const extension = rawExt.replace(/[^a-z0-9]/g, "");

    const validMime =
      allowedTypes.includes(file.mimetype) ||
      (file.mimetype === "application/octet-stream" && normalizedExtensions.includes(extension));
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

createUpload.generateSimpleFileName = generateSimpleFileName;
createUpload.getSafeExtension = getSafeExtension;

module.exports = createUpload;
