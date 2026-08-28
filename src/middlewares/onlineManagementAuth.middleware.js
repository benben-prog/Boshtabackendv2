const onlineManagementAuth = (req, res, next) => {
  if (
    req.clientRole === "super_admin" ||
    (req.clientRole === "assistant" &&
      (req.clientPermissions === "online_management" ||
        req.clientPermissions === "center_management"))
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - يتطلب صلاحية المنصة التعليمية",
    });
  }
};

module.exports = onlineManagementAuth;
