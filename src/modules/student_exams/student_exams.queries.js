/* ============================================
   STUDENT EXAMS QUERIES
   ============================================ */

// Create exam attempt (student starts exam)
const createExamAttempt = `
INSERT INTO student_exams (exam_id, student_id, started_at)
VALUES ($1, $2, NOW())
RETURNING *
`;

// Check if student already attempted exam
const checkExistingAttempt = `
SELECT id, submitted_at
FROM student_exams
WHERE exam_id = $1 AND student_id = $2
`;

// Get student exams by exam ID - 20 per page
const getStudentExamsByExamId = `
SELECT 
  se.id,
  se.student_id,
  s.full_name,
  s.barcode,
  se.score,
  se.started_at,
  se.submitted_at
FROM student_exams se
JOIN students s ON se.student_id = s.id AND s.deleted = 0
WHERE se.exam_id = $1
ORDER BY se.score DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get exam attempt stats
const getExamAttemptStats = `
SELECT 
  oe.id,
  oe.title,
  oe.full_mark,
  oe.start_at,
  oe.end_at,
  (SELECT COUNT(*) FROM students WHERE grade_id = oe.grade_id AND deleted = 0) AS total_students,
  COUNT(se.id) AS total_attempts,
  COUNT(DISTINCT se.student_id) AS students_attempted,
  (SELECT COUNT(*) FROM students WHERE grade_id = oe.grade_id AND deleted = 0) - COUNT(DISTINCT se.student_id) AS students_not_attempted,
  ROUND(AVG(se.score)::numeric, 2) AS average_score,
  MAX(se.score) AS highest_score,
  MIN(se.score) AS lowest_score,
  COUNT(CASE WHEN se.score >= (oe.full_mark * 0.5) THEN 1 END) AS passed_count,
  COUNT(CASE WHEN se.score < (oe.full_mark * 0.5) THEN 1 END) AS failed_count
FROM online_exams oe
LEFT JOIN student_exams se ON oe.id = se.exam_id
WHERE oe.id = $1 AND oe.deleted = 0
GROUP BY oe.id, oe.title, oe.full_mark, oe.start_at, oe.end_at, oe.grade_id
`;

// Get grade exam attempts stats
const getGradeExamAttemptsStats = `
SELECT 
  oe.id,
  oe.title,
  oe.full_mark,
  oe.start_at,
  oe.end_at,
  COUNT(se.id) AS total_attempts,
  COUNT(DISTINCT se.student_id) AS students_attempted,
  ROUND(AVG(se.score)::numeric, 2) AS average_score,
  MAX(se.score) AS highest_score,
  MIN(se.score) AS lowest_score
FROM online_exams oe
LEFT JOIN student_exams se ON oe.id = se.exam_id
WHERE oe.grade_id = $1 AND oe.deleted = 0
GROUP BY oe.id, oe.title, oe.full_mark, oe.start_at, oe.end_at
ORDER BY oe.title ASC
`;

// Get group exam attempts stats
const getGroupExamAttemptsStats = `
SELECT 
  oe.id,
  oe.title,
  oe.full_mark,
  oe.start_at,
  oe.end_at,
  COUNT(se.id) AS total_attempts,
  COUNT(DISTINCT se.student_id) AS students_attempted,
  ROUND(AVG(se.score)::numeric, 2) AS average_score,
  MAX(se.score) AS highest_score,
  MIN(se.score) AS lowest_score
FROM online_exams oe
LEFT JOIN student_exams se ON oe.id = se.exam_id
WHERE oe.group_id = $1 AND oe.deleted = 0
GROUP BY oe.id, oe.title, oe.full_mark, oe.start_at, oe.end_at
ORDER BY oe.title ASC
`;

// Submit exam (manual or auto)
const submitExam = `
UPDATE student_exams
SET 
  score = $3,
  submitted_at = NOW()
WHERE id = $1 AND student_id = $2 AND submitted_at IS NULL
RETURNING *
`;

// Auto submit expired exams
const autoSubmitExpiredExams = `
UPDATE student_exams se
SET submitted_at = NOW(),
    score = COALESCE(
      (SELECT 
        ROUND(
          (COUNT(CASE WHEN sa.is_correct = 1 THEN 1 END)::numeric / 
          NULLIF(COUNT(sa.id), 0)) * oe.full_mark, 2
        )
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      JOIN online_exams oe ON sa.exam_id = oe.id
      WHERE sa.exam_id = se.exam_id 
        AND sa.student_id = se.student_id
        AND q.type IN ('mcq', 'true_false')
        AND sa.is_correct IS NOT NULL
      ),
      0
    )
WHERE se.submitted_at IS NULL
  AND se.exam_id IN (
    SELECT id FROM online_exams WHERE end_at < NOW()
  )
RETURNING se.id, se.student_id, se.exam_id
`;

// Mark absent students (who didn't enter exam)
const markAbsentStudents = `
INSERT INTO student_exams (exam_id, student_id, score, started_at, submitted_at)
SELECT 
  oe.id,
  s.id,
  0,
  NOW(),
  NOW()
FROM online_exams oe
CROSS JOIN students s
WHERE oe.end_at < NOW()
  AND oe.deleted = 0
  AND s.deleted = 0
  AND (
    (oe.group_id IS NULL AND s.grade_id = oe.grade_id)
    OR
    (oe.group_id IS NOT NULL AND s.group_id = oe.group_id)
  )
  AND NOT EXISTS (
    SELECT 1 FROM student_exams se 
    WHERE se.exam_id = oe.id AND se.student_id = s.id
  )
RETURNING id, student_id, exam_id
`;

module.exports = {
  createExamAttempt,
  checkExistingAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  submitExam,
  autoSubmitExpiredExams,
  markAbsentStudents,
};
