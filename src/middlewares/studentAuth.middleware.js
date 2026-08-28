const studentAuth = (req, res, next) => {
  if (req.clientRole !== "student" && req.clientRole !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student only.",
    });
  }
  next();
};

module.exports = studentAuth;
