const express = require("express");
const routes = express.Router();
const examController = require("./exams.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createExamSchema,
  updateExamSchema,
} = require("../../middlewares/validations/exams.validation");

// Create exam
routes.post("/", validate(createExamSchema), examController.createExam);

// Get all exams
routes.get("/", examController.getAllExams);

// Get grade exam stats
routes.get("/grade/:gradeId/stats", examController.getGradeExamStats);

// Get exams by grade
routes.get("/grade/:gradeId", examController.getExamsByGradeId);

// Get exams by group
routes.get("/group/:groupId", examController.getExamsByGroupId);

// Get exam by ID
routes.get("/:id", examController.getExamById);

// Get exam stats
routes.get("/:id/stats", examController.getExamStats);

// Update exam
routes.put("/:id", validate(updateExamSchema), examController.updateExam);

// Soft delete exam
routes.delete("/:id", examController.softDeleteExam);

// Hard delete exam
routes.delete("/:id/permanent", examController.hardDeleteExam);

module.exports = routes;