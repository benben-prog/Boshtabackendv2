const express = require("express");
const routes = express.Router();
const assignmentSubmissionController = require("./assignment_submissions.controller");
const validate = require("../../middlewares/validate.middleware");
const assignmentUpload = require("../../middlewares/uploads/assignmentUpload");
const {
  submitAssignmentSchema,
  updateSubmissionSchema,
  gradeSubmissionSchema,
} = require("../../middlewares/validations/assignmentSubmission.validation");

// routes.post("/upload-test", assignmentUpload.single("file"), (req, res) => {
//   return res.status(200).json({
//     success: true,
//     message: "تم رفع الملف بنجاح",
//     file: req.file,
//   });
// });

// Submit a new assignment (student)
routes.post(
  "/homeWorkSubmission/:assignmentId/submit",
  assignmentUpload.single("file"),
  assignmentSubmissionController.submitAssignment,
);
// Download File From server using file path from DB
routes.get(
  "/homeWorkSubmission/:assignmentId/download",
  assignmentSubmissionController.downloadSubmission,
);

// Update submission before deadline (student)
routes.put(
  "/homeWorkSubmission/:assignmentId/update",
  assignmentUpload.single("file"),
  assignmentSubmissionController.updateSubmission,
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
