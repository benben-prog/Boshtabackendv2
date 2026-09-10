const Joi = require("joi");

// Create online exam schema
const createOnlineExamSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "عنوان الامتحان مطلوب",
    "string.empty": "عنوان الامتحان مطلوب",
    "string.min": "عنوان الامتحان يجب أن يكون 3 أحرف على الأقل",
  }),
  description: Joi.string().allow("", null).max(1000).messages({
    "string.max": "الوصف يجب أن يكون 1000 حرف على الأكثر",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
  group_id: Joi.number().integer().positive().allow(null),
  duration_minutes: Joi.number().integer().min(1).max(300).required().messages({
    "any.required": "مدة الامتحان مطلوبة",
    "number.min": "مدة الامتحان يجب أن تكون دقيقة واحدة على الأقل",
    "number.max": "مدة الامتحان يجب أن تكون 300 دقيقة على الأكثر",
  }),
  start_at: Joi.date().iso().required().messages({
    "any.required": "وقت البداية مطلوب",
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  end_at: Joi.date().iso().required().greater(Joi.ref("start_at")).messages({
    "any.required": "وقت النهاية مطلوب",
    "date.greater": "وقت النهاية يجب أن يكون بعد وقت البداية",
  }),
  full_mark: Joi.number().min(1).max(999).required().messages({
    "any.required": "الدرجة الكلية مطلوبة",
    "number.min": "الدرجة الكلية يجب أن تكون أكبر من صفر",
    "number.max": "الدرجة الكلية يجب أن تكون 999 على الأكثر",
  }),
  randomize_questions: Joi.number().integer().valid(0, 1).default(0).messages({
    "any.only": "ترتيب الأسئلة العشوائي يجب أن يكون 0 أو 1",
  }),
});

// Update online exam schema
const updateOnlineExamSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).messages({
    "string.min": "عنوان الامتحان يجب أن يكون 3 أحرف على الأقل",
  }),
  description: Joi.string().allow("", null).max(1000).messages({
    "string.max": "الوصف يجب أن يكون 1000 حرف على الأكثر",
  }),
  grade_id: Joi.number().integer().positive(),
  group_id: Joi.number().integer().positive().allow(null),
  duration_minutes: Joi.number().integer().min(1).max(300).messages({
    "number.min": "مدة الامتحان يجب أن تكون دقيقة واحدة على الأقل",
    "number.max": "مدة الامتحان يجب أن تكون 300 دقيقة على الأكثر",
  }),
  start_at: Joi.date().iso().messages({
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  end_at: Joi.date().iso().messages({
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  full_mark: Joi.number().min(1).max(999).messages({
    "number.min": "الدرجة الكلية يجب أن تكون أكبر من صفر",
    "number.max": "الدرجة الكلية يجب أن تكون 999 على الأكثر",
  }),
  randomize_questions: Joi.number().integer().valid(0, 1).messages({
    "any.only": "ترتيب الأسئلة العشوائي يجب أن يكون 0 أو 1",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

module.exports = {
  createOnlineExamSchema,
  updateOnlineExamSchema,
};
