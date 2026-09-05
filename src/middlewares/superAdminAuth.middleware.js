const env = require("../config/env");
const { verifyToken } = require("../utils/jwt");

const superAdminAuth = (req, res, next) => {
  // ✅ First: Check JWT token from x-client-key (for logged-in super admin)
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

  // ✅ Second: Check Basic Auth from x-super-admin-key (for API access)
  const authHeader = req.headers["x-super-admin-key"];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Super admin authentication required",
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

  req.clientId = null;
  req.clientRole = "super_admin";
  req.clientPermissions = "center_management";

  next();
};

module.exports = superAdminAuth;
