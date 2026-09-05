const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { JWT_SECRET, EXPIRES_DATE } = env;

// Create JWT token
const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_DATE });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
};
