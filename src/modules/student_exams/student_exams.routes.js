const express = require("express");
const routes = express.Router();
const studentExamController = require("./student_exams.controller");

// Start exam (student)
routes.post("/exam/:examId/start", studentExamController.createExamAttempt);

// Submit exam (student)
routes.put("/attempt/:attemptId/submit", studentExamController.submitExam);

// Get students by exam
routes.get("/exam/:examId", studentExamController.getStudentExamsByExamId);

// Get exam stats
routes.get("/exam/:examId/stats", studentExamController.getExamAttemptStats);

// Get grade stats
routes.get("/grade/:gradeId/stats", studentExamController.getGradeExamAttemptsStats);

// Get group stats
routes.get("/group/:groupId/stats", studentExamController.getGroupExamAttemptsStats);

module.exports = routes;