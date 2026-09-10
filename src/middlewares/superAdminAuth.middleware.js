const env = require("../config/env");
const { verifyToken } = require("../utils/jwt");

// Middleware to authenticate super admin (JWT or Basic Auth)
const superAdminAuth = (req, res, next) => {
  // First: Check JWT token from x-client-key
  const clientToken = req.headers["x-client-key"];

  if (clientToken) {
    try {
      const decoded = verifyToken(clientToken);
      if (decoded && decoded.role === "super_admin") {
        req.clientId = decoded.id;
        req.clientRole = decoded.role;
        req.clientPermissions = decoded.permissions;
        return next();
      }
    } catch (error) {
      // Token invalid, continue to check x-super-admin-key
    }
  }

  // Second: Check Basic Auth from x-super-admin-key
  const authHeader = req.headers["x-super-admin-key"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "مطلوب توثيق المدير العام",
    });
  }

  const [type, token] = authHeader.trim().split(" ");

  if (type !== "Basic" || !token) {
    return res.status(401).json({
      success: false,
      message: "صيغة المفتاح غير صحيحة",
    });
  }

  // Use indexOf to handle passwords with ":"
  const decodedToken = Buffer.from(token, "base64").toString("utf-8");
  const firstColonIndex = decodedToken.indexOf(":");

  if (firstColonIndex === -1) {
    return res.status(401).json({
      success: false,
      message: "صيغة المفتاح غير صحيحة",
    });
  }

  const username = decodedToken.substring(0, firstColonIndex);
  const password = decodedToken.substring(firstColonIndex + 1);

  const superAdminUsername = env.SUPER_ADMIN_USERNAME;
  const superAdminPassword = env.SUPER_ADMIN_PASSWORD;

  if (!superAdminUsername || !superAdminPassword) {
    return res.status(500).json({
      success: false,
      message: "بيانات المدير العام غير مكتملة",
    });
  }

  if (username !== superAdminUsername || password !== superAdminPassword) {
    return res.status(401).json({
      success: false,
      message: "مفتاح المدير العام غير صحيح",
    });
  }

  req.clientId = null;
  req.clientRole = "super_admin";
  req.clientPermissions = "center_management";

  next();
};

module.exports = superAdminAuth;
