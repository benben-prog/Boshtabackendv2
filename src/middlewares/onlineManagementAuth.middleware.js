// Middleware to check online management permissions
const onlineManagementAuth = (req, res, next) => {
  const isSuperAdmin = req.clientRole === "super_admin";
  const isAssistantWithOnlineAccess =
    req.clientRole === "assistant" &&
    (req.clientPermissions === "online_management" ||
      req.clientPermissions === "center_management");

  if (isSuperAdmin || isAssistantWithOnlineAccess) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "غير مصرح لك بالوصول - يتطلب صلاحية المنصة التعليمية",
  });
};

module.exports = onlineManagementAuth;
