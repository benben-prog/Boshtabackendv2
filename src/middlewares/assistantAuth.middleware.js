// Middleware to check if user is assistant or super admin
const assistantAuth = (req, res, next) => {
  const url = req.originalUrl || req.url || req.path || "";
  if (
    (req.method === "GET" || req.method === "HEAD") &&
    (url.includes("/download") ||
      url.includes("/preview") ||
      url.includes("/template") ||
      url.includes("/pdf") ||
      url.includes("/excel"))
  ) {
    return next();
  }

  if (req.clientRole !== "assistant" && req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - المساعد فقط",
    });
  }
  next();
};

module.exports = assistantAuth;