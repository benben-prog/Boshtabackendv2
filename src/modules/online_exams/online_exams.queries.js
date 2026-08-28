/* ============================================
   ONLINE EXAMS QUERIES
   ============================================ */

// Create online exam
const createOnlineExam = `
INSERT INTO online_exams (title, description, grade_id, group_id, duration_minutes, start_at, end_at, full_mark, randomize_questions, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *
`;

// Get all online exams - 20 per page
const getAllOnlineExams = `
SELECT 
  oe.id,
  oe.title,
  oe.description,
  oe.grade_id,
  g.name AS grade_name,
  oe.group_id,
  gr.name AS group_name,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  oe.randomize_questions,
  oe.created_by,
  oe.created_at,
  oe.updated_at
FROM online_exams oe
LEFT JOIN grades g ON oe.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON oe.group_id = gr.id AND gr.deleted = 0
WHERE oe.deleted = 0
ORDER BY oe.created_at DESC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

// Get online exam by ID
const getOnlineExamById = `
SELECT 
  oe.id,
  oe.title,
  oe.description,
  oe.grade_id,
  g.name AS grade_name,
  oe.group_id,
  gr.name AS group_name,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  oe.randomize_questions,
  oe.created_by,
  oe.created_at,
  oe.updated_at
FROM online_exams oe
LEFT JOIN grades g ON oe.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON oe.group_id = gr.id AND gr.deleted = 0
WHERE oe.id = $1 AND oe.deleted = 0
`;

// Get online exams by grade - 20 per page
const getOnlineExamsByGradeId = `
SELECT 
  oe.id,
  oe.title,
  oe.description,
  oe.grade_id,
  g.name AS grade_name,
  oe.group_id,
  gr.name AS group_name,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  oe.randomize_questions,
  oe.created_at,
  oe.updated_at
FROM online_exams oe
LEFT JOIN grades g ON oe.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON oe.group_id = gr.id AND gr.deleted = 0
WHERE oe.grade_id = $1 AND oe.deleted = 0
ORDER BY oe.created_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get online exams by group - 20 per page
const getOnlineExamsByGroupId = `
SELECT 
  oe.id,
  oe.title,
  oe.description,
  oe.grade_id,
  g.name AS grade_name,
  oe.group_id,
  gr.name AS group_name,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  oe.randomize_questions,
  oe.created_at,
  oe.updated_at
FROM online_exams oe
LEFT JOIN grades g ON oe.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON oe.group_id = gr.id AND gr.deleted = 0
WHERE oe.group_id = $1 AND oe.deleted = 0
ORDER BY oe.created_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get available online exams
const getAvailableOnlineExams = `
SELECT 
  oe.id,
  oe.title,
  oe.description,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  oe.randomize_questions,
  CASE 
    WHEN oe.start_at > NOW() THEN 'upcoming'
    WHEN oe.end_at < NOW() THEN 'expired'
    ELSE 'available'
  END AS exam_status
FROM online_exams oe
WHERE oe.deleted = 0
  AND oe.end_at > NOW()
ORDER BY oe.start_at ASC
`;

// Get expired online exams
const getExpiredOnlineExams = `
SELECT 
  oe.id,
  oe.title,
  oe.description,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  COUNT(se.id) AS attempts_count
FROM online_exams oe
LEFT JOIN student_exams se ON oe.id = se.exam_id AND se.submitted_at IS NOT NULL
WHERE oe.deleted = 0
  AND oe.end_at < NOW()
GROUP BY oe.id, oe.title, oe.description, oe.duration_minutes, oe.start_at, oe.end_at, oe.full_mark
ORDER BY oe.end_at DESC
`;

// Get online exam stats
const getOnlineExamStats = `
SELECT 
  oe.id,
  oe.title,
  oe.full_mark,
  oe.start_at,
  oe.end_at,
  (SELECT COUNT(*) FROM questions q WHERE q.exam_id = oe.id) AS questions_count,
  (SELECT COUNT(*) FROM students WHERE grade_id = oe.grade_id AND deleted = 0) AS total_students,
  COUNT(DISTINCT se.student_id) AS students_attempted,
  (SELECT COUNT(*) FROM students WHERE grade_id = oe.grade_id AND deleted = 0) - COUNT(DISTINCT se.student_id) AS students_not_attempted,
  ROUND(AVG(se.score)::numeric, 2) AS average_score,
  MAX(se.score) AS highest_score,
  MIN(se.score) AS lowest_score,
  COUNT(CASE WHEN se.score >= (oe.full_mark * 0.5) THEN 1 END) AS passed_count,
  COUNT(CASE WHEN se.score < (oe.full_mark * 0.5) THEN 1 END) AS failed_count
FROM online_exams oe
LEFT JOIN student_exams se ON oe.id = se.exam_id AND se.submitted_at IS NOT NULL
WHERE oe.id = $1 AND oe.deleted = 0
GROUP BY oe.id, oe.title, oe.full_mark, oe.start_at, oe.end_at, oe.grade_id
`;

// Get grade online exam stats
const getGradeOnlineExamStats = `
SELECT 
  g.id,
  g.name,
  COUNT(DISTINCT oe.id) AS total_exams,
  COUNT(DISTINCT se.student_id) AS total_students_attempted,
  ROUND(AVG(se.score)::numeric, 2) AS overall_average
FROM grades g
LEFT JOIN online_exams oe ON g.id = oe.grade_id AND oe.deleted = 0
LEFT JOIN student_exams se ON oe.id = se.exam_id AND se.submitted_at IS NOT NULL
WHERE g.id = $1 AND g.deleted = 0
GROUP BY g.id, g.name
`;

// Update online exam
const updateOnlineExam = `
UPDATE online_exams
SET 
  title = $2,
  description = $3,
  grade_id = $4,
  group_id = $5,
  duration_minutes = $6,
  start_at = $7,
  end_at = $8,
  full_mark = $9,
  randomize_questions = $10,
  updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Soft delete online exam
const softDeleteOnlineExam = `
UPDATE online_exams 
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id
`;

// Hard delete online exam
const hardDeleteOnlineExam = `
DELETE FROM online_exams
WHERE id = $1
RETURNING id
`;

module.exports = {
  createOnlineExam,
  getAllOnlineExams,
  getOnlineExamById,
  getOnlineExamsByGradeId,
  getOnlineExamsByGroupId,
  getAvailableOnlineExams,
  getExpiredOnlineExams,
  getOnlineExamStats,
  getGradeOnlineExamStats,
  updateOnlineExam,
  softDeleteOnlineExam,
  hardDeleteOnlineExam,
};
