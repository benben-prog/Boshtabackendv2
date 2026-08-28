const env = require("../config/env");

const superAdminAuth = (req, res, next) => {
  if (req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied - Super Admin only",
    });
  }

  const authHeader = req.headers["x-super-admin-key"];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Super admin key required",
    });
  }

  const [type, token] = authHeader.trim().split(" ");

  if (type !== "Basic" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid key format",
    });
  }

  const decodedToken = Buffer.from(token, "base64").toString("utf-8");
  const [username, password] = decodedToken.split(":");

  // استخدام env.js مباشرة بدون fallback
  const SUPER_ADMIN_USERNAME = env.SUPER_ADMIN_USERNAME;
  const SUPER_ADMIN_PASSWORD = env.SUPER_ADMIN_PASSWORD;

  if (!SUPER_ADMIN_USERNAME || !SUPER_ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      message: "Super admin credentials not configured",
    });
  }

  if (username !== SUPER_ADMIN_USERNAME || password !== SUPER_ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Invalid super admin key",
    });
  }

  next();
};

module.exports = superAdminAuth;
