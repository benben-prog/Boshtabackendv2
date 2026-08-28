const { query } = require("../../config/database");
const optionQueries = require("./options.queries");

// Create option
const createOption = async (optionData) => {
  const { question_id, option_text, is_correct, order } = optionData;
  const result = await query(optionQueries.createOption, [
    question_id,
    option_text,
    is_correct,
    order,
  ]);
  return result.rows[0];
};

// Get options by question ID
const getOptionsByQuestionId = async (questionId) => {
  const result = await query(optionQueries.getOptionsByQuestionId, [
    questionId,
  ]);
  return result.rows;
};

// Get option by ID
const getOptionById = async (optionId) => {
  const result = await query(optionQueries.getOptionById, [optionId]);
  return result.rows[0];
};

// Update option
const updateOption = async (optionId, optionData) => {
  const existing = await query("SELECT * FROM options WHERE id = $1", [
    optionId,
  ]);
  if (!existing.rows[0]) return null;

  const updated = {
    option_text: optionData.option_text ?? existing.rows[0].option_text,
    is_correct: optionData.is_correct ?? existing.rows[0].is_correct,
    order: optionData.order ?? existing.rows[0].order,
  };

  const result = await query(optionQueries.updateOption, [
    optionId,
    updated.option_text,
    updated.is_correct,
    updated.order,
  ]);
  return result.rows[0];
};

// Delete option
const deleteOption = async (optionId) => {
  const result = await query(optionQueries.deleteOption, [optionId]);
  return result.rows[0];
};

// Delete all options for a question
const deleteOptionsByQuestionId = async (questionId) => {
  const result = await query(optionQueries.deleteOptionsByQuestionId, [
    questionId,
  ]);
  return result.rows;
};

module.exports = {
  createOption,
  getOptionsByQuestionId,
  getOptionById,
  updateOption,
  deleteOption,
  deleteOptionsByQuestionId,
};
