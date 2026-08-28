const express = require("express");
const routes = express.Router();
const onlineExamController = require("./online_exams.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createOnlineExamSchema,
  updateOnlineExamSchema,
} = require("../../middlewares/validations/onlineExam.validation");

// Get available exams
routes.get("/available", onlineExamController.getAvailableOnlineExams);

// Get expired exams
routes.get("/expired", onlineExamController.getExpiredOnlineExams);

// Get all exams
routes.get("/", onlineExamController.getAllOnlineExams);

// Get grade stats
routes.get(
  "/stats/grade/:gradeId",
  onlineExamController.getGradeOnlineExamStats,
);

// Get exams by grade
routes.get("/grade/:gradeId", onlineExamController.getOnlineExamsByGradeId);

// Get exams by group
routes.get("/group/:groupId", onlineExamController.getOnlineExamsByGroupId);

// Get exam stats
routes.get("/stats/:examId", onlineExamController.getOnlineExamStats);

// Get exam by ID
routes.get("/:examId", onlineExamController.getOnlineExamById);

// Create exam
routes.post(
  "/",
  validate(createOnlineExamSchema),
  onlineExamController.createOnlineExam,
);

// Update exam
routes.put(
  "/:examId",
  validate(updateOnlineExamSchema),
  onlineExamController.updateOnlineExam,
);

// Soft delete
routes.delete("/:examId", onlineExamController.softDeleteOnlineExam);

// Hard delete
routes.delete("/:examId/permanent", onlineExamController.hardDeleteOnlineExam);

module.exports = routes;
