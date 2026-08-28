const getApiAuth = require("../utils/apiAuth");

const apiMiddelware = (req, res, next) => {
  try {
    const apiHeaders = req.headers.authorization;
    const validAuth = getApiAuth(apiHeaders);
    if (!validAuth) {
      return res.status(401).json({
        success: false,
        message: "Invalid API credentials",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = apiMiddelware;
