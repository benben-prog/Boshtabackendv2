const express = require("express");
const routes = express.Router();
// Controllers
const previewController = require("../../controllers/preview.controller");
const teacherController = require("./teacher.controller");
const usersController = require("../users/users.controller");
const gradesController = require("../grades/grades.controller");
const groupsController = require("../groups/groups.controller");
const studentsController = require("../students/students.controller");
const attendanceController = require("../attendance/attendance.controller");
const paymentsController = require("../payments/payments.controller");
const subscriptionsController = require("../subscriptions/subscriptions.controller");
const examsController = require("../exams/exams.controller");
const examResultsController = require("../exam_results/exam_results.controller");
const onlineExamController = require("../online_exams/online_exams.controller");
const questionController = require("../questions/questions.controller");
const optionController = require("../options/options.controller");
const studentExamController = require("../student_exams/student_exams.controller");
const studentAnswerController = require("../student_answers/student_answers.controller");
const assignmentController = require("../assignments/assignments.controller");
const assignmentSubmissionController = require("../assignment_submissions/assignment_submissions.controller");
const videoController = require("../videos/videos.controller");
const playlistController = require("../playlists/playlists.controller");
const playlistVideoController = require("../playlist_videos/playlist_videos.controller");

// Middleware
const validate = require("../../middlewares/validate.middleware");
const profileImageUpload = require("../../middlewares/uploads/profileImageUpload");
const {
  updateUserPasswordSchema,
} = require("../../middlewares/validations/users.validation");

/* ============================================
   TEACHER - DASHBOARD & PROFILE
   ============================================ */
routes.get("/assistants", usersController.getAllAssistants);
routes.get("/assistants/:userId", usersController.getUserById);
// Get teacher profile
routes.get("/profile", teacherController.getProfile);

// Get dashboard
routes.get("/dashboard", teacherController.getDashboard);

// Get activity log
routes.get("/activity-log", teacherController.getActivityLog);

// Update profile image
routes.put(
  "/profile-image",
  profileImageUpload.single("image"),
  usersController.updateUserProfileImage,
);

// Delete profile image
routes.delete("/profile-image", usersController.deleteUserProfileImage);

// Get profile image
routes.get("/profile-image", usersController.getUserProfileImage);

// Update password
routes.put(
  "/password",
  validate(updateUserPasswordSchema),
  usersController.updateUserPassword,
);

/* ============================================
   TEACHER - READ-ONLY ROUTES
   (المدرس بيقرأ كل حاجة)
   ============================================ */
// Preview routes
routes.get(
  "/assignments/:assignmentId/preview",
  previewController.previewAssignment,
);
routes.get("/videos/:videoId/preview", previewController.previewVideoFile);
routes.get(
  "/questions/:questionId/preview",
  previewController.previewQuestionFile,
);
routes.get(
  "/student-answers/:answerId/preview",
  previewController.previewStudentAnswer,
);
// Grades - قراءة + full-stats
routes.get("/grades", gradesController.getAllGrades);
routes.get("/grades/groups-count", gradesController.getGradesWithGroupsCount);
routes.get(
  "/grades/students-count",
  gradesController.getGradesWithStudentsCount,
);
routes.get("/grades/stats", gradesController.getAllGradesStats);
routes.get("/grades/:id", gradesController.getGradeById);
routes.get("/grades/:id/stats", gradesController.getGradeStats);

// Groups - قراءة + full-stats
routes.get("/groups", groupsController.getAllGroups);
routes.get("/groups/with-grade-name", groupsController.getGroupsWithGradeName);
routes.get(
  "/groups/students-count",
  groupsController.getGroupsWithStudentsCount,
);
routes.get("/groups/stats", groupsController.getAllGroupsStats);
routes.get("/groups/:id/full-stats", groupsController.getGroupFullStats);
routes.get("/groups/grade/:gradeId", groupsController.getGroupsByGradeId);
routes.get("/groups/:id", groupsController.getGroupById);
routes.get("/groups/:id/stats", groupsController.getGroupStats);

