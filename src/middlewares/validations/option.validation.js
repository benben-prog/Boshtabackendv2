const Joi = require("joi");

// Create option
const createOptionSchema = Joi.object({
  question_id: Joi.number().integer().positive().required(),
  option_text: Joi.string().trim().min(1).max(255).required(),
  is_correct: Joi.number().integer().valid(0, 1).required(),
  order: Joi.number().integer().min(1).required(),
});

// Update option
const updateOptionSchema = Joi.object({
  option_text: Joi.string().trim().min(1).max(255),
  is_correct: Joi.number().integer().valid(0, 1),
  order: Joi.number().integer().min(1),
}).min(1);

module.exports = {
  createOptionSchema,
  updateOptionSchema,
};
