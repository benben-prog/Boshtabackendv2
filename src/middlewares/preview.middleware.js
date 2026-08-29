const previewFile = (filePath) => {
  return (req, res) => {
    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // إزالة / من الأول لو موجودة
    const cleanPath = filePath.replace(/^\//, "");

    // ✅ Redirect للـ static URL
    return res.redirect(`/uploads/${cleanPath}`);
  };
};

module.exports = previewFile;
