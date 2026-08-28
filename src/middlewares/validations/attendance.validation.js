const Joi = require("joi");

// Create attendance
const createAttendanceSchema = Joi.object({
  student_id: Joi.number().integer().positive().required(),
  group_id: Joi.number().integer().positive().required(),
  grade_id: Joi.number().integer().positive().required(),
  attendance_date: Joi.date().iso().required(),
  status: Joi.string().valid("present", "absent").required(),
  attendance_time: Joi.string().allow("", null),
  method: Joi.string().valid("manual", "barcode").default("manual"),
  is_makeup: Joi.number().integer().valid(0, 1).default(0),
  makeup_group_id: Joi.number().integer().positive().allow(null),
  notes: Joi.string().allow("", null).max(1000),
});

// Update attendance
const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent").required(),
  attendance_time: Joi.string().allow("", null),
  method: Joi.string().valid("manual", "barcode"),
  is_makeup: Joi.number().integer().valid(0, 1),
  makeup_group_id: Joi.number().integer().positive().allow(null),
  notes: Joi.string().allow("", null).max(1000),
});

// Mark rest absent
const markRestAbsentSchema = Joi.object({
  groupId: Joi.number().integer().positive().required(),
  date: Joi.date().iso().required(),
});

module.exports = {
  createAttendanceSchema,
  updateAttendanceSchema,
  markRestAbsentSchema,
};