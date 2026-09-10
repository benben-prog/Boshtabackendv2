const { query } = require("../../config/database");
const assignmentQueries = require("./assignments.queries");

// ============================================
// CREATE
// ============================================

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

// ============================================
// GETTERS
// ============================================

const getAllAssignments = async (page = 1) => {
  const result = await query(assignmentQueries.getAllAssignments, [page]);
  return result.rows;
};

const getAssignmentById = async (assignmentId) => {
  const result = await query(assignmentQueries.getAssignmentById, [
    assignmentId,
  ]);
  return result.rows[0];
};

const getAssignmentsByGradeId = async (gradeId, page = 1) => {
  const result = await query(assignmentQueries.getAssignmentsByGradeId, [
    gradeId,
    page,
  ]);
  return result.rows;
};

const getAssignmentsByGroupId = async (groupId, page = 1) => {
  const result = await query(assignmentQueries.getAssignmentsByGroupId, [
    groupId,
    page,
  ]);
  return result.rows;
};

// ============================================
// UPDATE (with validation)
// ============================================

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

  // Check if assignment exists
  const existingResult = await query(assignmentQueries.getAssignmentById, [
    assignmentId,
  ]);
  const existing = existingResult.rows[0];

  if (!existing) {
    return null;
  }

  // Check if there are submissions
  const submissionCountResult = await query(
    assignmentQueries.countSubmissionsByAssignmentId,
    [assignmentId],
  );
  const submissionCount = parseInt(submissionCountResult.rows[0]?.count || 0);

  // If there are submissions, restrict update to title, description, deadline only
  if (submissionCount > 0) {
    const result = await query(assignmentQueries.updateAssignmentRestricted, [
      assignmentId,
      title ?? null,
      description ?? null,
      deadline ?? null,
    ]);
    return result.rows[0];
  }

  // No submissions - full update allowed
  const result = await query(assignmentQueries.updateAssignment, [
    assignmentId,
    title ?? null,
    description ?? null,
    deadline ?? null,
    full_mark ?? null,
    file_path ?? null,
    is_closed !== undefined && is_closed !== null ? parseInt(is_closed) : null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const softDeleteAssignment = async (assignmentId) => {
  const result = await query(assignmentQueries.softDeleteAssignment, [
    assignmentId,
  ]);
  return result.rows[0];
};

const hardDeleteAssignment = async (assignmentId) => {
  const result = await query(assignmentQueries.hardDeleteAssignment, [
    assignmentId,
  ]);
  return result.rows[0];
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByGradeId,
  getAssignmentsByGroupId,
  updateAssignment,
  softDeleteAssignment,
  hardDeleteAssignment,
};
