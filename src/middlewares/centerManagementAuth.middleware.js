const centerManagementAuth = (req, res, next) => {
  if (
    req.clientRole === "super_admin" ||
    (req.clientRole === "assistant" &&
      req.clientPermissions === "center_management")
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - يتطلب صلاحية إدارة كاملة",
    });
  }
};

module.exports = centerManagementAuth;
