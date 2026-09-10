const jwt = require("./jwt");
const env = require("../config/env");

// Extract client info from token
const getClient = (token) => {
  try {
    if (!token) {
      return null;
    }

    const { id, role, permissions } = jwt.verifyToken(token);

    if (!id || !role) {
      return null;
    }

    return {
      id,
      role,
      permissions: permissions || null,
    };
  } catch (error) {
    // Only log in development
    if (env.NODE_ENV !== "production") {
      console.error("Token verification failed:", error.message);
    }
    return null;
  }
};

module.exports = getClient;
