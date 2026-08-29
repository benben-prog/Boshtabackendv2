// preview.middleware.js
const path = require('path');

const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    try {
      // تحديد المسار الكامل للملف
      const fullPath = path.join(__dirname, '..', 'uploads', filePath);
      
      // إرسال الملف مباشرة
      return res.sendFile(fullPath, (err) => {
        if (err) {
          return res.status(404).json({
            success: false,
            message: "File not found or inaccessible",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error serving file",
      });
    }
  };
};

module.exports = previewFile;
