/* ============================================
   ASSIGNMENTS QUERIES
   ============================================ */

// Create assignment
const createAssignment = `
INSERT INTO assignments (title, description, grade_id, group_id, file_path, full_mark, deadline, created_by, is_closed)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *
`;

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

// Update assignment
const updateAssignment = `
UPDATE assignments
SET 
  title = $2,
  description = $3,
  grade_id = $4,
  group_id = $5,
  file_path = $6,
  full_mark = $7,
  deadline = $8,
  is_closed = $9,
  updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Soft delete assignment
const softDeleteAssignment = `
UPDATE assignments
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id
`;

// Hard delete assignment
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
  updateAssignment,
  softDeleteAssignment,
  hardDeleteAssignment,
};
