const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { JWT_SECRET, EXPIRES_DATE } = env;

const creatToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_DATE });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  creatToken,
  verifyToken,
};
