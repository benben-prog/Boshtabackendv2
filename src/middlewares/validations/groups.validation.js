const Joi = require("joi");

// Create a new group
const createGroupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  grade_id: Joi.number().integer().positive().required(),
  days: Joi.string().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  room: Joi.string().allow("", null).max(100),
});

// Update a group
const updateGroupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  days: Joi.string().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  room: Joi.string().allow("", null).max(100),
});

// Find group by name
const findGroupByNameSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  grade_id: Joi.number().integer().positive().required(),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  findGroupByNameSchema,
};