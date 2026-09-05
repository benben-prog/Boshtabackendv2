const express = require("express");
const routes = express.Router();
const Joi = require("joi");

// Controllers
const previewController = require("../../controllers/preview.controller");
const superAdminController = require("./super-admin.controller");
const usersController = require("../users/users.controller");
const settingsController = require("../settings/settings.controller");
const gradesController = require("../grades/grades.controller");
const gradesBulkController = require("../grades/grades.bulk.controller");
const groupsController = require("../groups/groups.controller");
const groupsBulkController = require("../groups/groups.bulk.controller");
const studentsController = require("../students/students.controller");
const studentsBulkController = require("../students/students.bulk.controller");
const attendanceController = require("../attendance/attendance.controller");
const paymentsController = require("../payments/payments.controller");
const subscriptionsController = require("../subscriptions/subscriptions.controller");
const examsController = require("../exams/exams.controller");
const examResultsController = require("../exam_results/exam_results.controller");
const examResultsBulkController = require("../exam_results/exam_results.bulk.controller");
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
const whatsappController = require("../whatsapp_messages/whatsapp_messages.controller");

// Middleware
const excelUpload = require("../../middlewares/uploads/excelUpload");
const validate = require("../../middlewares/validate.middleware");

/* ============================================
   SUPER ADMIN - DASHBOARD & ACTIVITY LOG
   ============================================ */

routes.get("/dashboard", superAdminController.getDashboard);
routes.get("/platform-status", superAdminController.getPlatformStatus);
routes.get("/activity-log", superAdminController.getActivityLog);

/* ============================================
   SUPER ADMIN - USERS MANAGEMENT
   ============================================ */

routes.get("/users", usersController.getAllUsers);
routes.get("/users/deleted", usersController.getDeletedUsers);
routes.get("/users/assistants", usersController.getAllAssistants);
routes.get("/users/teachers", usersController.getAllTeachers);
routes.post("/users/find", usersController.findUserByPhone);
routes.get("/users/:userId", usersController.getUserById);
routes.post("/users", usersController.createUser);
routes.put("/users/:userId", usersController.updateUser);
routes.put("/users/:userId/password", usersController.updateUserPassword);
routes.put("/users/:userId/reset-password", usersController.resetUserPassword);
routes.put("/users/:userId/toggle-active", usersController.toggleUserActive);
routes.delete("/users/:userId", usersController.softDeleteUser);
routes.delete("/users/:userId/permanent", usersController.hardDeleteUser);
routes.post("/users/:userId/restore", usersController.restoreUser);

/* ============================================
   SUPER ADMIN - PLATFORM SETTINGS
   ============================================ */

routes.get("/settings", settingsController.getSettings);
routes.put("/settings", settingsController.updateSettings);
routes.put(
  "/settings/toggle-platform",
  settingsController.togglePlatformStatus,
);
routes.put(
  "/settings/academic-year",
  settingsController.updateAcademicYearStatus,
);

/* ============================================
   SUPER ADMIN - STUDENTS MANAGEMENT
   ============================================ */

routes.get(
  "/students/template",
  studentsBulkController.downloadStudentsTemplate,
);
routes.post(
  "/students/bulk-upload",
  excelUpload.single("file"),
  studentsBulkController.bulkUploadStudents,
);

routes.get("/students", studentsController.getAllStudents);
routes.get("/students/deleted", studentsController.getDeletedStudents);
routes.get(
  "/students/without-password",
  studentsController.getStudentsWithoutPassword,
);

routes.post(
  "/students/generate-passwords/grade/:gradeId",
  validate(
    Joi.object({ gradeId: Joi.number().integer().positive().required() }),
  ),
  studentsController.generatePasswordsForGrade,
);

