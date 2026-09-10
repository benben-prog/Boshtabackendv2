const jwt = require("jsonwebtoken");
const env = require("../config/env");

// Validate JWT secret on startup
if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

// Create JWT token
const createToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.EXPIRES_DATE });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
};
