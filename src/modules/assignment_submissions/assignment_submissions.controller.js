const assignmentSubmissionService = require("./assignment_submissions.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");

const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const filePath = req.file.path;
    const studentId = req.clientId;

    const submission = await assignmentSubmissionService.submitAssignment(
      assignmentId,
      studentId,
      filePath,
    );

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "submit_assignment",
      entity_type: "assignment_submission",
      entity_id: submission.id,
      description: `تسليم واجب (ID: ${assignmentId})`,
    });

    return res.status(201).json({
      success: true,
      message: "تم تسليم الواجب بنجاح",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const filePath = req.file.path;
    const studentId = req.clientId;

    const oldSubmission =
      await assignmentSubmissionService.getStudentSubmission(
        assignmentId,
        studentId,
      );

    if (!oldSubmission) {
      throw new Error("لا يوجد تسليم مسبق لهذا الواجب");
    }

    const submission = await assignmentSubmissionService.updateSubmission(
      assignmentId,
      studentId,
      filePath,
    );

    if (!submission) {
      throw new Error("لا يمكن تعديل التسليم بعد التصحيح أو بعد انتهاء الوقت");
    }

    if (oldSubmission.file_path) {
      const oldFilePath = path.join(
        __dirname,
        "../../../",
        oldSubmission.file_path,
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_assignment_submission",
      entity_type: "assignment_submission",
      entity_id: submission.id,
      description: `تعديل تسليم واجب (ID: ${assignmentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل التسليم بنجاح",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const downloadSubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.clientId;

    const submission = await assignmentSubmissionService.getStudentSubmission(
      assignmentId,
      studentId,
    );

    if (!submission) {
      throw new Error("التسليم غير موجود");
    }

    const filePath = path.join(__dirname, "../../../", submission.file_path);

    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

const getSubmissionsByAssignmentId = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const submissions =
      await assignmentSubmissionService.getSubmissionsByAssignmentId(
        assignmentId,
        page,
      );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentSubmission = async (req, res, next) => {
  try {
    const { assignmentId, studentId } = req.params;

    const submission = await assignmentSubmissionService.getStudentSubmission(
      assignmentId,
      studentId,
    );

    if (!submission) throw new Error("التسليم غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmittedStudents = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const students = await assignmentSubmissionService.getSubmittedStudents(
      assignmentId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getNotSubmittedStudents = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const students = await assignmentSubmissionService.getNotSubmittedStudents(
      assignmentId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;
    const reviewedBy = req.clientId;

    const submission = await assignmentSubmissionService.gradeSubmission(
      submissionId,
      score,
      feedback,
      reviewedBy,
    );

    if (!submission) throw new Error("التسليم غير موجود أو تم تصحيحه مسبقاً");

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "grade_assignment",
      entity_type: "assignment_submission",
      entity_id: submissionId,
      description: `تصحيح تسليم واجب (ID: ${submissionId}) - الدرجة: ${score}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تصحيح التسليم بنجاح",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const getAssignmentSubmissionStats = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const stats =
      await assignmentSubmissionService.getAssignmentSubmissionStats(
        assignmentId,
      );

    if (!stats) throw new Error("الواجب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeAssignmentSubmissionStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const stats =
      await assignmentSubmissionService.getGradeAssignmentSubmissionStats(
        gradeId,
      );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupAssignmentSubmissionStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const stats =
      await assignmentSubmissionService.getGroupAssignmentSubmissionStats(
        groupId,
      );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAssignment,
  updateSubmission,
  downloadSubmission,
  getSubmissionsByAssignmentId,
  getStudentSubmission,
  getSubmittedStudents,
  getNotSubmittedStudents,
  gradeSubmission,
  getAssignmentSubmissionStats,
  getGradeAssignmentSubmissionStats,
  getGroupAssignmentSubmissionStats,
};
