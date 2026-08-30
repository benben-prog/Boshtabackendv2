const express = require("express");
const routes = express.Router();
const assignmentController = require("./assignments.controller");
const validate = require("../../middlewares/validate.middleware");
const assignmentUpload = require("../../middlewares/uploads/assignmentUpload");
const {
  createAssignmentSchema,
  updateAssignmentSchema,
} = require("../../middlewares/validations/assignment.validation");

// Get all assignments
routes.get("/", assignmentController.getAllAssignments);

// Get assignments by grade
routes.get("/grade/:gradeId", assignmentController.getAssignmentsByGradeId);

// Get assignments by group
routes.get("/group/:groupId", assignmentController.getAssignmentsByGroupId);

// Download assignment file
routes.get("/:assignmentId/download", assignmentController.downloadAssignment);

// Get assignment by ID
routes.get("/:assignmentId", assignmentController.getAssignmentById);

// Create assignment
routes.post(
  "/",
  assignmentUpload.single("file"),
  validate(createAssignmentSchema),
  assignmentController.createAssignment,
);

// Update assignment
routes.put(
  "/:assignmentId",
  validate(updateAssignmentSchema),
  assignmentController.updateAssignment,
);
// Download student answer file
routes.get(
  "/student-answers/:answerId/download",
  studentAnswerController.downloadAnswerFile,
);
// Soft delete assignment
routes.delete("/:assignmentId", assignmentController.softDeleteAssignment);

// Hard delete assignment
routes.delete(
  "/:assignmentId/permanent",
  assignmentController.hardDeleteAssignment,
);

module.exports = routes;
