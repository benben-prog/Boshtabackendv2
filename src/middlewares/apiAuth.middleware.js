const getApiAuth = require("../utils/apiAuth");

const apiAuthMiddleware = (req, res, next) => {
  try {
    // Allow direct file downloads, previews, templates, and exports without requiring Basic Auth
    if (
      req.method === "GET" &&
      (req.path.includes("/download") ||
        req.path.includes("/preview") ||
        req.path.includes("/template") ||
        req.path.includes("/pdf") ||
        req.path.includes("/excel"))
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
