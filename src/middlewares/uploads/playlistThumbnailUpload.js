const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directory if not exists
const uploadDir = "uploads/thumbnails";
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
  const allowedImages = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedImages.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png images allowed"));
  }
};

const playlistThumbnailUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = playlistThumbnailUpload;
