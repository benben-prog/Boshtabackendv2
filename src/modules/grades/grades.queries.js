/* ============================================
   GRADES QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createGrade = `
INSERT INTO grades (name, monthly_price)
VALUES ($1, $2)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

// Get all grades (with optional search)
const getAllGrades = `
SELECT 
  id,
  name,
  monthly_price,
  created_at,
  updated_at
FROM grades
WHERE deleted = 0
  AND ($1 = '' OR name ILIKE $1)
ORDER BY name ASC
`;

// Get a single grade by its ID
const getGradeById = `
SELECT 
  id,
  name,
  monthly_price,
  created_at,
  updated_at
FROM grades
WHERE id = $1 AND deleted = 0
`;

// Find a grade by its name
const findGradeByName = `
SELECT 
  id,
  name,
  monthly_price,
  created_at,
  updated_at
FROM grades
WHERE name = $1 AND deleted = 0
`;

// Get all grades with their groups count
const getGradesWithGroupsCount = `
SELECT 
  g.id,
  g.name,
  g.monthly_price,
  COUNT(gr.id) AS groups_count
FROM grades g
LEFT JOIN groups gr ON g.id = gr.grade_id AND gr.deleted = 0
WHERE g.deleted = 0
GROUP BY g.id, g.name, g.monthly_price
ORDER BY g.name ASC
`;

// Get all grades with their students count
const getGradesWithStudentsCount = `
SELECT 
  g.id,
  g.name,
  g.monthly_price,
  COUNT(s.id) AS students_count
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id AND s.deleted = 0
WHERE g.deleted = 0
GROUP BY g.id, g.name, g.monthly_price
ORDER BY g.name ASC
`;

// ============================================
// GET GRADE DETAILS (FULL)
// ============================================

// Get grade basic stats
const getGradeBasicStats = `
SELECT 
  g.id,
  g.name,
  g.monthly_price,
  g.created_at,
  g.updated_at,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 0 THEN s.id END) AS active_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students,
  COUNT(DISTINCT gr.id) AS total_groups
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id
LEFT JOIN groups gr ON g.id = gr.grade_id AND gr.deleted = 0
WHERE g.id = $1 AND g.deleted = 0
GROUP BY g.id, g.name, g.monthly_price, g.created_at, g.updated_at
`;

// Get groups by grade ID (with students count)
const getGroupsByGradeIdWithCount = `
SELECT 
  gr.id,
  gr.name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  COUNT(s.id) AS students_count
FROM groups gr
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
WHERE gr.grade_id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.days, gr.start_time, gr.end_time, gr.room
ORDER BY gr.name ASC
`;

// ============================================
// UPDATE
// ============================================

const updateGrade = `
UPDATE grades 
SET 
  name = COALESCE($1, name), 
  monthly_price = COALESCE($2, monthly_price), 
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $3 AND deleted = 0
RETURNING *
`;

// ============================================
// DELETE
// ============================================

const softDeleteGrade = `
UPDATE grades 
SET deleted = 1, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

const hardDeleteGrade = `
DELETE FROM grades 
WHERE id = $1
RETURNING *
`;

// ============================================
// STATISTICS
// ============================================

const getGradeStats = `
SELECT 
  g.id,
  g.name,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 0 THEN s.id END) AS active_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id
WHERE g.id = $1 AND g.deleted = 0
GROUP BY g.id, g.name
`;

const getAllGradesStats = `
SELECT 
  g.id,
  g.name,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 0 THEN s.id END) AS active_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id
WHERE g.deleted = 0
GROUP BY g.id, g.name
ORDER BY g.name ASC
`;

module.exports = {
  createGrade,
  getAllGrades,
  getGradeById,
  findGradeByName,
  getGradesWithGroupsCount,
  getGradesWithStudentsCount,
  getGradeBasicStats,
  getGroupsByGradeIdWithCount,
  updateGrade,
  softDeleteGrade,
  hardDeleteGrade,
  getGradeStats,
  getAllGradesStats,
};
