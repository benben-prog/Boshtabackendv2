const Joi = require("joi");

// Create assignment
const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive().required(),
  group_id: Joi.number().integer().positive().allow(null),
  full_mark: Joi.number().min(1).max(999).required(),
  deadline: Joi.date().iso().required(),
});

// Update assignment
const updateAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive(),
  group_id: Joi.number().integer().positive().allow(null),
  full_mark: Joi.number().min(1).max(999),
  deadline: Joi.date().iso(),
  is_closed: Joi.number().integer().valid(0, 1),
}).min(1);

// Grade submission schema
const gradeSubmissionSchema = Joi.object({
  score: Joi.number().min(0).required(),
  feedback: Joi.string().allow("", null).max(1000),
});

module.exports = {
  createAssignmentSchema,
  updateAssignmentSchema,
  gradeSubmissionSchema,
};
