const express = require("express");
const routes = express.Router();

// Uploads
const assignmentUpload = require("../../middlewares/uploads/assignmentUpload");
const videoFilesUpload = require("../../middlewares/uploads/videoFilesUpload");
const examUpload = require("../../middlewares/uploads/examUpload");
const playlistThumbnailUpload = require("../../middlewares/uploads/playlistThumbnailUpload");
const excelUpload = require("../../middlewares/uploads/excelUpload");

// Controllers
const previewController = require("../../controllers/preview.controller");
const assistantController = require("./assistant.controller");
const usersController = require("../users/users.controller");
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
const centerManagementAuth = require("../../middlewares/centerManagementAuth.middleware");
const onlineManagementAuth = require("../../middlewares/onlineManagementAuth.middleware");
const validate = require("../../middlewares/validate.middleware");
const profileImageUpload = require("../../middlewares/uploads/profileImageUpload");
const {
  updateUserPasswordSchema,
} = require("../../middlewares/validations/users.validation");

/* ============================================
   PROFILE & DASHBOARD & ACTIVITY LOG
   ============================================ */

routes.get("/profile", assistantController.getProfile);
routes.get("/dashboard", assistantController.getDashboard);
routes.get("/activity-log", assistantController.getActivityLog);

routes.put(
  "/profile-image",
  profileImageUpload.single("image"),
  usersController.updateUserProfileImage,
);

routes.delete("/profile-image", usersController.deleteUserProfileImage);

routes.put(
  "/password",
  validate(updateUserPasswordSchema),
  usersController.updateUserPassword,
);

/* ============================================
   ONLINE MANAGEMENT ROUTES
   ============================================ */

routes.use(onlineManagementAuth);

/* ---------- Preview Routes ---------- */
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

/* ---------- Online Exams ---------- */
// Static routes first
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
// Dynamic routes last
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

/* ---------- Questions ---------- */
// Static routes first
routes.get("/questions/exam/:examId", questionController.getQuestionsByExamId);
routes.get(
  "/questions/:questionId/download",
  questionController.downloadQuestionFile,
);
// Dynamic routes last
routes.get("/questions/:questionId", questionController.getQuestionById);
routes.post(
  "/questions",
  examUpload.single("file"),
  questionController.createQuestion,
);
routes.put(
  "/questions/:questionId",
  examUpload.single("file"),
  questionController.updateQuestion,
);
routes.delete("/questions/:questionId", questionController.deleteQuestion);

/* ---------- Options ---------- */
// Static routes first
routes.get(
  "/options/question/:questionId",
  optionController.getOptionsByQuestionId,
);
// Dynamic routes last
routes.get("/options/:optionId", optionController.getOptionById);
routes.post("/options", optionController.createOption);
routes.put("/options/:optionId", optionController.updateOption);
routes.delete("/options/:optionId", optionController.deleteOption);

/* ---------- Assignments ---------- */
// Static routes first
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
// Dynamic routes last
routes.get(
  "/assignments/:assignmentId",
  assignmentController.getAssignmentById,
);
routes.post(
  "/assignments",
  assignmentUpload.single("file"),
  assignmentController.createAssignment,
);
routes.put(
  "/assignments/:assignmentId",
  assignmentUpload.single("file"),
  assignmentController.updateAssignment,
);
routes.delete(
  "/assignments/:assignmentId",
  assignmentController.softDeleteAssignment,
);
routes.delete(
  "/assignments/:assignmentId/permanent",
  assignmentController.hardDeleteAssignment,
);

/* ---------- Assignment Submissions ---------- */
routes.get(
  "/assignment-submissions/stats/grade/:gradeId",
  assignmentSubmissionController.getGradeAssignmentSubmissionStats,
);
routes.get(
  "/assignment-submissions/stats/group/:groupId",
  assignmentSubmissionController.getGroupAssignmentSubmissionStats,
);
routes.get(
  "/assignment-submissions/stats/assignment/:assignmentId",
  assignmentSubmissionController.getAssignmentSubmissionStats,
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
  "/assignment-submissions/assignment/:assignmentId/student/:studentId",
  assignmentSubmissionController.getStudentSubmission,
);
routes.get(
  "/assignment-submissions/assignment/:assignmentId",
  assignmentSubmissionController.getSubmissionsByAssignmentId,
);
routes.put(
  "/assignment-submissions/:submissionId/grade",
  assignmentSubmissionController.gradeSubmission,
);

