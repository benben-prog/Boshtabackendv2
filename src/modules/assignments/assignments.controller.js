const assignmentService = require("./assignments.service");
const { logActivity } = require("../../utils/activityLogger");
const path = require("path");

// Get all assignments
const getAllAssignments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const assignments = await assignmentService.getAllAssignments(page);

    if (!assignments) {
      throw new Error("فشل تحميل الواجبات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجبات بنجاح!",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentService.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new Error("فشل تحميل الواجب حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجب بنجاح!",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Get assignments by grade
const getAssignmentsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const assignments = await assignmentService.getAssignmentsByGradeId(
      gradeId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجبات بنجاح!",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Get assignments by group
const getAssignmentsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const assignments = await assignmentService.getAssignmentsByGroupId(
      groupId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجبات بنجاح!",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Create assignment
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, grade_id, group_id, full_mark, deadline } =
      req.body;
    const file_path = req.file ? req.file.path : null;
    const created_by = req.clientId;

    const assignment = await assignmentService.createAssignment({
      title,
      description,
      grade_id,
      group_id,
      file_path,
      full_mark,
      deadline,
      created_by,
    });

    if (!assignment) {
      throw new Error("فشل إنشاء الواجب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_assignment",
      entity_type: "assignment",
      entity_id: assignment.id,
      description: `إنشاء واجب: ${assignment.title}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الواجب بنجاح!",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Update assignment - with smart deadline handling
const updateAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    // Collect data from body and file
    const updateData = {
      ...req.body,
      file_path: req.file ? req.file.path : undefined,
    };

    // If new deadline is provided and assignment should be opened
    if (updateData.deadline && !updateData.is_closed) {
      updateData.is_closed = 0;
    }

    const assignment = await assignmentService.updateAssignment(
      assignmentId,
      updateData,
    );

    if (!assignment) {
      throw new Error("فشل تعديل الواجب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_assignment",
      entity_type: "assignment",
      entity_id: assignmentId,
      description: `تعديل واجب (ID: ${assignmentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الواجب بنجاح!",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Download assignment file
const downloadAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentService.getAssignmentById(assignmentId);

    if (!assignment || !assignment.file_path) {
      throw new Error("الملف غير موجود");
    }

    const filePath = path.join(__dirname, "../../../", assignment.file_path);
    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// Soft delete assignment
const softDeleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment =
      await assignmentService.softDeleteAssignment(assignmentId);

    if (!assignment) {
      throw new Error("فشل حذف الواجب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "soft_delete_assignment",
      entity_type: "assignment",
      entity_id: assignmentId,
      description: `حذف مؤقت لواجب (ID: ${assignmentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الواجب بنجاح!",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Hard delete assignment
const hardDeleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment =
      await assignmentService.hardDeleteAssignment(assignmentId);

    if (!assignment) {
      throw new Error("فشل حذف الواجب نهائيًا حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "hard_delete_assignment",
      entity_type: "assignment",
      entity_id: assignmentId,
      description: `حذف نهائي لواجب (ID: ${assignmentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الواجب نهائيًا بنجاح!",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByGradeId,
  getAssignmentsByGroupId,
  createAssignment,
  updateAssignment,
  softDeleteAssignment,
  hardDeleteAssignment,
  downloadAssignment,
};
