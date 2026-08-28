/* ============================================
   EXAMS QUERIES
   ============================================ */

// Create a new exam
const createExam = `
INSERT INTO exams (title, grade_id, group_id, total_degree, exam_date, notes)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

// Get all exams - 20 per page
const getAllExams = `
SELECT 
  e.id,
  e.title,
  e.grade_id,
  g.name AS grade_name,
  e.group_id,
  gr.name AS group_name,
  e.total_degree,
  e.exam_date,
  e.notes,
  e.created_at,
  e.updated_at
FROM exams e
LEFT JOIN grades g ON e.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON e.group_id = gr.id AND gr.deleted = 0
WHERE e.deleted = 0
ORDER BY e.exam_date DESC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

// Get exam by ID
const getExamById = `
SELECT 
  e.id,
  e.title,
  e.grade_id,
  g.name AS grade_name,
  e.group_id,
  gr.name AS group_name,
  e.total_degree,
  e.exam_date,
  e.notes,
  e.created_at,
  e.updated_at
FROM exams e
LEFT JOIN grades g ON e.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON e.group_id = gr.id AND gr.deleted = 0
WHERE e.id = $1 AND e.deleted = 0
`;

// Get exams by grade - 20 per page
const getExamsByGradeId = `
SELECT 
  e.id,
  e.title,
  e.grade_id,
  g.name AS grade_name,
  e.group_id,
  gr.name AS group_name,
  e.total_degree,
  e.exam_date,
  e.notes,
  e.created_at,
  e.updated_at
FROM exams e
LEFT JOIN grades g ON e.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON e.group_id = gr.id AND gr.deleted = 0
WHERE e.grade_id = $1 AND e.deleted = 0
ORDER BY e.exam_date DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get exams by group - 20 per page
const getExamsByGroupId = `
SELECT 
  e.id,
  e.title,
  e.grade_id,
  g.name AS grade_name,
  e.group_id,
  gr.name AS group_name,
  e.total_degree,
  e.exam_date,
  e.notes,
  e.created_at,
  e.updated_at
FROM exams e
LEFT JOIN grades g ON e.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON e.group_id = gr.id AND gr.deleted = 0
WHERE e.group_id = $1 AND e.deleted = 0
ORDER BY e.exam_date DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Update an exam
const updateExam = `
UPDATE exams
SET 
  title = $1,
  grade_id = $2,
  group_id = $3,
  total_degree = $4,
  exam_date = $5,
  notes = $6,
  updated_at = NOW()
WHERE id = $7 AND deleted = 0
RETURNING *
`;

// Soft delete an exam
const softDeleteExam = `
UPDATE exams
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Hard delete an exam
const hardDeleteExam = `
DELETE FROM exams
WHERE id = $1
RETURNING *
`;

// Get exam statistics
const getExamStats = `
SELECT 
  e.id,
  e.title,
  e.total_degree,
  COUNT(er.id) AS students_count,
  ROUND(AVG(er.degree)::numeric, 2) AS average_degree,
  MAX(er.degree) AS highest_degree,
  MIN(er.degree) AS lowest_degree
FROM exams e
LEFT JOIN exam_results er ON e.id = er.exam_id
WHERE e.id = $1 AND e.deleted = 0
GROUP BY e.id, e.title, e.total_degree
`;

// Get grade exam statistics
const getGradeExamStats = `
SELECT 
  g.id,
  g.name,
  COUNT(DISTINCT e.id) AS total_exams,
  ROUND(AVG(er.degree)::numeric, 2) AS overall_average,
  MAX(er.degree) AS highest_degree,
  MIN(er.degree) AS lowest_degree
FROM grades g
LEFT JOIN exams e ON g.id = e.grade_id AND e.deleted = 0
LEFT JOIN exam_results er ON e.id = er.exam_id
WHERE g.id = $1 AND g.deleted = 0
GROUP BY g.id, g.name
`;

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  getExamsByGradeId,
  getExamsByGroupId,
  updateExam,
  softDeleteExam,
  hardDeleteExam,
  getExamStats,
  getGradeExamStats,
};
