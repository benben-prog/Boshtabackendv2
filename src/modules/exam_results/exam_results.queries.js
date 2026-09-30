/* ============================================
   EXAM RESULTS QUERIES
   ============================================ */

// Get exam details (for validation)
const getExamById = `
SELECT id, title, total_degree, grade_id, group_id, exam_date
FROM exams
WHERE id = $1 AND deleted = 0
`;

// Get exam result with exam info (single query for update)
const getExamResultWithExam = `
SELECT 
  er.id,
  er.exam_id,
  er.student_id,
  er.degree,
  er.notes,
  e.total_degree,
  e.title AS exam_title,
  e.grade_id AS exam_grade_id,
  e.group_id AS exam_group_id,
  e.exam_date AS exam_date
FROM exam_results er
JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
WHERE er.id = $1
`;

// Create a new exam result
const createExamResult = `
INSERT INTO exam_results (exam_id, student_id, degree, notes, is_absent)
VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
RETURNING *
`;

// Upsert exam result (insert or update if exists)
const upsertExamResult = `
INSERT INTO exam_results (exam_id, student_id, degree, notes, is_absent)
VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
ON CONFLICT (exam_id, student_id)
DO UPDATE SET 
  degree = EXCLUDED.degree,
  notes = EXCLUDED.notes,
  is_absent = EXCLUDED.is_absent,
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
RETURNING *
`;

// Update exam result
const updateExamResult = `
UPDATE exam_results
SET 
  degree = $1,
  notes = $2,
  is_absent = COALESCE($3, is_absent),
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $4
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
  er.is_absent,
  CASE 
    WHEN er.is_absent = TRUE THEN 'absent'
    WHEN (er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100 >= 50 THEN 'passed'
    ELSE 'failed'
  END AS status,
  CASE 
    WHEN er.is_absent = TRUE THEN 0
    ELSE ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2)
  END AS percentage,
  er.notes,
  s.deleted AS student_deleted,
  s.is_active AS student_is_active,
  s.deactivation_reason AS student_deactivation_reason,
  CASE WHEN s.deleted = 1 THEN 'محذوف' WHEN s.is_active = FALSE THEN 'غير مفعل' ELSE 'مفعل' END AS student_status
FROM exam_results er
JOIN students s ON er.student_id = s.id
JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
WHERE er.exam_id = $1
ORDER BY er.is_absent ASC, s.full_name ASC
`;

// Get exam result statistics
const getExamResultStats = `
SELECT 
  COUNT(er.id) AS students_count,
  COUNT(CASE WHEN er.is_absent = TRUE THEN 1 END) AS absent_count,
  COUNT(CASE WHEN er.is_absent = FALSE OR er.is_absent IS NULL THEN 1 END) AS present_count,
  ROUND(AVG(CASE WHEN er.is_absent = FALSE OR er.is_absent IS NULL THEN er.degree END)::numeric, 2) AS average_degree,
  MAX(CASE WHEN er.is_absent = FALSE OR er.is_absent IS NULL THEN er.degree END) AS highest_degree,
  MIN(CASE WHEN er.is_absent = FALSE OR er.is_absent IS NULL THEN er.degree END) AS lowest_degree,
  COUNT(CASE WHEN (er.is_absent = FALSE OR er.is_absent IS NULL) AND (er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100 >= 50 THEN 1 END) AS passed_count,
  COUNT(CASE WHEN (er.is_absent = FALSE OR er.is_absent IS NULL) AND (er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100 < 50 THEN 1 END) AS failed_count
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
JOIN students s ON er.student_id = s.id
WHERE e.group_id = $1 AND e.deleted = 0
GROUP BY e.id, e.title, e.exam_date, e.total_degree
ORDER BY e.exam_date DESC
`;

// ============================================
// BULK OPERATIONS QUERIES
// ============================================

// Get students by barcodes (single query)
const getStudentsByBarcodes = `
SELECT id, barcode, full_name, grade_id, group_id, phone, parent_phone, parent_token
FROM students
WHERE barcode = ANY($1)
`;

// Get students by names (single query)
const getStudentsByNames = `
SELECT id, barcode, full_name, grade_id, group_id, phone, parent_phone, parent_token
FROM students
WHERE full_name = ANY($1)
`;

// Get students by IDs (for batch processing)
const getStudentsByIds = `
SELECT id, barcode, full_name, grade_id, group_id, phone, parent_phone, parent_token
FROM students
WHERE id = ANY($1)
`;

// Bulk upsert exam results (single query)
const bulkUpsertExamResults = `
INSERT INTO exam_results (exam_id, student_id, degree, notes, is_absent)
SELECT unnest($1::int[]), unnest($2::int[]), unnest($3::numeric[]), unnest($4::text[]), unnest($5::boolean[])
ON CONFLICT (exam_id, student_id)
DO UPDATE SET
  degree = EXCLUDED.degree,
  notes = EXCLUDED.notes,
  is_absent = EXCLUDED.is_absent,
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
RETURNING id, exam_id, student_id, degree, notes, is_absent
`;

module.exports = {
  getExamById,
  getExamResultWithExam,
  createExamResult,
  upsertExamResult,
  updateExamResult,
  deleteExamResult,
  getExamResults,
  getExamResultStats,
  getGradeExamResultsStats,
  getGroupExamResultsStats,
  // Bulk operations
  getStudentsByBarcodes,
  getStudentsByNames,
  getStudentsByIds,
  bulkUpsertExamResults,
};
