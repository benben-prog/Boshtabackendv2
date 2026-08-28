const Joi = require("joi");

// Create question
const createQuestionSchema = Joi.object({
  exam_id: Joi.number().integer().positive().required(),
  question_text: Joi.string().required().min(1).max(2000),
  type: Joi.string().required().valid("mcq", "true_false", "essay"),
  order: Joi.number().integer().min(1).required(),
});

// Update question
const updateQuestionSchema = Joi.object({
  question_text: Joi.string().min(1).max(2000),
  type: Joi.string().valid("mcq", "true_false", "essay"),
  order: Joi.number().integer().min(1),
}).min(1);

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
};
