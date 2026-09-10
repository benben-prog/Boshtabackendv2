/* ============================================
   STUDENT EXAMS QUERIES
   ============================================ */

// Create exam attempt (student starts exam)
const createExamAttempt = `
INSERT INTO student_exams (exam_id, student_id, started_at)
VALUES ($1, $2, NOW() AT TIME ZONE 'Africa/Cairo')
RETURNING *
`;

// Check if student already attempted exam
const checkExistingAttempt = `
SELECT id, submitted_at, started_at
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

// Get exam with questions for student (single query - no N+1)
const getExamWithQuestions = `
SELECT 
  oe.id AS exam_id,
  oe.title,
  oe.description,
  oe.full_mark,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.randomize_questions,
  oe.grade_id,
  oe.group_id,
  se.id AS attempt_id,
  se.score,
  se.started_at,
  se.submitted_at
FROM online_exams oe
JOIN student_exams se ON oe.id = se.exam_id
WHERE se.id = $1 AND se.student_id = $2 AND se.submitted_at IS NULL
`;

// Get all questions with options for an exam (single query)
const getQuestionsWithOptions = `
SELECT 
  q.id AS question_id,
  q.question_text,
  q.type,
  q.file_path,
  q."order",
  o.id AS option_id,
  o.option_text,
  o."order" AS option_order
FROM questions q
LEFT JOIN options o ON q.id = o.question_id
WHERE q.exam_id = $1
ORDER BY q."order" ASC, o."order" ASC
`;

// Get student answers for an exam
const getStudentAnswersForExam = `
SELECT 
  question_id,
  selected_option_id,
  file_path,
  is_correct
FROM student_answers
WHERE exam_id = $1 AND student_id = $2
`;

// Get exam review data (single query)
const getExamReviewData = `
SELECT 
  se.id AS attempt_id,
  se.exam_id,
  se.score,
  se.started_at,
  se.submitted_at,
  oe.title AS exam_title,
  oe.full_mark,
  oe.duration_minutes
FROM student_exams se
JOIN online_exams oe ON se.exam_id = oe.id
WHERE se.id = $1 AND se.student_id = $2 AND se.submitted_at IS NOT NULL
`;

// Get exam questions with options and student answers for review (single query)
const getExamReviewDetails = `
SELECT 
  q.id AS question_id,
  q.question_text,
  q.type,
  q.file_path,
  q."order",
  o.id AS option_id,
  o.option_text,
  o.is_correct AS option_is_correct,
  o."order" AS option_order,
  sa.selected_option_id,
  sa.file_path AS student_file_path,
  sa.is_correct AS student_is_correct
FROM questions q
LEFT JOIN options o ON q.id = o.question_id
LEFT JOIN student_answers sa ON q.id = sa.question_id 
  AND sa.exam_id = $1 
  AND sa.student_id = $2
WHERE q.exam_id = $1
ORDER BY q."order" ASC, o."order" ASC
`;

// Submit exam (with score)
const submitExam = `
UPDATE student_exams
SET 
  score = $3,
  submitted_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND student_id = $2 AND submitted_at IS NULL
RETURNING *
`;

// Auto submit expired exams
const autoSubmitExpiredExams = `
UPDATE student_exams se
SET submitted_at = NOW() AT TIME ZONE 'Africa/Cairo',
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
    SELECT id FROM online_exams 
    WHERE end_at < NOW() AT TIME ZONE 'Africa/Cairo'
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
  NOW() AT TIME ZONE 'Africa/Cairo',
  NOW() AT TIME ZONE 'Africa/Cairo'
FROM online_exams oe
CROSS JOIN students s
WHERE oe.end_at < NOW() AT TIME ZONE 'Africa/Cairo'
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

// Get exam questions for student (without options - for exam page)
const getExamQuestionsForStudent = `
SELECT 
  id,
  exam_id,
  question_text,
  type,
  file_path,
  "order"
FROM questions
WHERE exam_id = $1
ORDER BY "order" ASC
`;

// Get options for multiple questions (single query)
const getOptionsForQuestions = `
SELECT 
  id,
  question_id,
  option_text,
  "order"
FROM options
WHERE question_id = ANY($1)
ORDER BY question_id, "order" ASC
`;

// Get single question
const getQuestionById = `
SELECT 
  id,
  exam_id,
  question_text,
  type,
  file_path,
  "order"
FROM questions
WHERE id = $1
`;

// Get options for single question
const getOptionsByQuestionId = `
SELECT 
  id,
  option_text,
  "order"
FROM options
WHERE question_id = $1
ORDER BY "order" ASC
`;

module.exports = {
  createExamAttempt,
  checkExistingAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  getExamWithQuestions,
  getQuestionsWithOptions,
  getStudentAnswersForExam,
  getExamReviewData,
  getExamReviewDetails,
  submitExam,
  autoSubmitExpiredExams,
  markAbsentStudents,
  getExamQuestionsForStudent,
  getOptionsForQuestions,
  getQuestionById,
  getOptionsByQuestionId,
};
