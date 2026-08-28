const assistantAuth = (req, res, next) => {
  if (req.clientRole !== "assistant" && req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Assistant only.",
    });
  }
  next();
};

module.exports = assistantAuth;
