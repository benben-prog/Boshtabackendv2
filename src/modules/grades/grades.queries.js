// Create a new grade
const createGrade = `
INSERT INTO grades (name, monthly_price)
VALUES ($1, $2)
RETURNING *
`;

// Get all grades that are not deleted
const getAllGrades = `
SELECT 
  id,
  name,
  monthly_price,
  created_at,
  updated_at
FROM grades
WHERE deleted = 0
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

// Update a grade's name and monthly price
const updateGrade = `
UPDATE grades 
SET name = $1, monthly_price = $2, updated_at = NOW()
WHERE id = $3 AND deleted = 0
RETURNING *
`;

// Soft delete a grade (set deleted = 1)
const softDeleteGrade = `
UPDATE grades 
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Hard delete a grade permanently
const hardDeleteGrade = `
DELETE FROM grades 
WHERE id = $1
RETURNING *
`;

// Get statistics for a single grade (total, active, deleted students)
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

// Get statistics for all grades (total, active, deleted students)
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

module.exports = {
  createGrade,
  getAllGrades,
  getGradeById,
  findGradeByName,
  updateGrade,
  softDeleteGrade,
  hardDeleteGrade,
  getGradeStats,
  getAllGradesStats,
  getGradesWithGroupsCount,
  getGradesWithStudentsCount,
};