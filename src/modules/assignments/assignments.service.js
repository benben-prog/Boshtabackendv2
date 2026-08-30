const { query } = require("../../config/database");
const assignmentQueries = require("./assignments.queries");

// Get all assignments
const getAllAssignments = async (page = 1) => {
  const result = await query(assignmentQueries.getAllAssignments, [page]);
  return result.rows;
};

// Get assignment by ID
const getAssignmentById = async (assignmentId) => {
  const result = await query(assignmentQueries.getAssignmentById, [
    assignmentId,
  ]);
  return result.rows[0];
};

// Get assignments by grade
const getAssignmentsByGradeId = async (gradeId, page = 1) => {
  const result = await query(assignmentQueries.getAssignmentsByGradeId, [
    gradeId,
    page,
  ]);
  return result.rows;
};

// Get assignments by group
const getAssignmentsByGroupId = async (groupId, page = 1) => {
  const result = await query(assignmentQueries.getAssignmentsByGroupId, [
    groupId,
    page,
  ]);
  return result.rows;
};

// Create assignment
const createAssignment = async (assignmentData) => {
  const {
    title,
    description,
    grade_id,
    group_id,
    file_path,
    full_mark,
    deadline,
    created_by,
    is_closed = 0,
  } = assignmentData;
  const result = await query(assignmentQueries.createAssignment, [
    title,
    description,
    grade_id,
    group_id,
    file_path,
    full_mark,
    deadline,
    created_by,
    is_closed,
  ]);
  return result.rows[0];
};

// Update assignment - ✅ إصلاح is_closed
const updateAssignment = async (assignmentId, assignmentData) => {
  const {
    title,
    description,
    grade_id,
    group_id,
    file_path,
    full_mark,
    deadline,
    is_closed,
  } = assignmentData;

  const existing = await query(
    "SELECT * FROM assignments WHERE id = $1 AND deleted = 0",
    [assignmentId],
  );
  if (!existing.rows[0]) return null;

  const updated = {
    title: title ?? existing.rows[0].title,
    description: description ?? existing.rows[0].description,
    grade_id: grade_id ?? existing.rows[0].grade_id,
    group_id: group_id ?? existing.rows[0].group_id,
    file_path: file_path ?? existing.rows[0].file_path,
    full_mark: full_mark ?? existing.rows[0].full_mark,
    deadline: deadline ?? existing.rows[0].deadline,
    // ✅ لو is_closed مش مبعوت، خليه 0 (مفتوح)
    // ✅ لو مبعوت كـ string، حوله لرقم
    is_closed:
      is_closed !== undefined && is_closed !== null
        ? parseInt(is_closed)
        : 0,
  };

  const result = await query(assignmentQueries.updateAssignment, [
    assignmentId,
    updated.title,
    updated.description,
    updated.grade_id,
    updated.group_id,
    updated.file_path,
    updated.full_mark,
    updated.deadline,
    updated.is_closed,
  ]);
  return result.rows[0];
};

// Soft delete assignment
const softDeleteAssignment = async (assignmentId) => {
  const result = await query(assignmentQueries.softDeleteAssignment, [
    assignmentId,
  ]);
  return result.rows[0];
};

// Hard delete assignment
const hardDeleteAssignment = async (assignmentId) => {
  const result = await query(assignmentQueries.hardDeleteAssignment, [
    assignmentId,
  ]);
  return result.rows[0];
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
};
