const express = require("express");
const routes = express.Router();
const assignmentSubmissionController = require("./assignment_submissions.controller");
const validate = require("../../middlewares/validate.middleware");
const assignmentUpload = require("../../middlewares/uploads/assignmentUpload");
const {
  gradeSubmissionSchema,
} = require("../../middlewares/validations/assignmentSubmission.validation");

// ============================================
// STUDENT ROUTES
// ============================================

// Submit assignment (student)
routes.post(
  "/homeWorkSubmission/:assignmentId/submit",
  assignmentUpload.single("file"),
  assignmentSubmissionController.submitAssignment,
);

// Update submission (student)
routes.put(
  "/homeWorkSubmission/:assignmentId/update",
  assignmentUpload.single("file"),
  assignmentSubmissionController.updateSubmission,
);

// Download own submission
routes.get(
  "/homeWorkSubmission/:assignmentId/download",
  assignmentSubmissionController.downloadSubmission,
);

// ============================================
// TEACHER/ASSISTANT ROUTES
// ============================================

// Download student submission (teacher/assistant)
routes.get(
  "/homeWorkSubmission/:assignmentId/student/:studentId/download",
  assignmentSubmissionController.downloadSubmission,
);

// Get all submissions for assignment
routes.get(
  "/assignment/:assignmentId",
  assignmentSubmissionController.getSubmissionsByAssignmentId,
);

// Get specific student submission
routes.get(
  "/assignment/:assignmentId/student/:studentId",
  assignmentSubmissionController.getStudentSubmission,
);

// Get students who submitted
routes.get(
  "/assignment/:assignmentId/submitted-students",
  assignmentSubmissionController.getSubmittedStudents,
);

// Get students who have not submitted
routes.get(
  "/assignment/:assignmentId/not-submitted-students",
  assignmentSubmissionController.getNotSubmittedStudents,
);

// Grade a submission
routes.put(
  "/:submissionId/grade",
  validate(gradeSubmissionSchema),
  assignmentSubmissionController.gradeSubmission,
);

// Get assignment submission stats
routes.get(
  "/stats/assignment/:assignmentId",
  assignmentSubmissionController.getAssignmentSubmissionStats,
);

// Get grade submissions stats
routes.get(
  "/stats/grade/:gradeId",
  assignmentSubmissionController.getGradeAssignmentSubmissionStats,
);

// Get group submissions stats
routes.get(
  "/stats/group/:groupId",
  assignmentSubmissionController.getGroupAssignmentSubmissionStats,
);

module.exports = routes;
