const jwt = require("./jwt");

const getClient = (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id, role, permissions } = jwt.verifyToken(token);
    if (!id || !role) return null;
    return { id, role, permissions: permissions || null };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = getClient;
