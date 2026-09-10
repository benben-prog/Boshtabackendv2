// Middleware to check if user is assistant or super admin
const assistantAuth = (req, res, next) => {
  if (req.clientRole !== "assistant" && req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - المساعد فقط",
    });
  }
  next();
};

module.exports = assistantAuth;