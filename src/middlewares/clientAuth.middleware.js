const getClient = require("../utils/getClient");

// Middleware to validate client token and extract client info
const clientAuthMiddleware = (req, res, next) => {
  const isDirectFileRequest =
    req.method === "GET" &&
    (req.path.includes("/download") ||
      req.path.includes("/preview") ||
      req.path.includes("/template") ||
      req.path.includes("/pdf") ||
      req.path.includes("/excel"));

  const clientToken =
    req.headers["x-client-key"] ||
    req.query.token ||
    req.query["x-client-key"] ||
    req.query.key;

  if (!clientToken) {
    if (isDirectFileRequest) {
      req.clientId = null;
      req.clientRole = "guest";
      req.clientPermissions = [];
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "التوكن مطلوب",
    });
  }

  const client = getClient(clientToken);

  if (!client) {
    if (isDirectFileRequest) {
      req.clientId = null;
      req.clientRole = "guest";
      req.clientPermissions = [];
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "التوكن غير صالح أو منتهي الصلاحية",
    });
  }

  req.clientId = client.id;
  req.clientRole = client.role;
  req.clientPermissions = client.permissions;

  next();
};

module.exports = clientAuthMiddleware;
