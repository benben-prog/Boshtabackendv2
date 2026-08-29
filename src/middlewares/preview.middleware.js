// preview.middleware.js
const path = require('path');
const fs = require('fs');

const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // تنظيف المسار
    let cleanPath = filePath.replace(/^\/+/, '');
    
    // إذا كان المسار يبدأ بـ uploads/، قم بإزالته
    if (cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.substring(8);
    }

    // بناء المسار الكامل
    const fullPath = path.join(__dirname, '../uploads', cleanPath);
    
    console.log('Serving file:', fullPath); // للتصحيح

    // التحقق من وجود الملف قبل الإرسال
    if (!fs.existsSync(fullPath)) {
      console.error('File not found:', fullPath);
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // إرسال الملف مع معالجة الأخطاء
    res.sendFile(fullPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: "Error serving file",
            error: err.message
          });
        }
      }
    });
  };
};

module.exports = previewFile;
