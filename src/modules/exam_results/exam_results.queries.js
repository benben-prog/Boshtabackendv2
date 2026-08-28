/* ============================================
   EXAM RESULTS QUERIES
   ============================================ */

// Create a new exam result
const createExamResult = `
INSERT INTO exam_results (exam_id, student_id, degree, notes)
VALUES ($1, $2, $3, $4)
RETURNING *
`;

// Upsert exam result (insert or update if exists)
const upsertExamResult = `
INSERT INTO exam_results (exam_id, student_id, degree, notes)
VALUES ($1, $2, $3, $4)
ON CONFLICT (exam_id, student_id)
DO UPDATE SET 
  degree = EXCLUDED.degree,
  notes = EXCLUDED.notes
RETURNING *
`;

// Update exam result
const updateExamResult = `
UPDATE exam_results
SET 
  degree = $1,
  notes = $2,
  updated_at = NOW()
WHERE id = $3
RETURNING *
`;

// Delete exam result
const deleteExamResult = `
DELETE FROM exam_results
WHERE id = $1
RETURNING *
`;

// Get all results for an exam
const getExamResults = `
SELECT 
  er.id,
  er.student_id,
  s.full_name,
  s.barcode,
  er.degree,
  e.total_degree,
  ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2) AS percentage,
  er.notes
FROM exam_results er
JOIN students s ON er.student_id = s.id AND s.deleted = 0
JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
WHERE er.exam_id = $1
ORDER BY s.full_name ASC
`;

// Get exam result statistics
const getExamResultStats = `
SELECT 
  COUNT(er.id) AS students_count,
  ROUND(AVG(er.degree)::numeric, 2) AS average_degree,
  MAX(er.degree) AS highest_degree,
  MIN(er.degree) AS lowest_degree,
  COUNT(CASE WHEN (er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100 >= 50 THEN 1 END) AS passed_count,
  COUNT(CASE WHEN (er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100 < 50 THEN 1 END) AS failed_count
FROM exam_results er
JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
WHERE er.exam_id = $1
`;

// Get grade exam results statistics
const getGradeExamResultsStats = `
SELECT 
  e.id AS exam_id,
  e.title AS exam_title,
  e.exam_date,
  e.total_degree,
  COUNT(er.id) AS students_count,
  ROUND(AVG(er.degree)::numeric, 2) AS average_degree,
  MAX(er.degree) AS highest_degree,
  MIN(er.degree) AS lowest_degree
FROM exams e
LEFT JOIN exam_results er ON e.id = er.exam_id
WHERE e.grade_id = $1 AND e.deleted = 0
GROUP BY e.id, e.title, e.exam_date, e.total_degree
ORDER BY e.exam_date DESC
`;

// Get group exam results statistics
const getGroupExamResultsStats = `
SELECT 
  e.id AS exam_id,
  e.title AS exam_title,
  e.exam_date,
  e.total_degree,
  COUNT(er.id) AS students_count,
  ROUND(AVG(er.degree)::numeric, 2) AS average_degree,
  MAX(er.degree) AS highest_degree,
  MIN(er.degree) AS lowest_degree
FROM exams e
JOIN exam_results er ON e.id = er.exam_id
JOIN students s ON er.student_id = s.id AND s.deleted = 0
WHERE e.group_id = $1 AND e.deleted = 0
GROUP BY e.id, e.title, e.exam_date, e.total_degree
ORDER BY e.exam_date DESC
`;

module.exports = {
  createExamResult,
  upsertExamResult,
  updateExamResult,
  deleteExamResult,
  getExamResults,
  getExamResultStats,
  getGradeExamResultsStats,
  getGroupExamResultsStats,
};
