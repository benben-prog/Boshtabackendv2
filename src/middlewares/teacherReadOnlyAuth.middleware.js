const teacherReadOnlyAuth = (req, res, next) => {
  const readOnlyMethods = ["GET"];

  if (req.clientRole === "super_admin" || req.clientRole === "assistant") {
    next();
  } else if (
    req.clientRole === "teacher" &&
    readOnlyMethods.includes(req.method)
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "المدرس لديه صلاحية قراءة فقط",
    });
  }
};

module.exports = teacherReadOnlyAuth;
