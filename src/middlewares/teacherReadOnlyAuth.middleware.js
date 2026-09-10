// Middleware to check teacher read-only permissions
const teacherReadOnlyAuth = (req, res, next) => {
  const readOnlyMethods = ["GET"];

  const isSuperAdmin = req.clientRole === "super_admin";
  const isAssistant = req.clientRole === "assistant";
  const isTeacherWithReadOnly =
    req.clientRole === "teacher" && readOnlyMethods.includes(req.method);

  if (isSuperAdmin || isAssistant || isTeacherWithReadOnly) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "المدرس لديه صلاحية قراءة فقط",
  });
};

module.exports = teacherReadOnlyAuth;
