/* ============================================
   OPTIONS QUERIES
   ============================================ */

// Create option
const createOption = `
INSERT INTO options (question_id, option_text, is_correct, "order")
VALUES ($1, $2, $3, $4)
RETURNING *
`;

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

// Update option
const updateOption = `
UPDATE options
SET 
  option_text = $2,
  is_correct = $3,
  "order" = $4
WHERE id = $1
RETURNING *
`;

// Delete option
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
  updateOption,
  deleteOption,
  deleteOptionsByQuestionId,
};
