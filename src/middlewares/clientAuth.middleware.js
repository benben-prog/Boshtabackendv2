const getClient = require("../utils/getClient");

const getClientAuth = (req, res, next) => {
  const clientAuth = req.headers["x-client-key"];
  const client = getClient(clientAuth);

  if (!client) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.clientId = client.id;
  req.clientRole = client.role;
  req.clientPermissions = client.permissions; // ✅ جديد

  next();
};

module.exports = getClientAuth;
