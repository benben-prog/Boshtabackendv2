const getClient = require("../utils/getClient");

// Middleware to validate client token and extract client info
const clientAuthMiddleware = (req, res, next) => {
  const clientToken = req.headers["x-client-key"];

  if (!clientToken) {
    return res.status(401).json({
      success: false,
      message: "التوكن مطلوب",
    });
  }

  const client = getClient(clientToken);

  if (!client) {
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
