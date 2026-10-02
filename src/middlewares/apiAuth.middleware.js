const getApiAuth = require("../utils/apiAuth");

const apiAuthMiddleware = (req, res, next) => {
  try {
    const url = req.originalUrl || req.url || req.path || "";
    // Allow direct file downloads, previews, templates, and exports without requiring Basic Auth
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
