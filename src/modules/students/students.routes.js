const express = require("express");
const routes = express.Router();
const stdController = require("./students.controller");
const studentsBulkController = require("./students.bulk.controller");
const excelUpload = require("../../middlewares/uploads/excelUpload");
const validate = require("../../middlewares/validate.middleware");
const {
  createStudentSchema,
  updateStudentSchema,
  updateStudentPasswordSchema,
  updateStudentProfileImageSchema,
} = require("../../middlewares/validations/students.validation");

// ============================================
// BULK OPERATIONS ROUTES
// ============================================

// تحميل Template للطلاب
routes.get("/template", studentsBulkController.downloadStudentsTemplate);

// رفع ملف Excel لإضافة طلاب
routes.post(
  "/bulk-upload",
  excelUpload.single("file"),
  studentsBulkController.bulkUploadStudents,
);

// ============================================
// PART 1: CRUD & SEARCH ROUTES
// ============================================

// Create a new student
routes.post("/", validate(createStudentSchema), stdController.createStudent);

// Get all students with filters
routes.get("/", stdController.getAllStudents);

// Get deleted students
routes.get("/deleted", stdController.getDeletedStudents);

// Search by barcode
routes.get("/search/barcode", stdController.getStudentByBarcode);

// Search by phone
routes.get("/search/phone", stdController.findStudentByPhone);

// Search by parent phone
routes.get("/search/parent-phone", stdController.findStudentByParentPhone);

// Get students by grade
routes.get("/grade/:gradeId", stdController.getStudentsByGradeId);

// Get students by group
routes.get("/group/:groupId", stdController.getStudentsByGroupId);

// Get student by ID
routes.get("/:studentId", stdController.getStudentById);

// Update student full information
routes.put(
  "/:studentId",
  validate(updateStudentSchema),
  stdController.updateStudent,
);

// Soft delete a student
routes.delete("/:studentId", stdController.softDeleteStudent);

// Hard delete a student
routes.delete("/:studentId/permanent", stdController.hardDeleteStudent);

// Restore a soft-deleted student
routes.post("/:studentId/restore", stdController.restoreStudent);

// ============================================
// PART 2: PROFILE & STATISTICS ROUTES
// ============================================

// Get student full profile
routes.get("/:studentId/profile", stdController.getStudentProfile);

// Get student quick stats
routes.get("/:studentId/stats", stdController.getStudentQuickStats);

// Get student profile image
routes.get("/:studentId/profile-image", stdController.getStudentProfileImage);

// Update student profile image
routes.put(
  "/profile-image",
  validate(updateStudentProfileImageSchema),
  stdController.updateStudentProfileImage,
);

// Delete student profile image
routes.delete("/profile-image", stdController.deleteStudentProfileImage);

// Update student password
routes.put(
  "/password",
  validate(updateStudentPasswordSchema),
  stdController.updateStudentPassword,
);

// Get attendance history
routes.get("/:studentId/attendance", stdController.getAttendanceHistory);

// Get monthly attendance stats
routes.get(
  "/:studentId/attendance/monthly",
  stdController.getMonthlyAttendanceStats,
);

// Get total attendance for a month
routes.get(
  "/:studentId/attendance/total",
  stdController.getStudentTotalAttendance,
);

// Get consecutive absences
routes.get(
  "/:studentId/attendance/consecutive-absences",
  stdController.getConsecutiveAbsences,
);

// Get payment history
routes.get("/:studentId/payments", stdController.getPaymentHistory);

// Get remaining balance
routes.get("/:studentId/payments/balance", stdController.getRemainingBalance);

// Get current subscription
routes.get(
  "/:studentId/payments/current-subscription",
  stdController.getCurrentSubscription,
);

// ============================================
// PART 3: EXAMS, ASSIGNMENTS & CONTENT ROUTES
// ============================================

// Get paper exams
routes.get("/:studentId/exams/paper", stdController.getStudentPaperExams);

// Get specific paper exam details
routes.get(
  "/:studentId/exams/paper/:examId",
  stdController.getStudentPaperExamById,
);

// Get exam results
routes.get("/:studentId/exams/results", stdController.getStudentExamResults);

// Get available online exams
routes.get(
  "/:studentId/exams/online/available",
  stdController.getAvailableOnlineExams,
);

// Get submitted online exams
routes.get(
  "/:studentId/exams/online/history",
  stdController.getStudentOnlineExams,
);

// Get specific online exam details
routes.get(
  "/:studentId/exams/online/:attemptId",
  stdController.getStudentOnlineExamById,
);

// Get exam answers
routes.get(
  "/:studentId/exams/:examId/answers",
  stdController.getStudentExamAnswers,
);

// Get student assignments
routes.get("/:studentId/assignments", stdController.getStudentAssignments);

// Get specific assignment details
routes.get(
  "/:studentId/assignments/:assignmentId",
  stdController.getStudentAssignmentById,
);

// Get student submissions
routes.get("/:studentId/submissions", stdController.getStudentSubmissions);

// Get specific submission details
routes.get(
  "/:studentId/submissions/:submissionId",
  stdController.getStudentSubmissionById,
);

// Get student playlists
routes.get("/:studentId/playlists", stdController.getStudentPlaylists);

// Get playlist videos
routes.get(
  "/:studentId/playlists/:playlistId/videos",
  stdController.getPlaylistVideos,
);

module.exports = routes;
