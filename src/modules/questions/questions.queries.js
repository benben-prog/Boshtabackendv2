/* ============================================
   QUESTIONS QUERIES
   ============================================ */

// Create question
const createQuestion = `
INSERT INTO questions (exam_id, question_text, type, file_path, "order")
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`;

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

// Update question
const updateQuestion = `
UPDATE questions
SET 
  question_text = $2,
  type = $3,
  file_path = $4,
  "order" = $5
WHERE id = $1
RETURNING *
`;

// Delete question
const deleteQuestion = `
DELETE FROM questions
WHERE id = $1
RETURNING id
`;

// Get questions count by exam
const getQuestionsCountByExam = `
SELECT COUNT(*) AS count
FROM questions
WHERE exam_id = $1
`;

module.exports = {
  createQuestion,
  getQuestionsByExamId,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsCountByExam,
};
