const express = require("express");
const auth = require("./auth.controller");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const {
  loginSchema,
  parentAccessSchema,
  verifyActivationSchema,
  completeActivationSchema,
} = require("../../middlewares/validations/auth.validation");

// ============================================
// AUTH ROUTES
// ============================================

// User login (assistant/teacher/super_admin)
router.post("/user/login", validate(loginSchema), auth.userLogin);

// Student login
router.post("/student/login", validate(loginSchema), auth.StudentLogin);

// Student first-time account activation (Step 1: verify barcode + parent_phone)
router.post(
  "/student/verify-activation",
  validate(verifyActivationSchema),
  auth.verifyStudentActivation,
);

// Student first-time account activation (Step 2: set password)
router.post(
  "/student/complete-activation",
  validate(completeActivationSchema),
  auth.completeStudentActivation,
);

// Parent access by token
router.post("/parent/access", validate(parentAccessSchema), auth.parentAccess);

module.exports = router;