/* ---------- Videos ---------- */
// Static routes first
routes.get("/videos", videoController.getAllVideos);
routes.get("/videos/grade/:gradeId", videoController.getVideosByGradeId);
routes.get("/videos/:videoId/download", videoController.downloadVideoFile);
// Dynamic routes last
routes.get("/videos/:videoId", videoController.getVideoById);
routes.post(
  "/videos",
  videoFilesUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  videoController.createVideo,
);
routes.put(
  "/videos/:videoId",
  videoFilesUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  videoController.updateVideo,
);
routes.delete("/videos/:videoId", videoController.hardDeleteVideo);

/* ---------- Playlists ---------- */
// Static routes first
routes.get("/playlists", playlistController.getAllPlaylists);
routes.get(
  "/playlists/grade/:gradeId",
  playlistController.getPlaylistsByGradeId,
);
// Dynamic routes last
routes.get("/playlists/:playlistId", playlistController.getPlaylistById);
routes.post(
  "/playlists",
  playlistThumbnailUpload.single("thumbnail"),
  playlistController.createPlaylist,
);
routes.put(
  "/playlists/:playlistId",
  playlistThumbnailUpload.single("thumbnail"),
  playlistController.updatePlaylist,
);
routes.delete("/playlists/:playlistId", playlistController.hardDeletePlaylist);

/* ---------- Playlist Videos ---------- */
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
   CENTER MANAGEMENT ROUTES
   ============================================ */

routes.use(centerManagementAuth);

/* ---------- Bulk Uploads ---------- */
routes.get(
  "/students/template",
  studentsBulkController.downloadStudentsTemplate,
);
routes.post(
  "/students/bulk-upload",
  excelUpload.single("file"),
  studentsBulkController.bulkUploadStudents,
);

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

routes.get(
  "/exam-results/template",
  examResultsBulkController.downloadExamResultsTemplate,
);
routes.post(
  "/exam-results/bulk-upload/:examId",
  excelUpload.single("file"),
  examResultsBulkController.bulkUploadExamResults,
);

/* ---------- Grades ---------- */
// Static routes first
routes.get("/grades", gradesController.getAllGrades);
routes.get("/grades/groups-count", gradesController.getGradesWithGroupsCount);
routes.get(
  "/grades/students-count",
  gradesController.getGradesWithStudentsCount,
);
routes.get("/grades/stats", gradesController.getAllGradesStats);
routes.post("/grades/find", gradesController.findGradeByName);
// Dynamic routes (longer paths first)
routes.get("/grades/:id/details", gradesController.getGradeDetails);
routes.get("/grades/:id/stats", gradesController.getGradeStats);
routes.get("/grades/:id", gradesController.getGradeById);
// Mutations
routes.post("/grades", gradesController.createGrade);
routes.put("/grades/:id", gradesController.updateGrade);
routes.delete("/grades/:id", gradesController.softDeleteGrade);
routes.delete("/grades/:id/permanent", gradesController.hardDeleteGrade);

/* ---------- Groups ---------- */
// Static routes first
routes.get("/groups", groupsController.getAllGroups);
routes.get("/groups/with-grade-name", groupsController.getGroupsWithGradeName);
routes.get(
  "/groups/students-count",
  groupsController.getGroupsWithStudentsCount,
);
routes.get("/groups/stats", groupsController.getAllGroupsStats);
routes.post("/groups/find", groupsController.findGroupByName);
routes.get("/groups/grade/:gradeId", groupsController.getGroupsByGradeId);
// Dynamic routes (longer paths first)
routes.get("/groups/:id/full-stats", groupsController.getGroupFullStats);
routes.get("/groups/:id/stats", groupsController.getGroupStats);
routes.get("/groups/:id", groupsController.getGroupById);
// Mutations
routes.post("/groups", groupsController.createGroup);
routes.put("/groups/:id", groupsController.updateGroup);
routes.delete("/groups/:id", groupsController.softDeleteGroup);
routes.delete("/groups/:id/permanent", groupsController.hardDeleteGroup);

