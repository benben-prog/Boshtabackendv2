const fs = require("fs");
const path = require("path");

// Middleware to preview files securely
const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "الملف غير موجود",
      });
    }

    // Remove leading slash if exists
    const cleanPath = filePath.replace(/^\//, "");
    const fullPath = path.join(process.cwd(), cleanPath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: "الملف غير موجود",
      });
    }

    // Send file directly
    return res.sendFile(fullPath);
  };
};

module.exports = previewFile;
