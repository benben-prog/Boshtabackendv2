const Joi = require("joi");

// Create grade schema
const createGradeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "اسم الصف مطلوب",
    "string.empty": "اسم الصف مطلوب",
    "string.min": "اسم الصف يجب أن يكون حرفين على الأقل",
    "string.max": "اسم الصف يجب أن يكون 100 حرف على الأكثر",
  }),
  monthly_price: Joi.number().positive().required().messages({
    "any.required": "السعر الشهري مطلوب",
    "number.positive": "السعر الشهري يجب أن يكون أكبر من صفر",
    "number.base": "السعر الشهري يجب أن يكون رقماً",
  }),
});

// Update grade schema
const updateGradeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": "اسم الصف يجب أن يكون حرفين على الأقل",
    "string.max": "اسم الصف يجب أن يكون 100 حرف على الأكثر",
  }),
  monthly_price: Joi.number().positive().messages({
    "number.positive": "السعر الشهري يجب أن يكون أكبر من صفر",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

// Find grade by name schema
const findGradeByNameSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "اسم الصف مطلوب",
    "string.empty": "اسم الصف مطلوب",
    "string.min": "اسم الصف يجب أن يكون حرفين على الأقل",
  }),
});

module.exports = {
  createGradeSchema,
  updateGradeSchema,
  findGradeByNameSchema,
};
