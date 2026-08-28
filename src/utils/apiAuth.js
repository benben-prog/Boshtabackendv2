const { API_USERNAME, API_PASSWORD } = require("../config/env");

const getApiAuth = (authHeader) => {
  if (!authHeader) return false;
  const [type, token] = authHeader.trim().split(" ");
  if (type != "Basic" || !token) return false;
  const decodedToken = Buffer.from(token, "base64").toString("utf-8");
  const [api_username, api_password] = decodedToken.split(":");
  return api_username == API_USERNAME && api_password == API_PASSWORD;
};

module.exports = getApiAuth

