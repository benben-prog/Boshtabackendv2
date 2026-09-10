/* ============================================
   QUESTIONS QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createQuestion = `
INSERT INTO questions (exam_id, question_text, type, file_path, "order")
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

// Get questions by exam ID
const getQuestionsByExamId = `
SELECT 
  id,
  exam_id,
  question_text,
  type,
  file_path,
  "order",
  created_at
FROM questions
WHERE exam_id = $1
ORDER BY "order" ASC
`;

// Get question by ID
const getQuestionById = `
SELECT 
  id,
  exam_id,
  question_text,
  type,
  file_path,
  "order",
  created_at
FROM questions
WHERE id = $1
`;

// Get question with exam info (for validation)
const getQuestionWithExam = `
SELECT 
  q.id,
  q.exam_id,
  q.question_text,
  q.type,
  q.file_path,
  q."order",
  oe.start_at AS exam_start_at,
  oe.end_at AS exam_end_at
FROM questions q
JOIN online_exams oe ON q.exam_id = oe.id
WHERE q.id = $1
`;

// Get exam start_at (for validation)
const getExamStartAt = `
SELECT id, start_at, end_at
FROM online_exams
WHERE id = $1
`;

// Get max order for an exam
const getMaxOrderForExam = `
SELECT COALESCE(MAX("order"), 0) AS max_order
FROM questions
WHERE exam_id = $1
`;

// Get questions count by exam
const getQuestionsCountByExam = `
SELECT COUNT(*) AS count
FROM questions
WHERE exam_id = $1
`;

// ============================================
// UPDATE
// ============================================

const updateQuestion = `
UPDATE questions
SET 
  question_text = COALESCE($2, question_text),
  type = COALESCE($3, type),
  file_path = COALESCE($4, file_path),
  "order" = COALESCE($5, "order")
WHERE id = $1
RETURNING *
`;

// ============================================
// DELETE
// ============================================

const deleteQuestion = `
DELETE FROM questions
WHERE id = $1
RETURNING id
`;

module.exports = {
  createQuestion,
  getQuestionsByExamId,
  getQuestionById,
  getQuestionWithExam,
  getExamStartAt,
  getMaxOrderForExam,
  getQuestionsCountByExam,
  updateQuestion,
  deleteQuestion,
};
