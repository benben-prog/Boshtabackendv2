const express = require("express");
const routes = express.Router();
const studentAnswerController = require("./student_answers.controller");
const examUpload = require("../../middlewares/uploads/examUpload");

// Submit MCQ/True-False answer
routes.post("/exam/:examId/answer", studentAnswerController.submitAnswer);

// Submit essay answer with file
routes.post(
  "/exam/:examId/essay",
  examUpload.single("file"),
  studentAnswerController.submitEssayAnswer,
);

// Delete answer
routes.delete("/:answerId", studentAnswerController.deleteAnswer);

// Get student answers for an exam
routes.get("/exam/:examId", studentAnswerController.getStudentAnswersByExam);

// Get question stats
routes.get(
  "/question/:questionId/stats",
  studentAnswerController.getQuestionAnswerStats,
);

// Get most selected options
routes.get(
  "/question/:questionId/options",
  studentAnswerController.getMostSelectedOptions,
);

module.exports = routes;
