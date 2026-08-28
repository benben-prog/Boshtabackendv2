const express = require("express");
const routes = express.Router();
const userController = require("./users.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  findUserByPhoneSchema,
} = require("../../middlewares/validations/users.validation");

// Get all users
routes.get("/", userController.getAllUsers);

// Get all assistants
routes.get("/assistants", userController.getAllAssistants);

// Get all teachers
routes.get("/teachers", userController.getAllTeachers);

// Find user by phone
routes.post(
  "/find",
  validate(findUserByPhoneSchema),
  userController.findUserByPhone,
);

// Get user by ID
routes.get("/:userId", userController.getUserById);

// Create user
routes.post("/", validate(createUserSchema), userController.createUser);

// Update user
routes.put("/:userId", validate(updateUserSchema), userController.updateUser);

// Update user password
routes.put(
  "/:userId/password",
  validate(updateUserPasswordSchema),
  userController.updateUserPassword,
);

// Toggle user active
routes.put("/:userId/toggle-active", userController.toggleUserActive);

// Soft delete user
routes.delete("/:userId", userController.softDeleteUser);

// Hard delete user
routes.delete("/:userId/permanent", userController.hardDeleteUser);

module.exports = routes;
