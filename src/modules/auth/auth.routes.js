const express = require("express");
const auth = require("./auth.controller");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const {
  loginSchema,
  parentAccessSchema,
} = require("../../middlewares/validations/auth.validation");

// ============================================
// AUTH ROUTES
// ============================================

// User login (assistant/teacher/super_admin)
router.post("/user/login", validate(loginSchema), auth.userLogin);

// Student login
router.post("/student/login", validate(loginSchema), auth.StudentLogin);

// Parent access by token
router.post("/parent/access", validate(parentAccessSchema), auth.parentAccess);

module.exports = router;
