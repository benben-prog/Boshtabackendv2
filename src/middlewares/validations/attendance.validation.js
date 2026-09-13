const Joi = require("joi");

// Create attendance schema
const createAttendanceSchema = Joi.object({
  student_id: Joi.number().integer().positive().required().messages({
    "any.required": "الطالب مطلوب",
  }),
  group_id: Joi.number().integer().positive().required().messages({
    "any.required": "المجموعة مطلوبة",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
  attendance_date: Joi.date().iso().max("now").required().messages({
    "any.required": "تاريخ الحضور مطلوب",
    "date.base": "صيغة التاريخ غير صحيحة",
    "date.max": "لا يمكن تسجيل الحضور في المستقبل",
  }),
  status: Joi.string().valid("present", "absent").required().messages({
    "any.required": "حالة الحضور مطلوبة",
    "any.only": "الحالة يجب أن تكون حاضر أو غائب",
  }),
  method: Joi.string().valid("manual", "barcode").default("manual"),
  is_makeup: Joi.number().integer().valid(0, 1).default(0),
  makeup_group_id: Joi.number().integer().positive().allow(null),
  notes: Joi.string().allow("", null).max(1000),
});

// Update attendance schema
const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent").required().messages({
    "any.required": "حالة الحضور مطلوبة",
    "any.only": "الحالة يجب أن تكون حاضر أو غائب",
  }),
  method: Joi.string().valid("manual", "barcode"),
  is_makeup: Joi.number().integer().valid(0, 1),
  makeup_group_id: Joi.number().integer().positive().allow(null),
  notes: Joi.string().allow("", null).max(1000),
});

// Start session schema
// Note: lock_at is intentionally NOT accepted.
// The lock duration is derived from settings.default_lock_minutes.
const startSessionSchema = Joi.object({
  group_id: Joi.number().integer().positive().required().messages({
    "any.required": "المجموعة مطلوبة",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
});

// Scan barcode schema
const scanBarcodeSchema = Joi.object({
  barcode: Joi.string().trim().min(1).max(50).required().messages({
    "any.required": "الباركود مطلوب",
    "string.empty": "الباركود مطلوب",
  }),
  group_id: Joi.number().integer().positive().required().messages({
    "any.required": "المجموعة مطلوبة",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
});

// Close session schema
const closeSessionSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "معرف الجلسة مطلوب",
  }),
  groupId: Joi.number().integer().positive().required().messages({
    "any.required": "المجموعة مطلوبة",
  }),
});

module.exports = {
  createAttendanceSchema,
  updateAttendanceSchema,
  startSessionSchema,
  scanBarcodeSchema,
  closeSessionSchema,
};
