const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directory if not exists
const uploadDir = "uploads/photos";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const originalname = path.basename(file.originalname, extension);
    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}-${originalname}${extension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
};

const profileImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = profileImageUpload;
