const Joi = require("joi");

const createLiveSessionSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "عنوان الحصة مطلوب",
    "string.empty": "عنوان الحصة مطلوب",
    "string.min": "عنوان الحصة يجب أن يكون 3 أحرف على الأقل",
    "string.max": "عنوان الحصة يجب أن يكون 255 حرف على الأكثر",
  }),
  description: Joi.string().allow("", null).max(2000).messages({
    "string.max": "الوصف يجب أن يكون 2000 حرف على الأكثر",
  }),
  start_time: Joi.date().iso().required().messages({
    "any.required": "موعد بدء الحصة مطلوب",
    "date.base": "صيغة موعد البدء غير صحيحة (ISO)",
  }),
  duration_minutes: Joi.number().integer().min(15).max(480).required().messages({
    "any.required": "مدة الحصة بالدقائق مطلوبة",
    "number.base": "مدة الحصة يجب أن تكون رقماً",
    "number.min": "مدة الحصة يجب ألا تقل عن 15 دقيقة",
    "number.max": "مدة الحصة يجب ألا تتجاوز 480 دقيقة",
  }),
  target_type: Joi.string().valid("grade", "group", "student").required().messages({
    "any.required": "نوع الجمهور المستهدف مطلوب (grade أو group أو student)",
    "any.only": "نوع الجمهور المستهدف يجب أن يكون grade أو group أو student",
  }),
  grade_id: Joi.number().integer().positive().allow(null).messages({
    "number.base": "معرف الصف الدراسي يجب أن يكون رقماً",
  }),
  group_id: Joi.number().integer().positive().allow(null).messages({
    "number.base": "معرف المجموعة يجب أن يكون رقماً",
  }),
  student_id: Joi.number().integer().positive().allow(null).messages({
    "number.base": "معرف الطالب يجب أن يكون رقماً",
  }),
  student_barcode: Joi.string().trim().allow("", null).messages({
    "string.base": "باركود الطالب يجب أن يكون نصاً",
  }),
  recording_url: Joi.string().uri().allow("", null).messages({
    "string.uri": "رابط التسجيل غير صالح",
  }),
});

const updateLiveSessionSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).messages({
    "string.min": "عنوان الحصة يجب أن يكون 3 أحرف على الأقل",
    "string.max": "عنوان الحصة يجب أن يكون 255 حرف على الأكثر",
  }),
  description: Joi.string().allow("", null).max(2000),
  start_time: Joi.date().iso().messages({
    "date.base": "صيغة موعد البدء غير صحيحة",
  }),
  duration_minutes: Joi.number().integer().min(15).max(480).messages({
    "number.min": "مدة الحصة يجب ألا تقل عن 15 دقيقة",
    "number.max": "مدة الحصة يجب ألا تتجاوز 480 دقيقة",
  }),
  status: Joi.string().valid("scheduled", "live", "ended", "cancelled").messages({
    "any.only": "حالة الحصة يجب أن تكون scheduled أو live أو ended أو cancelled",
  }),
  recording_url: Joi.string().uri().allow("", null).messages({
    "string.uri": "رابط التسجيل غير صالح",
  }),
});

const updateRecordingSchema = Joi.object({
  recording_url: Joi.string().uri().required().messages({
    "any.required": "رابط تسجيل الحصة مطلوب",
    "string.empty": "رابط تسجيل الحصة مطلوب",
    "string.uri": "رابط التسجيل غير صالح",
  }),
});

module.exports = {
  createLiveSessionSchema,
  updateLiveSessionSchema,
  updateRecordingSchema,
};
