const getApiAuth = require("../utils/apiAuth");

// Middleware to validate API credentials
const apiAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const isValid = getApiAuth(authHeader);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "بيانات API غير صحيحة",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = apiAuthMiddleware;
