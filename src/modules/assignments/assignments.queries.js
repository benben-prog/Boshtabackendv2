/* ============================================
   ASSIGNMENTS QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createAssignment = `
INSERT INTO assignments (title, description, grade_id, group_id, file_path, full_mark, deadline, created_by, is_closed)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

// Get all assignments - 20 per page
const getAllAssignments = `
SELECT 
  a.id,
  a.title,
  a.description,
  a.grade_id,
  g.name AS grade_name,
  a.group_id,
  gr.name AS group_name,
  a.file_path,
  a.full_mark,
  a.deadline,
  a.is_closed,
  a.created_by,
  a.created_at,
  a.updated_at
FROM assignments a
LEFT JOIN grades g ON a.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON a.group_id = gr.id AND gr.deleted = 0
WHERE a.deleted = 0
ORDER BY a.deadline DESC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

// Get assignment by ID
const getAssignmentById = `
SELECT 
  a.id,
  a.title,
  a.description,
  a.grade_id,
  g.name AS grade_name,
  a.group_id,
  gr.name AS group_name,
  a.file_path,
  a.full_mark,
  a.deadline,
  a.is_closed,
  a.created_by,
  a.created_at,
  a.updated_at
FROM assignments a
LEFT JOIN grades g ON a.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON a.group_id = gr.id AND gr.deleted = 0
WHERE a.id = $1 AND a.deleted = 0
`;

// Get assignments by grade - 20 per page
const getAssignmentsByGradeId = `
SELECT 
  a.id,
  a.title,
  a.description,
  a.grade_id,
  g.name AS grade_name,
  a.group_id,
  gr.name AS group_name,
  a.file_path,
  a.full_mark,
  a.deadline,
  a.is_closed,
  a.created_at,
  a.updated_at
FROM assignments a
LEFT JOIN grades g ON a.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON a.group_id = gr.id AND gr.deleted = 0
WHERE a.grade_id = $1 AND a.deleted = 0
ORDER BY a.deadline DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get assignments by group - 20 per page
const getAssignmentsByGroupId = `
SELECT 
  a.id,
  a.title,
  a.description,
  a.grade_id,
  g.name AS grade_name,
  a.group_id,
  gr.name AS group_name,
  a.file_path,
  a.full_mark,
  a.deadline,
  a.is_closed,
  a.created_at,
  a.updated_at
FROM assignments a
LEFT JOIN grades g ON a.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON a.group_id = gr.id AND gr.deleted = 0
WHERE a.group_id = $1 AND a.deleted = 0
ORDER BY a.deadline DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Count submissions for an assignment
const countSubmissionsByAssignmentId = `
SELECT COUNT(*) AS count
FROM assignment_submissions
WHERE assignment_id = $1
`;

// ============================================
// UPDATE
// ============================================

// Update assignment (full update)
const updateAssignment = `
UPDATE assignments
SET 
  title = COALESCE($2, title),
  description = COALESCE($3, description),
  deadline = COALESCE($4, deadline),
  full_mark = COALESCE($5, full_mark),
  file_path = COALESCE($6, file_path),
  is_closed = COALESCE($7, is_closed),
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Update assignment (restricted - only title, description, deadline)
const updateAssignmentRestricted = `
UPDATE assignments
SET 
  title = COALESCE($2, title),
  description = COALESCE($3, description),
  deadline = COALESCE($4, deadline),
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// ============================================
// DELETE
// ============================================

const softDeleteAssignment = `
UPDATE assignments
SET deleted = 1, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING id
`;

const hardDeleteAssignment = `
DELETE FROM assignments
WHERE id = $1
RETURNING id
`;

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByGradeId,
  getAssignmentsByGroupId,
  countSubmissionsByAssignmentId,
  updateAssignment,
  updateAssignmentRestricted,
  softDeleteAssignment,
  hardDeleteAssignment,
};
