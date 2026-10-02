const { query } = require("../config/database");

// Middleware to check if user is student or super admin, and enforce force logout if deleted/inactive
const studentAuth = async (req, res, next) => {
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

  if (req.clientRole === "super_admin") {
    return next();
  }

  if (req.clientRole !== "student") {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول - الطالب فقط",
    });
  }

  try {
    const studentCheck = await query(
      "SELECT id, deleted, is_active, deactivation_reason FROM students WHERE id = $1",
      [req.clientId],
    );

    const student = studentCheck.rows[0];
    if (!student || student.deleted === 1 || student.is_active === false) {
      const reason = student?.deactivation_reason
        ? ` (${student.deactivation_reason})`
        : "";
      return res.status(401).json({
        success: false,
        message: `تم إلغاء تفعيل حسابك أو حذفه من قِبل إدارة السنتر${reason}. يرجى مراجعة إدارة السنتر.`,
        force_logout: true,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = studentAuth;
