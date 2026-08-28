const Joi = require("joi");
const createAssignmentSchema = Joi.object({
  title: Joi.string().required().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().required(),
  group_id: Joi.number().integer().allow(null),
  full_mark: Joi.number().required().min(1).max(999),
  deadline: Joi.date().iso().required(),
  file_path: Joi.string().allow("", null).max(255),
});

const updateAssignmentSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer(),
  group_id: Joi.number().integer().allow(null),
  filePath: Joi.string().allow("", null).max(255),
  fullMark: Joi.number().min(1).max(999),
  deadline: Joi.date().iso(),
  isClosed: Joi.number().integer().valid(0, 1)
});

module.exports = {
  createAssignmentSchema,
  updateAssignmentSchema
};