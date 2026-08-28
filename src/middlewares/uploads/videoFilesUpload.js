const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if not exists
const thumbnailDir = "uploads/videoFiles/thumbnails";
const filesDir = "uploads/videoFiles/files";

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, thumbnailDir);
    } else if (file.fieldname === "file") {
      cb(null, filesDir);
    } else {
      cb(new Error("Invalid field name"));
    }
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
  if (file.fieldname === "thumbnail") {
    const allowedImages = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png images allowed"));
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
      cb(new Error("Only PDF and Word files allowed"));
    }
  } else {
    cb(new Error("Invalid field name"));
  }
};

const videoFilesUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = videoFilesUpload;
