const assignmentService = require("./assignments.service");
const { logActivity } = require("../../utils/activityLogger");
const path = require("path");
const { formatEgyptTime } = require("../../utils/timezone");
const { cleanupUploadedFiles, resolveStoredPath } = require("../../utils/fileStorage");
const fs = require("fs");

// ============================================
// HELPER: Format dates
// ============================================

const formatDate = (date) => {
  if (!date) return null;
  return formatEgyptTime(date, "YYYY-MM-DD HH:mm:ss");
};

const formatDatesInArray = (items) => {
  if (!items || !Array.isArray(items)) return items;
  return items.map((item) => formatDatesInObject(item));
};

const formatDatesInObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const formatted = { ...obj };
  const dateFields = [
    "created_at",
    "updated_at",
    "deadline",
    "submitted_at",
    "date",
  ];
  dateFields.forEach((field) => {
    if (formatted[field] !== undefined && formatted[field] !== null) {
      formatted[field] = formatDate(formatted[field]);
    }
  });
  return formatted;
};

// ============================================
// GET ALL
// ============================================

const getAllAssignments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const assignments = await assignmentService.getAllAssignments(page);

    const formattedAssignments = formatDatesInArray(assignments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجبات بنجاح",
      data: formattedAssignments,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET BY ID
// ============================================

const getAssignmentById = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentService.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new Error("الواجب غير موجود");
    }

    const formattedAssignment = formatDatesInObject(assignment);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجب بنجاح",
      data: formattedAssignment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET BY GRADE
// ============================================

const getAssignmentsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const assignments = await assignmentService.getAssignmentsByGradeId(
      gradeId,
      page,
    );

    const formattedAssignments = formatDatesInArray(assignments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجبات بنجاح",
      data: formattedAssignments,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET BY GROUP
// ============================================

const getAssignmentsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const assignments = await assignmentService.getAssignmentsByGroupId(
      groupId,
      page,
    );

    const formattedAssignments = formatDatesInArray(assignments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجبات بنجاح",
      data: formattedAssignments,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CREATE
// ============================================

const createAssignment = async (req, res, next) => {
  try {
    const { title, description, grade_id, group_id, full_mark, deadline } =
      req.body;
    const file_path = req.file ? req.file.path : null;
    const created_by = req.clientId;
    const is_closed =
      req.body.is_closed !== undefined ? parseInt(req.body.is_closed) : 0;

    const assignment = await assignmentService.createAssignment({
      title,
      description,
      grade_id,
      group_id,
      file_path,
      full_mark,
      deadline,
      created_by,
      is_closed,
    });

    if (!assignment) {
      throw new Error("فشل إنشاء الواجب حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_assignment",
      entity_type: "assignment",
      entity_id: assignment.id,
      description: `إنشاء واجب: ${assignment.title}`,
    });

    const formattedAssignment = formatDatesInObject(assignment);

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الواجب بنجاح",
      data: formattedAssignment,
    });
  } catch (error) {
    cleanupUploadedFiles(req);
    next(error);
  }
};

// ============================================
// UPDATE
// ============================================

const updateAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const oldAssignment = await assignmentService.getAssignmentById(assignmentId);
    const newFilePath = req.file ? req.file.path : null;

    const assignment = await assignmentService.updateAssignment(
      assignmentId,
      { ...req.body, ...(newFilePath ? { file_path: newFilePath } : {}) },
    );

    if (!assignment) {
      throw new Error("الواجب غير موجود");
    }

    if (newFilePath && oldAssignment?.file_path) {
      const oldPath = resolveStoredPath(oldAssignment.file_path);
      if (oldPath) fs.rmSync(oldPath, { force: true });
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_assignment",
      entity_type: "assignment",
      entity_id: assignmentId,
      description: `تعديل واجب (ID: ${assignmentId})`,
    });

    const formattedAssignment = formatDatesInObject(assignment);

    return res.status(200).json({
      success: true,
      message: "تم تعديل الواجب بنجاح",
      data: formattedAssignment,
    });
  } catch (error) {
    cleanupUploadedFiles(req);
    next(error);
  }
};

// ============================================
// DOWNLOAD
// ============================================

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

// ============================================
// DELETE
// ============================================

const softDeleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment =
      await assignmentService.softDeleteAssignment(assignmentId);

    if (!assignment) {
      throw new Error("الواجب غير موجود");
    }

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
      message: "تم حذف الواجب بنجاح",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const hardDeleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment =
      await assignmentService.hardDeleteAssignment(assignmentId);

    if (!assignment) {
      throw new Error("الواجب غير موجود");
    }

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
      message: "تم حذف الواجب نهائياً بنجاح",
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