// Students - قراءة + ملف كامل
routes.get("/students", studentsController.getAllStudents);
routes.get("/students/search/barcode", studentsController.getStudentByBarcode);
routes.get("/students/search/phone", studentsController.findStudentByPhone);
routes.get("/students/grade/:gradeId", studentsController.getStudentsByGradeId);
routes.get("/students/group/:groupId", studentsController.getStudentsByGroupId);
routes.get(
  "/students/:studentId/profile",
  studentsController.getStudentProfile,
);
routes.get(
  "/students/:studentId/stats",
  studentsController.getStudentQuickStats,
);
routes.get(
  "/students/:studentId/attendance",
  studentsController.getAttendanceHistory,
);
routes.get(
  "/students/:studentId/attendance/monthly",
  studentsController.getMonthlyAttendanceStats,
);
routes.get(
  "/students/:studentId/payments",
  studentsController.getPaymentHistory,
);
routes.get(
  "/students/:studentId/payments/balance",
  studentsController.getRemainingBalance,
);
routes.get(
  "/students/:studentId/exams/paper",
  studentsController.getStudentPaperExams,
);
routes.get(
  "/students/:studentId/exams/results",
  studentsController.getStudentExamResults,
);
routes.get(
  "/students/:studentId/exams/online/history",
  studentsController.getStudentOnlineExams,
);
routes.get(
  "/students/:studentId/assignments",
  studentsController.getStudentAssignments,
);
routes.get(
  "/students/:studentId/submissions",
  studentsController.getStudentSubmissions,
);
routes.get("/students/:studentId", studentsController.getStudentById);

// Attendance - قراءة
routes.get("/attendance/dashboard", attendanceController.getDashboard);
routes.get(
  "/attendance/overall-stats",
  attendanceController.getOverallAttendanceStats,
);
routes.get(
  "/attendance/consecutive-absences",
  attendanceController.getStudentsWithThreeConsecutiveAbsences,
);
routes.get(
  "/attendance/grade/:gradeId/stats",
  attendanceController.getGradeAttendanceStats,
);
routes.get(
  "/attendance/group/:groupId/date/:date",
  attendanceController.getAttendanceByGroupAndDate,
);
routes.get(
  "/attendance/group/:groupId/month/:month",
  attendanceController.getAttendanceByGroupAndMonth,
);
routes.get(
  "/attendance/summary/group/:groupId/date/:date",
  attendanceController.getAttendanceSummary,
);

// Payments - قراءة
routes.get("/payments", paymentsController.getAllPayments);
routes.get("/payments/collections", paymentsController.getMonthlyCollections);
routes.get(
  "/payments/unpaid",
  paymentsController.getUnpaidStudentsCurrentMonth,
);
routes.get("/payments/overall", paymentsController.getOverallPaymentStats);
routes.get(
  "/payments/students-status",
  paymentsController.getAllStudentsPaymentStatus,
);
routes.get(
  "/payments/grade/:gradeId/stats",
  paymentsController.getGradePaymentStats,
);
routes.get(
  "/payments/group/:groupId/stats",
  paymentsController.getGroupPaymentStats,
);

// Subscriptions - قراءة
routes.get(
  "/subscriptions/overall",
  subscriptionsController.getOverallSubscriptionStats,
);
routes.get(
  "/subscriptions/without-current",
  subscriptionsController.getStudentsWithoutSubscriptionCurrentMonth,
);
routes.get(
  "/subscriptions/month/:month",
  subscriptionsController.getSubscriptionsByMonth,
);
routes.get(
  "/subscriptions/grade/:gradeId/stats",
  subscriptionsController.getGradeSubscriptionStats,
);
routes.get(
  "/subscriptions/group/:groupId/stats",
  subscriptionsController.getGroupSubscriptionStats,
);
routes.get(
  "/subscriptions/student/:studentId",
  subscriptionsController.getStudentSubscriptions,
);

// Exams - قراءة
routes.get("/exams", examsController.getAllExams);
routes.get("/exams/grade/:gradeId/stats", examsController.getGradeExamStats);
routes.get("/exams/grade/:gradeId", examsController.getExamsByGradeId);
routes.get("/exams/group/:groupId", examsController.getExamsByGroupId);
routes.get("/exams/:id", examsController.getExamById);
routes.get("/exams/:id/stats", examsController.getExamStats);

// Exam Results - قراءة
routes.get(
  "/exam-results/grade/:gradeId/stats",
  examResultsController.getGradeExamResultsStats,
);
routes.get(
  "/exam-results/group/:groupId/stats",
  examResultsController.getGroupExamResultsStats,
);
routes.get("/exam-results/exam/:examId", examResultsController.getExamResults);
routes.get(
  "/exam-results/exam/:examId/stats",
  examResultsController.getExamResultStats,
);

