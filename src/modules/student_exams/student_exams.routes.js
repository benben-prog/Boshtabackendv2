const express = require("express");
const routes = express.Router();
const studentExamController = require("./student_exams.controller");

// Check active attempt
routes.get(
  "/exam/:examId/check-attempt",
  studentExamController.checkActiveAttempt,
);

// Resume exam
routes.get("/exam/:examId/resume", studentExamController.resumeExam);

// Start exam
routes.post("/exam/:examId/start", studentExamController.createExamAttempt);

// Submit exam
routes.put("/attempt/:attemptId/submit", studentExamController.submitExam);

// Get exam review
routes.get(
  "/attempt/:attemptId/review",
  studentExamController.getExamReview,
);

// Get exam questions for student
routes.get(
  "/exam/:examId/questions",
  studentExamController.getExamQuestionsForStudent,
);

// Get single question for student
routes.get(
  "/question/:questionId",
  studentExamController.getQuestionForStudent,
);

// Get options for student
routes.get(
  "/options/question/:questionId",
  studentExamController.getOptionsForStudent,
);

// Get students by exam
routes.get("/exam/:examId", studentExamController.getStudentExamsByExamId);

// Get exam stats
routes.get("/exam/:examId/stats", studentExamController.getExamAttemptStats);

// Get grade stats
routes.get(
  "/grade/:gradeId/stats",
  studentExamController.getGradeExamAttemptsStats,
);

// Get group stats
routes.get(
  "/group/:groupId/stats",
  studentExamController.getGroupExamAttemptsStats,
);

module.exports = routes;
