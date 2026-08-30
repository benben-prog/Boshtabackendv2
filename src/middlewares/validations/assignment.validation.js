const Joi = require("joi");

// Create assignment
const createAssignmentSchema = Joi.object({
  title: Joi.string().required().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().required(),
  group_id: Joi.number().integer().allow(null),
  full_mark: Joi.number().required().min(1).max(999),
  deadline: Joi.date().iso().required(),
  file_path: Joi.string().allow("", null).max(255),
  is_closed: Joi.number().integer().valid(0, 1).default(0),
});

// Update assignment
const updateAssignmentSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer(),
  group_id: Joi.number().integer().allow(null),
  file_path: Joi.string().allow("", null).max(255),
  full_mark: Joi.number().min(1).max(999),
  deadline: Joi.date().iso(),
  is_closed: Joi.number().integer().valid(0, 1).default(0),
}).min(1);

module.exports = {
  createAssignmentSchema,
  updateAssignmentSchema,
};
