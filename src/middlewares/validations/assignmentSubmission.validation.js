const Joi = require("joi");

// Grade submission schema
const gradeSubmissionSchema = Joi.object({
  score: Joi.number().min(0).required().messages({
    "any.required": "الدرجة مطلوبة",
    "number.min": "الدرجة لا يمكن أن تكون سالبة",
    "number.base": "الدرجة يجب أن تكون رقماً",
  }),
  feedback: Joi.string().allow("", null).max(1000).messages({
    "string.max": "التعليق يجب أن يكون 1000 حرف على الأكثر",
  }),
});

module.exports = {
  gradeSubmissionSchema,
};
