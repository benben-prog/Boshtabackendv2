const Joi = require("joi");

// Create question schema
const createQuestionSchema = Joi.object({
  exam_id: Joi.number().integer().positive().required().messages({
    "any.required": "الامتحان مطلوب",
    "number.base": "الامتحان يجب أن يكون رقماً",
  }),
  question_text: Joi.string().trim().min(1).max(2000).required().messages({
    "any.required": "نص السؤال مطلوب",
    "string.empty": "نص السؤال مطلوب",
    "string.max": "نص السؤال يجب أن يكون 2000 حرف على الأكثر",
  }),
  type: Joi.string().valid("mcq", "true_false", "essay").required().messages({
    "any.required": "نوع السؤال مطلوب",
    "any.only": "نوع السؤال يجب أن يكون mcq أو true_false أو essay",
  }),
  order: Joi.number().integer().min(1).required().messages({
    "any.required": "ترتيب السؤال مطلوب",
    "number.min": "ترتيب السؤال يجب أن يكون 1 على الأقل",
  }),
});

// Update question schema
const updateQuestionSchema = Joi.object({
  question_text: Joi.string().trim().min(1).max(2000).messages({
    "string.max": "نص السؤال يجب أن يكون 2000 حرف على الأكثر",
  }),
  type: Joi.string().valid("mcq", "true_false", "essay").messages({
    "any.only": "نوع السؤال يجب أن يكون mcq أو true_false أو essay",
  }),
  order: Joi.number().integer().min(1).messages({
    "number.min": "ترتيب السؤال يجب أن يكون 1 على الأقل",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
};
