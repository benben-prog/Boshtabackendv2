const Joi = require("joi");

// Create exam schema
const createExamSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required().messages({
    "any.required": "عنوان الامتحان مطلوب",
    "string.empty": "عنوان الامتحان مطلوب",
    "string.min": "عنوان الامتحان يجب أن يكون حرفين على الأقل",
    "string.max": "عنوان الامتحان يجب أن يكون 255 حرف على الأكثر",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
    "number.base": "الصف الدراسي يجب أن يكون رقماً",
  }),
  group_id: Joi.number().integer().positive().allow(null),
  total_degree: Joi.number().positive().required().messages({
    "any.required": "الدرجة الكلية مطلوبة",
    "number.positive": "الدرجة الكلية يجب أن تكون أكبر من صفر",
    "number.base": "الدرجة الكلية يجب أن تكون رقماً",
  }),
  exam_date: Joi.date().iso().required().messages({
    "any.required": "تاريخ الامتحان مطلوب",
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  notes: Joi.string().allow("", null).max(1000).messages({
    "string.max": "الملاحظات يجب أن تكون 1000 حرف على الأكثر",
  }),
});

// Update exam schema
const updateExamSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).messages({
    "string.min": "عنوان الامتحان يجب أن يكون حرفين على الأقل",
    "string.max": "عنوان الامتحان يجب أن يكون 255 حرف على الأكثر",
  }),
  grade_id: Joi.number().integer().positive(),
  group_id: Joi.number().integer().positive().allow(null),
  total_degree: Joi.number().positive().messages({
    "number.positive": "الدرجة الكلية يجب أن تكون أكبر من صفر",
  }),
  exam_date: Joi.date().iso().messages({
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  notes: Joi.string().allow("", null).max(1000).messages({
    "string.max": "الملاحظات يجب أن تكون 1000 حرف على الأكثر",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

module.exports = {
  createExamSchema,
  updateExamSchema,
};
