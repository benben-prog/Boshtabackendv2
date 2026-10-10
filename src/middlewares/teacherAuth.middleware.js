// Middleware to check if user is teacher or super admin
const teacherAuth = (req, res, next) => {
  if (req.clientRole !== "teacher" && req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - المدرس فقط",
    });
  }
  next();
};

module.exports = teacherAuth;