routes.post(
  "/students/generate-passwords",
  studentsController.generatePasswordsForAllStudents,
);
routes.get("/students/search/barcode", studentsController.getStudentByBarcode);
routes.get("/students/search/phone", studentsController.findStudentByPhone);
routes.get(
  "/students/search/parent-phone",
  studentsController.findStudentByParentPhone,
);
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
  "/students/:studentId/attendance/total",
  studentsController.getStudentTotalAttendance,
);
routes.get(
  "/students/:studentId/attendance/consecutive-absences",
  studentsController.getConsecutiveAbsences,
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
  "/students/:studentId/payments/current-subscription",
  studentsController.getCurrentSubscription,
);
routes.get(
  "/students/:studentId/exams/paper",
  studentsController.getStudentPaperExams,
);
routes.get(
  "/students/:studentId/exams/paper/:examId",
  studentsController.getStudentPaperExamById,
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
  "/students/:studentId/exams/online/:attemptId",
  studentsController.getStudentOnlineExamById,
);
routes.get(
  "/students/:studentId/assignments",
  studentsController.getStudentAssignments,
);
routes.get(
  "/students/:studentId/assignments/:assignmentId",
  studentsController.getStudentAssignmentById,
);
routes.get(
  "/students/:studentId/submissions",
  studentsController.getStudentSubmissions,
);
routes.get(
  "/students/:studentId/submissions/:submissionId",
  studentsController.getStudentSubmissionById,
);
routes.get(
  "/students/:studentId/playlists",
  studentsController.getStudentPlaylists,
);
routes.get("/students/:studentId", studentsController.getStudentById);
routes.post("/students", studentsController.createStudent);
routes.put("/students/:studentId", studentsController.updateStudent);
routes.put(
  "/students/:studentId/reset-password",
  studentsController.resetStudentPassword,
);
routes.delete("/students/:studentId", studentsController.softDeleteStudent);
routes.delete(
  "/students/:studentId/permanent",
  studentsController.hardDeleteStudent,
);
routes.post("/students/:studentId/restore", studentsController.restoreStudent);

/* ============================================
   SUPER ADMIN - GRADES & GROUPS
   ============================================ */

routes.get("/grades/template", gradesBulkController.downloadGradesTemplate);
routes.post(
  "/grades/bulk-upload",
  excelUpload.single("file"),
  gradesBulkController.bulkUploadGrades,
);

routes.get("/groups/template", groupsBulkController.downloadGroupsTemplate);
routes.post(
  "/groups/bulk-upload",
  excelUpload.single("file"),
  groupsBulkController.bulkUploadGroups,
);

routes.get("/grades", gradesController.getAllGrades);
routes.get("/grades/groups-count", gradesController.getGradesWithGroupsCount);
routes.get(
  "/grades/students-count",
  gradesController.getGradesWithStudentsCount,
);
routes.get("/grades/stats", gradesController.getAllGradesStats);
routes.post("/grades/find", gradesController.findGradeByName);
routes.get("/grades/:id", gradesController.getGradeById);
routes.get("/grades/:id/stats", gradesController.getGradeStats);
routes.post("/grades", gradesController.createGrade);
routes.put("/grades/:id", gradesController.updateGrade);
routes.delete("/grades/:id", gradesController.softDeleteGrade);
routes.delete("/grades/:id/permanent", gradesController.hardDeleteGrade);

routes.get("/groups", groupsController.getAllGroups);
routes.get("/groups/with-grade-name", groupsController.getGroupsWithGradeName);
routes.get(
  "/groups/students-count",
  groupsController.getGroupsWithStudentsCount,
);
routes.get("/groups/stats", groupsController.getAllGroupsStats);
routes.get("/groups/:id/full-stats", groupsController.getGroupFullStats);
routes.post("/groups/find", groupsController.findGroupByName);
routes.get("/groups/grade/:gradeId", groupsController.getGroupsByGradeId);
routes.get("/groups/:id", groupsController.getGroupById);
routes.get("/groups/:id/stats", groupsController.getGroupStats);
routes.post("/groups", groupsController.createGroup);
routes.put("/groups/:id", groupsController.updateGroup);
routes.delete("/groups/:id", groupsController.softDeleteGroup);
routes.delete("/groups/:id/permanent", groupsController.hardDeleteGroup);

/* ============================================
   SUPER ADMIN - ATTENDANCE
   ============================================ */

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
routes.get("/attendance/:id", attendanceController.getAttendanceById);
routes.post("/attendance", attendanceController.createAttendance);
routes.post(
  "/attendance/mark-rest-absent",
  attendanceController.markRestAbsent,
);
routes.put("/attendance/:id", attendanceController.updateAttendance);
routes.delete("/attendance/:id", attendanceController.deleteAttendance);

