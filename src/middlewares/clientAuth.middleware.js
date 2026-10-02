const getClient = require("../utils/getClient");

// Middleware to validate client token and extract client info
const clientAuthMiddleware = (req, res, next) => {
  const url = req.originalUrl || req.url || req.path || "";
  const isDirectFileRequest =
    (req.method === "GET" || req.method === "HEAD") &&
    (url.includes("/download") ||
      url.includes("/preview") ||
      url.includes("/template") ||
      url.includes("/pdf") ||
      url.includes("/excel"));

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
