const assignmentSubmissionService = require("./assignment_submissions.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");

// ============================================
// SUBMIT
// ============================================

const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const filePath = req.file?.path;
    const studentId = req.clientId;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "يرجى رفع ملف التسليم",
      });
    }

    const submission = await assignmentSubmissionService.submitAssignment(
      assignmentId,
      studentId,
      filePath,
    );

    if (!submission) {
      // Delete uploaded file if submission failed
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "لا يمكن تسليم هذا الواجب - قد يكون مغلقاً أو منتهياً",
      });
    }

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

// ============================================
// UPDATE
// ============================================

const updateSubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const filePath = req.file?.path;
    const studentId = req.clientId;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "يرجى رفع ملف التسليم",
      });
    }

    const oldSubmission =
      await assignmentSubmissionService.getStudentSubmission(
        assignmentId,
        studentId,
      );

    if (!oldSubmission) {
      // Delete uploaded file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "لا يوجد تسليم مسبق لهذا الواجب",
      });
    }

    const submission = await assignmentSubmissionService.updateSubmission(
      assignmentId,
      studentId,
      filePath,
    );

    if (!submission) {
      // Delete uploaded file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "لا يمكن تعديل التسليم - الواجب مغلق أو تم تصحيحه",
      });
    }

    // Delete old file after successful update
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

// ============================================
// DOWNLOAD
// ============================================

const downloadSubmission = async (req, res, next) => {
  try {
    const { assignmentId, studentId } = req.params;

    // Determine which student ID to use
    // - If studentId provided in params (teacher/assistant viewing), use it
    // - Otherwise, use logged-in user's ID (student viewing own)
    const targetStudentId = studentId || req.clientId;

    // Students can only view their own submissions
    if (
      req.clientRole === "student" &&
      Number(targetStudentId) !== Number(req.clientId)
    ) {
      throw new Error("غير مصرح لك بالوصول");
    }

    const submission = await assignmentSubmissionService.getStudentSubmission(
      assignmentId,
      targetStudentId,
    );

    if (!submission) {
      throw new Error("التسليم غير موجود");
    }

    const filePath = path.join(__dirname, "../../../", submission.file_path);

    if (!fs.existsSync(filePath)) {
      throw new Error("الملف غير موجود");
    }

    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

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

    if (!submission) {
      throw new Error("التسليم غير موجود");
    }

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

// ============================================
// GRADE
// ============================================

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

    if (!submission) {
      throw new Error("التسليم غير موجود أو تم تصحيحه مسبقاً");
    }

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

// ============================================
// STATISTICS
// ============================================

const getAssignmentSubmissionStats = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const stats =
      await assignmentSubmissionService.getAssignmentSubmissionStats(
        assignmentId,
      );

    if (!stats) {
      throw new Error("الواجب غير موجود");
    }

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