routes.post("/attendance/sessions/start", attendanceController.startSession);
routes.get(
  "/attendance/sessions/active/:groupId",
  attendanceController.getActiveSession,
);
routes.put(
  "/attendance/sessions/:id/toggle-makeup",
  attendanceController.toggleMakeupMode,
);
routes.post("/attendance/scan-barcode", attendanceController.scanBarcode);
routes.post("/attendance/sessions/lock", attendanceController.lockSession);

/* ============================================
   SUPER ADMIN - PAYMENTS & SUBSCRIPTIONS
   ============================================ */

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
routes.get(
  "/payments/grade/:gradeId/month/:month",
  paymentsController.getPaymentsByGradeAndMonth,
);
routes.get(
  "/payments/group/:groupId/month/:month",
  paymentsController.getPaymentsByGroupAndMonth,
);
routes.get("/payments/:id", paymentsController.getPaymentById);
routes.post("/payments", paymentsController.createPayment);
routes.put("/payments/:id", paymentsController.updatePayment);
routes.delete("/payments/:id", paymentsController.deletePayment);

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
routes.post("/subscriptions", subscriptionsController.createSubscription);
routes.put(
  "/subscriptions/:id/status",
  subscriptionsController.updateSubscriptionStatus,
);
routes.delete("/subscriptions/:id", subscriptionsController.deleteSubscription);

/* ============================================
   SUPER ADMIN - PREVIEW
   ============================================ */

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

/* ============================================
   SUPER ADMIN - EXAMS
   ============================================ */

routes.get(
  "/exam-results/template",
  examResultsBulkController.downloadExamResultsTemplate,
);
routes.post(
  "/exam-results/bulk-upload/:examId",
  excelUpload.single("file"),
  examResultsBulkController.bulkUploadExamResults,
);

routes.get("/exams", examsController.getAllExams);
routes.get("/exams/grade/:gradeId/stats", examsController.getGradeExamStats);
routes.get("/exams/grade/:gradeId", examsController.getExamsByGradeId);
routes.get("/exams/group/:groupId", examsController.getExamsByGroupId);
routes.get("/exams/:id", examsController.getExamById);
routes.get("/exams/:id/stats", examsController.getExamStats);
routes.post("/exams", examsController.createExam);
routes.put("/exams/:id", examsController.updateExam);
routes.delete("/exams/:id", examsController.softDeleteExam);
routes.delete("/exams/:id/permanent", examsController.hardDeleteExam);

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
routes.post("/exam-results", examResultsController.createExamResult);
routes.post("/exam-results/upsert", examResultsController.upsertExamResult);
routes.post(
  "/exam-results/upsert-batch/:examId",
  examResultsController.upsertBatchExamResults,
);
routes.put("/exam-results/:id", examResultsController.updateExamResult);
routes.delete("/exam-results/:id", examResultsController.deleteExamResult);

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
routes.post("/online-exams", onlineExamController.createOnlineExam);
routes.put("/online-exams/:examId", onlineExamController.updateOnlineExam);
routes.delete(
  "/online-exams/:examId",
  onlineExamController.softDeleteOnlineExam,
);
routes.delete(
  "/online-exams/:examId/permanent",
  onlineExamController.hardDeleteOnlineExam,
);

routes.get("/questions/exam/:examId", questionController.getQuestionsByExamId);
routes.get("/questions/:questionId", questionController.getQuestionById);
routes.get(
  "/questions/:questionId/download",
  questionController.downloadQuestionFile,
);
routes.post("/questions", questionController.createQuestion);
routes.put("/questions/:questionId", questionController.updateQuestion);
routes.delete("/questions/:questionId", questionController.deleteQuestion);

routes.get(
  "/options/question/:questionId",
  optionController.getOptionsByQuestionId,
);
routes.get("/options/:optionId", optionController.getOptionById);
routes.post("/options", optionController.createOption);
routes.put("/options/:optionId", optionController.updateOption);
routes.delete("/options/:optionId", optionController.deleteOption);

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

