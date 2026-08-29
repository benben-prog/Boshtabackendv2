const path = require("path");

const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ✅ نفس منطق الـ download بالظبط
    const absolutePath = path.join(__dirname, "../../../", filePath);

    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".doc") contentType = "application/msword";
    else if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline"); // ← الفرق الوحيد عن download

    return res.sendFile(absolutePath);
  };
};

module.exports = previewFile;
