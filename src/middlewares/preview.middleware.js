const fs = require("fs");
const { resolveStoredPath } = require("../utils/fileStorage");

// Middleware to preview files securely
const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "الملف غير موجود",
      });
    }

    const fullPath = resolveStoredPath(filePath);

    // Check if file exists within allowed storage root
    if (!fullPath || !fs.existsSync(fullPath)) {
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
