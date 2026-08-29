// preview.middleware.js
const path = require('path');
const fs = require('fs');

const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // تنظيف المسار من أي "/" في البداية
    let cleanPath = filePath.replace(/^\/+/, '');
    
    // بناء المسار المطلق. افترض أن مجلد "uploads" في جذر المشروع
    // قد تحتاج لتعديل هذا المسار حسب هيكل مشروعك الفعلي
    const fullPath = path.join(__dirname, '../../uploads', cleanPath); 

    // التحقق من وجود الملف
    if (!fs.existsSync(fullPath)) {
      console.error('File not found at:', fullPath); // للتصحيح
      return res.status(404).json({ success: false, message: "File not found on server" });
    }

    // إرسال الملف
    res.sendFile(fullPath);
  };
};

module.exports = previewFile;
