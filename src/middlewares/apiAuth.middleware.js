const getApiAuth = require("../utils/apiAuth");

const apiAuthMiddleware = (req, res, next) => {
  try {
    // Allow direct browser downloads ONLY IF they present a client token in query parameters
    const hasQueryToken = Boolean(
      req.query?.token || req.query?.["x-client-key"] || req.query?.key
    );

    if ((req.method === "GET" || req.method === "HEAD") && hasQueryToken) {
      return next();
    }

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
