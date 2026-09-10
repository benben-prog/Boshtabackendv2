/* ============================================
   OPTIONS QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createOption = `
INSERT INTO options (question_id, option_text, is_correct, "order")
VALUES ($1, $2, $3, $4)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

// Get options by question ID
const getOptionsByQuestionId = `
SELECT 
  id,
  question_id,
  option_text,
  is_correct,
  "order",
  created_at
FROM options
WHERE question_id = $1
ORDER BY "order" ASC
`;

// Get option by ID
const getOptionById = `
SELECT 
  id,
  question_id,
  option_text,
  is_correct,
  "order",
  created_at
FROM options
WHERE id = $1
`;

// Get option with exam info (for validation)
const getOptionWithExam = `
SELECT 
  o.id,
  o.question_id,
  o.option_text,
  o.is_correct,
  o."order",
  q.exam_id,
  oe.start_at AS exam_start_at
FROM options o
JOIN questions q ON o.question_id = q.id
JOIN online_exams oe ON q.exam_id = oe.id
WHERE o.id = $1
`;

// Count correct options for a question
const countCorrectOptions = `
SELECT COUNT(*) AS count
FROM options
WHERE question_id = $1 AND is_correct = 1
`;

// ============================================
// UPDATE
// ============================================

const updateOption = `
UPDATE options
SET 
  option_text = COALESCE($2, option_text),
  is_correct = COALESCE($3, is_correct),
  "order" = COALESCE($4, "order")
WHERE id = $1
RETURNING *
`;

// ============================================
// DELETE
// ============================================

const deleteOption = `
DELETE FROM options
WHERE id = $1
RETURNING id
`;

// Delete all options for a question
const deleteOptionsByQuestionId = `
DELETE FROM options
WHERE question_id = $1
RETURNING id
`;

module.exports = {
  createOption,
  getOptionsByQuestionId,
  getOptionById,
  getOptionWithExam,
  countCorrectOptions,
  updateOption,
  deleteOption,
  deleteOptionsByQuestionId,
};
