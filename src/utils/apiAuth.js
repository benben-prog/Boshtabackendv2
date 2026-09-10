const env = require("../config/env");

// Validate API credentials on startup
if (!env.API_USERNAME || !env.API_PASSWORD) {
  throw new Error("API credentials are not configured");
}

// Validate Basic Auth header
const getApiAuth = (authHeader) => {
  if (!authHeader) {
    return false;
  }

  const [type, token] = authHeader.trim().split(" ");

  if (type !== "Basic" || !token) {
    return false;
  }

  try {
    const decodedToken = Buffer.from(token, "base64").toString("utf-8");
    const firstColonIndex = decodedToken.indexOf(":");

    if (firstColonIndex === -1) {
      return false;
    }

    const username = decodedToken.substring(0, firstColonIndex);
    const password = decodedToken.substring(firstColonIndex + 1);

    return username === env.API_USERNAME && password === env.API_PASSWORD;
  } catch (error) {
    return false;
  }
};

module.exports = getApiAuth;
