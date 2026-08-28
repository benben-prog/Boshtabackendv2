const Joi = require("joi");

// Create exam
const createExamSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  grade_id: Joi.number().integer().positive().required(),
  group_id: Joi.number().integer().positive().allow(null),
  total_degree: Joi.number().positive().required(),
  exam_date: Joi.date().iso().required(),
  notes: Joi.string().allow("", null).max(1000),
});

// Update exam
const updateExamSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  grade_id: Joi.number().integer().positive().required(),
  group_id: Joi.number().integer().positive().allow(null),
  total_degree: Joi.number().positive().required(),
  exam_date: Joi.date().iso().required(),
  notes: Joi.string().allow("", null).max(1000),
});

module.exports = {
  createExamSchema,
  updateExamSchema,
};