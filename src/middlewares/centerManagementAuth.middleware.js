// Middleware to check center management permissions
const centerManagementAuth = (req, res, next) => {
  const isSuperAdmin = req.clientRole === "super_admin";
  const isAssistantWithCenterAccess =
    req.clientRole === "assistant" &&
    req.clientPermissions === "center_management";

  if (isSuperAdmin || isAssistantWithCenterAccess) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "غير مصرح لك بالوصول - يتطلب صلاحية إدارة كاملة",
  });
};

module.exports = centerManagementAuth;
