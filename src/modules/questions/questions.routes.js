const express = require("express");
const routes = express.Router();
const questionController = require("./questions.controller");
const validate = require("../../middlewares/validate.middleware");
const examUpload = require("../../middlewares/uploads/examUpload");
const {
  createQuestionSchema,
  updateQuestionSchema,
} = require("../../middlewares/validations/question.validation");

// Get questions by exam
routes.get("/exam/:examId", questionController.getQuestionsByExamId);

// Download question file
routes.get("/:questionId/download", questionController.downloadQuestionFile);

// Get question by ID
routes.get("/:questionId", questionController.getQuestionById);

// Create question
routes.post(
  "/",
  examUpload.single("file"),
  validate(createQuestionSchema),
  questionController.createQuestion,
);

// Update question
routes.put(
  "/:questionId",
  examUpload.single("file"),
  validate(updateQuestionSchema),
  questionController.updateQuestion,
);

// Delete question
routes.delete("/:questionId", questionController.deleteQuestion);

module.exports = routes;
