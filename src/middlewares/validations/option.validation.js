const Joi = require("joi");

// Create option schema
const createOptionSchema = Joi.object({
  question_id: Joi.number().integer().positive().required().messages({
    "any.required": "السؤال مطلوب",
    "number.base": "السؤال يجب أن يكون رقماً",
  }),
  option_text: Joi.string().trim().min(1).max(255).required().messages({
    "any.required": "نص الاختيار مطلوب",
    "string.empty": "نص الاختيار مطلوب",
    "string.max": "نص الاختيار يجب أن يكون 255 حرف على الأكثر",
  }),
  is_correct: Joi.number().integer().valid(0, 1).required().messages({
    "any.required": "تحديد الإجابة الصحيحة مطلوب",
    "any.only": "الإجابة الصحيحة يجب أن تكون 0 أو 1",
  }),
  order: Joi.number().integer().min(1).required().messages({
    "any.required": "ترتيب الاختيار مطلوب",
    "number.min": "ترتيب الاختيار يجب أن يكون 1 على الأقل",
  }),
});

// Update option schema
const updateOptionSchema = Joi.object({
  option_text: Joi.string().trim().min(1).max(255).messages({
    "string.max": "نص الاختيار يجب أن يكون 255 حرف على الأكثر",
  }),
  is_correct: Joi.number().integer().valid(0, 1).messages({
    "any.only": "الإجابة الصحيحة يجب أن تكون 0 أو 1",
  }),
  order: Joi.number().integer().min(1).messages({
    "number.min": "ترتيب الاختيار يجب أن يكون 1 على الأقل",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

module.exports = {
  createOptionSchema,
  updateOptionSchema,
};