routes.get(
  "/student-answers/question/:questionId/stats",
  studentAnswerController.getQuestionAnswerStats,
);
routes.get(
  "/student-answers/question/:questionId/options",
  studentAnswerController.getMostSelectedOptions,
);
routes.get(
  "/student-answers/essay/pending",
  studentAnswerController.getEssayAnswersForGrading,
);
routes.get(
  "/student-answers/essay/exam/:examId",
  studentAnswerController.getEssayAnswersByExam,
);
routes.put(
  "/student-answers/:answerId/grade",
  studentAnswerController.gradeEssayAnswer,
);

/* ============================================
   SUPER ADMIN - ASSIGNMENTS
   ============================================ */

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
routes.post("/assignments", assignmentController.createAssignment);
routes.put("/assignments/:assignmentId", assignmentController.updateAssignment);
routes.delete(
  "/assignments/:assignmentId",
  assignmentController.softDeleteAssignment,
);
routes.delete(
  "/assignments/:assignmentId/permanent",
  assignmentController.hardDeleteAssignment,
);

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
  "/assignment-submissions/assignment/:assignmentId/submitted-students",
  assignmentSubmissionController.getSubmittedStudents,
);
routes.get(
  "/assignment-submissions/assignment/:assignmentId/not-submitted-students",
  assignmentSubmissionController.getNotSubmittedStudents,
);
routes.get(
  "/assignment-submissions/stats/assignment/:assignmentId",
  assignmentSubmissionController.getAssignmentSubmissionStats,
);
routes.put(
  "/assignment-submissions/:submissionId/grade",
  assignmentSubmissionController.gradeSubmission,
);

/* ============================================
   SUPER ADMIN - VIDEOS & PLAYLISTS
   ============================================ */

routes.get("/videos", videoController.getAllVideos);
routes.get("/videos/grade/:gradeId", videoController.getVideosByGradeId);
routes.get("/videos/:videoId/download", videoController.downloadVideoFile);
routes.get("/videos/:videoId", videoController.getVideoById);
routes.post("/videos", videoController.createVideo);
routes.put("/videos/:videoId", videoController.updateVideo);
routes.delete("/videos/:videoId", videoController.hardDeleteVideo);

routes.get("/playlists", playlistController.getAllPlaylists);
routes.get(
  "/playlists/grade/:gradeId",
  playlistController.getPlaylistsByGradeId,
);
routes.get("/playlists/:playlistId", playlistController.getPlaylistById);
routes.post("/playlists", playlistController.createPlaylist);
routes.put("/playlists/:playlistId", playlistController.updatePlaylist);
routes.delete("/playlists/:playlistId", playlistController.hardDeletePlaylist);

routes.get(
  "/playlist-videos/playlist/:playlistId",
  playlistVideoController.getPlaylistVideos,
);
routes.post("/playlist-videos", playlistVideoController.addVideoToPlaylist);
routes.delete(
  "/playlist-videos/:id",
  playlistVideoController.removeVideoFromPlaylist,
);

/* ============================================
   SUPER ADMIN - WHATSAPP
   ============================================ */

routes.get("/whatsapp-messages", whatsappController.getAllTemplates);
routes.get(
  "/whatsapp-messages/:templateId",
  whatsappController.getTemplateById,
);
routes.post("/whatsapp-messages", whatsappController.createTemplate);
routes.put("/whatsapp-messages/:templateId", whatsappController.updateTemplate);
routes.put(
  "/whatsapp-messages/:templateId/toggle",
  whatsappController.toggleTemplateActive,
);

routes.put("/whatsapp/settings", whatsappController.updateSettings);
routes.get("/whatsapp/dashboard", whatsappController.getDashboard);
routes.get("/whatsapp/queue/stats", whatsappController.getQueueStats);
routes.post("/whatsapp/queue/send", whatsappController.sendQueue);
routes.post("/whatsapp/queue/reset-failed", whatsappController.resetFailed);
routes.get("/whatsapp/messages", whatsappController.getMessages);
routes.get("/whatsapp/messages/:messageId", whatsappController.getMessageById);
routes.delete(
  "/whatsapp/messages/:messageId",
  whatsappController.deleteMessage,
);

module.exports = routes;
