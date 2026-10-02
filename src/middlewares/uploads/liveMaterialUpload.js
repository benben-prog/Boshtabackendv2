const createUpload = require("./baseUpload");

// Configure base live session study materials upload
const baseUpload = createUpload({
  uploadDir: "uploads/live_materials",
  allowedTypes: [
    "application/pdf",
    "application/x-pdf",
    "application/acrobat",
    "applications/vnd.pdf",
    "text/pdf",
    "text/x-pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/doc",
    "application/ms-doc",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/powerpoint",
    "application/mspowerpoint",
    "application/x-mspowerpoint",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msexcel",
    "application/x-msexcel",
    "application/zip",
    "application/x-zip",
    "application/x-zip-compressed",
    "application/x-rar",
    "application/x-rar-compressed",
    "application/vnd.rar",
    "application/rar",
    "application/x-7z-compressed",
    "text/plain",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/octet-stream",
  ],
  allowedExtensions: [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "zip",
    "rar",
    "7z",
    "txt",
    "jpg",
    "jpeg",
    "png",
    "webp",
  ],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  errorMessages: {
    invalidType: "مسموح فقط بملفات PDF و Word و PowerPoint و Excel والصور والملفات المضغوطة والنصية",
  },
});

const uploadFields = baseUpload.fields([
  { name: "file", maxCount: 1 },
  { name: "material", maxCount: 1 },
  { name: "material_file", maxCount: 1 },
  { name: "attachment", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);

const flexibleSingle = (defaultFieldName = "file") => (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) return next(err);
    if (req.files) {
      const found =
        req.files[defaultFieldName]?.[0] ||
        req.files["file"]?.[0] ||
        req.files["material"]?.[0] ||
        req.files["material_file"]?.[0] ||
        req.files["attachment"]?.[0] ||
        req.files["document"]?.[0] ||
        (Array.isArray(req.files) ? req.files[0] : Object.values(req.files).flat()[0]) ||
        null;
      if (found) {
        req.file = found;
      }
    }
    next();
  });
};

const liveMaterialUpload = {
  ...baseUpload,
  single: flexibleSingle,
};

module.exports = liveMaterialUpload;