// Online Exams - قراءة
routes.get("/online-exams", onlineExamController.getAllOnlineExams);
routes.get(
  "/online-exams/available",
  onlineExamController.getAvailableOnlineExams,
);
routes.get("/online-exams/expired", onlineExamController.getExpiredOnlineExams);
routes.get(
  "/online-exams/grade/:gradeId",
  onlineExamController.getOnlineExamsByGradeId,
);
routes.get(
  "/online-exams/group/:groupId",
  onlineExamController.getOnlineExamsByGroupId,
);
routes.get(
  "/online-exams/stats/grade/:gradeId",
  onlineExamController.getGradeOnlineExamStats,
);
routes.get(
  "/online-exams/stats/:examId",
  onlineExamController.getOnlineExamStats,
);
routes.get("/online-exams/:examId", onlineExamController.getOnlineExamById);

// Questions - قراءة
routes.get("/questions/exam/:examId", questionController.getQuestionsByExamId);
routes.get("/questions/:questionId", questionController.getQuestionById);
routes.get(
  "/questions/:questionId/download",
  questionController.downloadQuestionFile,
);

// Options - قراءة
routes.get(
  "/options/question/:questionId",
  optionController.getOptionsByQuestionId,
);
routes.get("/options/:optionId", optionController.getOptionById);

// Student Exams - قراءة
routes.get(
  "/student-exams/exam/:examId",
  studentExamController.getStudentExamsByExamId,
);
routes.get(
  "/student-exams/exam/:examId/stats",
  studentExamController.getExamAttemptStats,
);
routes.get(
  "/student-exams/grade/:gradeId/stats",
  studentExamController.getGradeExamAttemptsStats,
);
routes.get(
  "/student-exams/group/:groupId/stats",
  studentExamController.getGroupExamAttemptsStats,
);

// Student Answers - قراءة
routes.get(
  "/student-answers/question/:questionId/stats",
  studentAnswerController.getQuestionAnswerStats,
);
routes.get(
  "/student-answers/question/:questionId/options",
  studentAnswerController.getMostSelectedOptions,
);

// Assignments - قراءة
routes.get("/assignments", assignmentController.getAllAssignments);
routes.get(
  "/assignments/grade/:gradeId",
  assignmentController.getAssignmentsByGradeId,
);
routes.get(
  "/assignments/group/:groupId",
  assignmentController.getAssignmentsByGroupId,
);
routes.get(
  "/assignments/:assignmentId/download",
  assignmentController.downloadAssignment,
);
routes.get(
  "/assignments/:assignmentId",
  assignmentController.getAssignmentById,
);

// Assignment Submissions - قراءة
routes.get(
  "/assignment-submissions/stats/grade/:gradeId",
  assignmentSubmissionController.getGradeAssignmentSubmissionStats,
);
routes.get(
  "/assignment-submissions/stats/group/:groupId",
  assignmentSubmissionController.getGroupAssignmentSubmissionStats,
);
routes.get(
  "/assignment-submissions/assignment/:assignmentId",
  assignmentSubmissionController.getSubmissionsByAssignmentId,
);
routes.get(
  "/assignment-submissions/assignment/:assignmentId/student/:studentId",
  assignmentSubmissionController.getStudentSubmission,
);
routes.get(
  "/assignment-submissions/stats/assignment/:assignmentId",
  assignmentSubmissionController.getAssignmentSubmissionStats,
);

// Videos - قراءة
routes.get("/videos", videoController.getAllVideos);
routes.get("/videos/grade/:gradeId", videoController.getVideosByGradeId);
routes.get("/videos/:videoId/download", videoController.downloadVideoFile);
routes.get("/videos/:videoId", videoController.getVideoById);

// Playlists - قراءة
routes.get("/playlists", playlistController.getAllPlaylists);
routes.get(
  "/playlists/grade/:gradeId",
  playlistController.getPlaylistsByGradeId,
);
routes.get("/playlists/:playlistId", playlistController.getPlaylistById);

// Playlist Videos - قراءة
routes.get(
  "/playlist-videos/playlist/:playlistId",
  playlistVideoController.getPlaylistVideos,
);

module.exports = routes;
