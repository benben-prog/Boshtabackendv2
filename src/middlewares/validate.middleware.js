const fs = require("fs");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    // Delete single file if exists
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    // Delete multiple files if exists
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        req.files[key].forEach((file) => {
          fs.unlink(file.path, () => {});
        });
      });
    }

    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = validate;
