const Joi = require("joi");

// Create group schema
const createGroupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "اسم المجموعة مطلوب",
    "string.empty": "اسم المجموعة مطلوب",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
  days: Joi.string().trim().required().messages({
    "any.required": "الأيام مطلوبة",
  }),
  start_time: Joi.string().trim().required().messages({
    "any.required": "وقت البداية مطلوب",
  }),
  end_time: Joi.string().trim().required().messages({
    "any.required": "وقت النهاية مطلوب",
  }),
  room: Joi.string().allow("", null).max(100),
});

// Update group schema
const updateGroupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "اسم المجموعة مطلوب",
  }),
  days: Joi.string().trim().required().messages({
    "any.required": "الأيام مطلوبة",
  }),
  start_time: Joi.string().trim().required().messages({
    "any.required": "وقت البداية مطلوب",
  }),
  end_time: Joi.string().trim().required().messages({
    "any.required": "وقت النهاية مطلوب",
  }),
  room: Joi.string().allow("", null).max(100),
});

// Find group by name schema
const findGroupByNameSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "اسم المجموعة مطلوب",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  findGroupByNameSchema,
};
