/* ============================================
   STUDENT ANSWERS QUERIES
   ============================================ */

// Insert MCQ/True-False answer
const insertAnswer = `
INSERT INTO student_answers (exam_id, student_id, question_id, selected_option_id, is_correct)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (exam_id, student_id, question_id)
DO UPDATE SET
  selected_option_id = EXCLUDED.selected_option_id,
  is_correct = EXCLUDED.is_correct,
  submitted_at = NOW() AT TIME ZONE 'Africa/Cairo'
RETURNING *
`;

// Insert essay answer with file
const insertEssayAnswer = `
INSERT INTO student_answers (exam_id, student_id, question_id, file_path, is_correct)
VALUES ($1, $2, $3, $4, NULL)
ON CONFLICT (exam_id, student_id, question_id)
DO UPDATE SET
  file_path = EXCLUDED.file_path,
  submitted_at = NOW() AT TIME ZONE 'Africa/Cairo'
RETURNING *
`;

// Update answer
const updateAnswer = `
UPDATE student_answers
SET 
  selected_option_id = $2,
  is_correct = $3,
  submitted_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1
RETURNING *
`;

// Update essay answer file
const updateEssayAnswer = `
UPDATE student_answers
SET 
  file_path = $2,
  submitted_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1
RETURNING *
`;

// Delete answer
const deleteAnswer = `
DELETE FROM student_answers
WHERE id = $1
RETURNING id
`;

// Check if answer exists
const checkExistingAnswer = `
SELECT id, question_id
FROM student_answers
WHERE exam_id = $1 AND student_id = $2 AND question_id = $3
`;

// Get question with exam info (for validation)
const getQuestionWithExam = `
SELECT 
  q.id AS question_id,
  q.type AS question_type,
  q.exam_id,
  oe.id AS online_exam_id,
  oe.end_at AS exam_end_at,
  oe.duration_minutes,
  oe.grade_id AS exam_grade_id,
  oe.group_id AS exam_group_id
FROM questions q
JOIN online_exams oe ON q.exam_id = oe.id
WHERE q.id = $1 AND q.exam_id = $2 AND oe.deleted = 0
`;

// Get option with correctness
const getOptionWithCorrectness = `
SELECT id, is_correct
FROM options
WHERE id = $1 AND question_id = $2
`;

// Get active attempt
const getActiveAttempt = `
SELECT id, started_at, submitted_at
FROM student_exams
WHERE exam_id = $1 AND student_id = $2 AND submitted_at IS NULL
`;

// Get question answer stats
const getQuestionAnswerStats = `
SELECT 
  q.id AS question_id,
  q.question_text,
  q.type,
  COUNT(sa.id) AS total_answers,
  COUNT(CASE WHEN sa.is_correct = 1 THEN 1 END) AS correct_count,
  COUNT(CASE WHEN sa.is_correct = 0 THEN 1 END) AS incorrect_count,
  ROUND(
    (COUNT(CASE WHEN sa.is_correct = 1 THEN 1 END)::numeric / 
    NULLIF(COUNT(sa.id), 0)) * 100, 2
  ) AS correct_percentage
FROM questions q
LEFT JOIN student_answers sa ON q.id = sa.question_id
WHERE q.id = $1
GROUP BY q.id, q.question_text, q.type
`;

// Get most selected options
const getMostSelectedOptions = `
SELECT 
  o.id AS option_id,
  o.option_text,
  o.is_correct,
  COUNT(sa.id) AS selected_count
FROM options o
LEFT JOIN student_answers sa ON o.id = sa.selected_option_id
WHERE o.question_id = $1
GROUP BY o.id, o.option_text, o.is_correct, o."order"
ORDER BY o."order" ASC
`;

// Get student answers for an exam
const getStudentAnswersByExam = `
SELECT 
  sa.id,
  sa.question_id,
  q.question_text,
  q.type AS question_type,
  sa.selected_option_id,
  o.option_text AS selected_option,
  sa.file_path,
  sa.is_correct,
  sa.submitted_at
FROM student_answers sa
JOIN questions q ON sa.question_id = q.id
LEFT JOIN options o ON sa.selected_option_id = o.id
WHERE sa.exam_id = $1 AND sa.student_id = $2
ORDER BY q."order" ASC
`;

// Grade essay answer
const gradeEssayAnswer = `
UPDATE student_answers
SET is_correct = $1
WHERE id = $2 AND is_correct IS NULL
RETURNING *
`;

// Get essay answers for grading
const getEssayAnswersForGrading = `
SELECT 
  sa.id AS answer_id,
  sa.exam_id,
  oe.title AS exam_title,
  sa.student_id,
  s.full_name AS student_name,
  s.barcode,
  sa.question_id,
  q.question_text,
  sa.file_path,
  sa.is_correct,
  sa.submitted_at
FROM student_answers sa
JOIN questions q ON sa.question_id = q.id
JOIN online_exams oe ON sa.exam_id = oe.id
JOIN students s ON sa.student_id = s.id
WHERE q.type = 'essay'
  AND sa.file_path IS NOT NULL
  AND sa.is_correct IS NULL
ORDER BY sa.submitted_at ASC
`;

// Get essay answers by exam
const getEssayAnswersByExam = `
SELECT 
  sa.id AS answer_id,
  sa.exam_id,
  sa.student_id,
  s.full_name AS student_name,
  s.barcode,
  sa.question_id,
  q.question_text,
  sa.file_path,
  sa.is_correct,
  sa.submitted_at
FROM student_answers sa
JOIN questions q ON sa.question_id = q.id
JOIN students s ON sa.student_id = s.id
WHERE sa.exam_id = $1
  AND q.type = 'essay'
  AND sa.file_path IS NOT NULL
ORDER BY sa.submitted_at ASC
`;

// Get answer file path (for download)
const getAnswerFilePath = `
SELECT file_path
FROM student_answers
WHERE id = $1
`;

module.exports = {
  insertAnswer,
  insertEssayAnswer,
  updateAnswer,
  updateEssayAnswer,
  deleteAnswer,
  checkExistingAnswer,
  getQuestionWithExam,
  getOptionWithCorrectness,
  getActiveAttempt,
  getQuestionAnswerStats,
  getMostSelectedOptions,
  getStudentAnswersByExam,
  gradeEssayAnswer,
  getEssayAnswersForGrading,
  getEssayAnswersByExam,
  getAnswerFilePath,
};
