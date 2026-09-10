const Joi = require("joi");

// Create assignment schema
const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "عنوان الواجب مطلوب",
    "string.empty": "عنوان الواجب مطلوب",
    "string.min": "عنوان الواجب يجب أن يكون 3 أحرف على الأقل",
    "string.max": "عنوان الواجب يجب أن يكون 255 حرف على الأكثر",
  }),
  description: Joi.string().allow("", null).max(2000).messages({
    "string.max": "الوصف يجب أن يكون 2000 حرف على الأكثر",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
    "number.base": "الصف الدراسي يجب أن يكون رقماً",
  }),
  group_id: Joi.number().integer().positive().allow(null),
  full_mark: Joi.number().min(1).max(999).required().messages({
    "any.required": "الدرجة الكلية مطلوبة",
    "number.min": "الدرجة الكلية يجب أن تكون أكبر من صفر",
    "number.max": "الدرجة الكلية يجب أن تكون 999 على الأكثر",
  }),
  deadline: Joi.date().iso().required().messages({
    "any.required": "الموعد النهائي مطلوب",
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  file_path: Joi.string().allow("", null).max(255),
  is_closed: Joi.number().integer().valid(0, 1).default(0).messages({
    "any.only": "حالة الإغلاق يجب أن تكون 0 أو 1",
  }),
});

// Update assignment schema
const updateAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).messages({
    "string.min": "عنوان الواجب يجب أن يكون 3 أحرف على الأقل",
    "string.max": "عنوان الواجب يجب أن يكون 255 حرف على الأكثر",
  }),
  description: Joi.string().allow("", null).max(2000).messages({
    "string.max": "الوصف يجب أن يكون 2000 حرف على الأكثر",
  }),
  grade_id: Joi.number().integer().positive(),
  group_id: Joi.number().integer().positive().allow(null),
  file_path: Joi.string().allow("", null).max(255),
  full_mark: Joi.number().min(1).max(999).messages({
    "number.min": "الدرجة الكلية يجب أن تكون أكبر من صفر",
    "number.max": "الدرجة الكلية يجب أن تكون 999 على الأكثر",
  }),
  deadline: Joi.date().iso().messages({
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  is_closed: Joi.number().integer().valid(0, 1).messages({
    "any.only": "حالة الإغلاق يجب أن تكون 0 أو 1",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

module.exports = {
  createAssignmentSchema,
  updateAssignmentSchema,
};
