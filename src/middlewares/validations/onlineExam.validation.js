const Joi = require("joi");

// Create online exam
const createOnlineExamSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().allow("", null).max(1000),
  grade_id: Joi.number().integer().positive().required(),
  group_id: Joi.number().integer().positive().allow(null),
  duration_minutes: Joi.number().integer().min(1).max(300).required(),
  start_at: Joi.date().iso().required(),
  end_at: Joi.date().iso().required().greater(Joi.ref("start_at")),
  full_mark: Joi.number().min(1).max(999).required(),
  randomize_questions: Joi.number().integer().valid(0, 1).default(0),
});

// Update online exam
const updateOnlineExamSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().allow("", null).max(1000),
  grade_id: Joi.number().integer().positive(),
  group_id: Joi.number().integer().positive().allow(null),
  duration_minutes: Joi.number().integer().min(1).max(300),
  start_at: Joi.date().iso(),
  end_at: Joi.date().iso(),
  full_mark: Joi.number().min(1).max(999),
  randomize_questions: Joi.number().integer().valid(0, 1),
}).min(1);

module.exports = {
  createOnlineExamSchema,
  updateOnlineExamSchema,
};
