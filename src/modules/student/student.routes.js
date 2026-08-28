const express = require("express");
const routes = express.Router();
const questionController = require("../questions/questions.controller");
const optionController = require("../options/options.controller");

const studentController = require("./student.controller");
const studentAnswerController = require("../student_answers/student_answers.controller");
const assignmentController = require("../assignments/assignments.controller");
const assignmentSubmissionController = require("../assignment_submissions/assignment_submissions.controller");
const validate = require("../../middlewares/validate.middleware");
const profileImageUpload = require("../../middlewares/uploads/profileImageUpload");
const assignmentUpload = require("../../middlewares/uploads/assignmentUpload");
const examUpload = require("../../middlewares/uploads/examUpload");
const {
  updateStudentPasswordSchema,
} = require("../../middlewares/validations/students.validation");

/* ============================================
   DASHBOARD & PROFILE
   ============================================ */

// Get dashboard
routes.get("/dashboard", studentController.getDashboard);

// Get profile
routes.get("/profile", studentController.getProfile);

// Get quick stats
routes.get("/stats", studentController.getQuickStats);

// Update profile image
routes.put(
  "/profile-image",
  profileImageUpload.single("image"),
  studentController.updateProfileImage,
);

// Update password
routes.put(
  "/password",
  validate(updateStudentPasswordSchema),
  studentController.updatePassword,
);

/* ============================================
   ATTENDANCE
   ============================================ */

routes.get("/attendance", studentController.getAttendanceHistory);
routes.get("/attendance/monthly", studentController.getMonthlyAttendanceStats);
routes.get("/attendance/consecutive", studentController.getConsecutiveAbsences);

/* ============================================
   PAPER EXAMS
   ============================================ */

routes.get("/exams/paper", studentController.getPaperExams);
routes.get("/exams/paper/:examId", studentController.getPaperExamById);
routes.get("/exams/results", studentController.getExamResults);

/* ============================================
   ONLINE EXAMS
   ============================================ */

routes.get(
  "/exams/online/available",
  studentController.getAvailableOnlineExams,
);
routes.get("/exams/online/history", studentController.getOnlineExamsHistory);
routes.get("/exams/online/:attemptId", studentController.getOnlineExamById);
routes.post("/exams/online/:examId/start", studentController.startOnlineExam);
routes.put(
  "/exams/online/:attemptId/submit",
  studentController.submitOnlineExam,
);

// Submit answer (MCQ/True-False)
routes.post(
  "/exams/online/:examId/answer",
  studentAnswerController.submitAnswer,
);

// Submit essay answer
routes.post(
  "/exams/online/:examId/essay",
  examUpload.single("file"),
  studentAnswerController.submitEssayAnswer,
);

/* ============================================
   EXAM QUESTIONS & OPTIONS
   ============================================ */

// Get questions by exam
routes.get(
  "/exams/online/:examId/questions",
  questionController.getQuestionsByExamId,
);

// Get question by ID
routes.get(
  "/exams/online/question/:questionId",
  questionController.getQuestionById,
);

// Get options by question
routes.get(
  "/options/question/:questionId",
  optionController.getOptionsByQuestionId,
);

/* ============================================
   ASSIGNMENTS
   ============================================ */

routes.get("/assignments", studentController.getAssignments);
routes.get("/assignments/:assignmentId", studentController.getAssignmentById);

routes.get(
  "/assignments/:assignmentId/download",
  assignmentController.downloadAssignment,
);

// Submit assignment
routes.post(
  "/assignments/:assignmentId/submit",
  assignmentUpload.single("file"), 
  assignmentSubmissionController.submitAssignment,
);

// Update submission
routes.put(
  "/assignments/:assignmentId/update",
  assignmentUpload.single("file"),
  assignmentSubmissionController.updateSubmission,
);

routes.get("/submissions", studentController.getSubmissions);

/* ============================================
   VIDEOS & PLAYLISTS
   ============================================ */

routes.get("/playlists", studentController.getPlaylists);
routes.get(
  "/playlists/:playlistId/videos",
  studentController.getPlaylistVideos,
);

/* ============================================
   PAYMENTS
   ============================================ */

routes.get("/payments", studentController.getPaymentHistory);
routes.get("/payments/balance", studentController.getRemainingBalance);
routes.get(
  "/payments/current-subscription",
  studentController.getCurrentSubscription,
);

module.exports = routes;
