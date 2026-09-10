// Middleware to check if user is student or super admin
const studentAuth = (req, res, next) => {
  if (req.clientRole !== "student" && req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - الطالب فقط",
    });
  }
  next();
};

module.exports = studentAuth;