/* ---------- Student Answers ---------- */
routes.get(
  "/student-answers/essay/pending",
  studentAnswerController.getEssayAnswersForGrading,
);
routes.get(
  "/student-answers/essay/exam/:examId",
  studentAnswerController.getEssayAnswersByExam,
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
  "/student-answers/:answerId/download",
  studentAnswerController.downloadAnswerFile,
);
routes.put(
  "/student-answers/:answerId/grade",
  studentAnswerController.gradeEssayAnswer,
);

/* ---------- Students ---------- */
// Static routes first
routes.get("/students", studentsController.getAllStudents);
routes.get("/students/deleted", studentsController.getDeletedStudents);
routes.get("/students/search/barcode", studentsController.getStudentByBarcode);
routes.get("/students/search/phone", studentsController.findStudentByPhone);
routes.get(
  "/students/search/parent-phone",
  studentsController.findStudentByParentPhone,
);
routes.get("/students/grade/:gradeId", studentsController.getStudentsByGradeId);
routes.get("/students/group/:groupId", studentsController.getStudentsByGroupId);
// Dynamic routes (longer paths first)
routes.get(
  "/students/:studentId/profile",
  studentsController.getStudentProfile,
);
routes.get(
  "/students/:studentId/stats",
  studentsController.getStudentQuickStats,
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
  "/students/:studentId/attendance",
  studentsController.getAttendanceHistory,
);
routes.get(
  "/students/:studentId/payments/current-subscription",
  studentsController.getCurrentSubscription,
);
routes.get(
  "/students/:studentId/payments",
  studentsController.getPaymentHistory,
);
routes.get(
  "/students/:studentId/exams/paper/:examId",
  studentsController.getStudentPaperExamById,
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
  "/students/:studentId/exams/online/:attemptId",
  studentsController.getStudentOnlineExamById,
);
routes.get(
  "/students/:studentId/assignments/:assignmentId",
  studentsController.getStudentAssignmentById,
);
routes.get(
  "/students/:studentId/assignments",
  studentsController.getStudentAssignments,
);
routes.get(
  "/students/:studentId/submissions/:submissionId",
  studentsController.getStudentSubmissionById,
);
routes.get(
  "/students/:studentId/submissions",
  studentsController.getStudentSubmissions,
);
routes.get(
  "/students/:studentId/playlists",
  studentsController.getStudentPlaylists,
);
routes.get("/students/:studentId", studentsController.getStudentById);
// Mutations
routes.post("/students", studentsController.createStudent);
routes.put("/students/:studentId", studentsController.updateStudent);
routes.delete("/students/:studentId", studentsController.softDeleteStudent);
routes.delete(
  "/students/:studentId/permanent",
  studentsController.hardDeleteStudent,
);
routes.post("/students/:studentId/restore", studentsController.restoreStudent);

/* ---------- Attendance ---------- */
// Static routes first
routes.get("/attendance/dashboard", attendanceController.getDashboard);
routes.get(
  "/attendance/overall-stats",
  attendanceController.getOverallAttendanceStats,
);
routes.get(
  "/attendance/consecutive-absences",
  attendanceController.getStudentsWithThreeConsecutiveAbsences,
);
routes.get("/attendance/absent", attendanceController.getAbsentStudentsByDate);
routes.get(
  "/attendance/grade/:gradeId/stats",
  attendanceController.getGradeAttendanceStats,
);
routes.get(
  "/attendance/group/:groupId/date/:date",
  attendanceController.getAttendanceByGroupAndDate,
);
routes.get(
  "/attendance/absent/group/:groupId/date/:date",
  attendanceController.getAbsentByGroupAndDate,
);
routes.get(
  "/attendance/group/:groupId/month/:month",
  attendanceController.getAttendanceByGroupAndMonth,
);
routes.get(
  "/attendance/summary/group/:groupId/date/:date",
  attendanceController.getAttendanceSummary,
);
// Sessions
routes.post("/attendance/sessions/start", attendanceController.startSession);
routes.get(
  "/attendance/sessions/active/:groupId",
  attendanceController.getActiveSession,
);
routes.put(
  "/attendance/sessions/:id/toggle-makeup",
  attendanceController.toggleMakeupMode,
);
routes.post("/attendance/sessions/lock", attendanceController.lockSession);
// Barcode
routes.post("/attendance/scan-barcode", attendanceController.scanBarcode);
// Dynamic routes last
routes.get("/attendance/:id", attendanceController.getAttendanceById);
routes.post("/attendance", attendanceController.createAttendance);
routes.put("/attendance/:id", attendanceController.updateAttendance);
routes.delete("/attendance/:id", attendanceController.deleteAttendance);

