const express = require("express");
const auth = require("./auth.controller");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const {
  loginSchema,
} = require("../../middlewares/validations/auth.validation");

// User login (assistant/teacher/super_admin)
router.post("/user/login", validate(loginSchema), auth.userLogin);

// Student login
router.post("/student/login", validate(loginSchema), auth.StudentLogin);

// Parent access by token
router.post("/parent/access", auth.parentAccess);

module.exports = router;