/* ---------- Payments ---------- */
// Static routes first
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
// Dynamic routes last
routes.get("/payments/:id", paymentsController.getPaymentById);
routes.post("/payments", paymentsController.createPayment);
routes.put("/payments/:id", paymentsController.updatePayment);
routes.delete("/payments/:id", paymentsController.deletePayment);

/* ---------- Subscriptions ---------- */
// Static routes first
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
// Mutations & dynamic
routes.post("/subscriptions", subscriptionsController.createSubscription);
routes.put(
  "/subscriptions/:id/status",
  subscriptionsController.updateSubscriptionStatus,
);
routes.delete("/subscriptions/:id", subscriptionsController.deleteSubscription);

/* ---------- Exams ---------- */
// Static routes first
routes.get("/exams", examsController.getAllExams);
routes.get("/exams/grade/:gradeId/stats", examsController.getGradeExamStats);
routes.get("/exams/grade/:gradeId", examsController.getExamsByGradeId);
routes.get("/exams/group/:groupId", examsController.getExamsByGroupId);
// Dynamic routes (longer paths first)
routes.get("/exams/:id/stats", examsController.getExamStats);
routes.get("/exams/:id", examsController.getExamById);
// Mutations
routes.post("/exams", examsController.createExam);
routes.put("/exams/:id", examsController.updateExam);
routes.delete("/exams/:id", examsController.softDeleteExam);
routes.delete("/exams/:id/permanent", examsController.hardDeleteExam);

/* ---------- Exam Results ---------- */
// Static routes first
routes.get(
  "/exam-results/grade/:gradeId/stats",
  examResultsController.getGradeExamResultsStats,
);
routes.get(
  "/exam-results/group/:groupId/stats",
  examResultsController.getGroupExamResultsStats,
);
routes.get(
  "/exam-results/exam/:examId/stats",
  examResultsController.getExamResultStats,
);
routes.get("/exam-results/exam/:examId", examResultsController.getExamResults);
// Mutations & dynamic
routes.post("/exam-results", examResultsController.createExamResult);
routes.post("/exam-results/upsert", examResultsController.upsertExamResult);
routes.post(
  "/exam-results/upsert-batch/:examId",
  examResultsController.upsertBatchExamResults,
);
routes.put("/exam-results/:id", examResultsController.updateExamResult);
routes.delete("/exam-results/:id", examResultsController.deleteExamResult);

/* ---------- Student Exams ---------- */
routes.get(
  "/student-exams/exam/:examId/stats",
  studentExamController.getExamAttemptStats,
);
routes.get(
  "/student-exams/exam/:examId",
  studentExamController.getStudentExamsByExamId,
);
routes.get(
  "/student-exams/grade/:gradeId/stats",
  studentExamController.getGradeExamAttemptsStats,
);
routes.get(
  "/student-exams/group/:groupId/stats",
  studentExamController.getGroupExamAttemptsStats,
);

/* ============================================
   WHATSAPP - TEMPLATES
   ============================================ */

// Static routes first
routes.get("/whatsapp-messages", whatsappController.getAllTemplates);
// Dynamic routes last
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

/* ============================================
   WHATSAPP - DASHBOARD, QUEUE & MESSAGES
   ============================================ */

// Dashboard
routes.get("/whatsapp/dashboard", whatsappController.getDashboard);

// Queue management
routes.get("/whatsapp/queue/stats", whatsappController.getQueueStats);
routes.post("/whatsapp/queue/force-process", whatsappController.forceProcess);
routes.post("/whatsapp/queue/send", whatsappController.sendQueue);
routes.post("/whatsapp/queue/reset-failed", whatsappController.resetFailed);

// Settings
routes.put("/whatsapp/settings", whatsappController.updateSettings);

// Messages
routes.get("/whatsapp/messages", whatsappController.getMessages);
routes.get("/whatsapp/messages/:messageId", whatsappController.getMessageById);
routes.delete(
  "/whatsapp/messages/:messageId",
  whatsappController.deleteMessage,
);

module.exports = routes;
