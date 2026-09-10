const Joi = require("joi");

// Login schema (user + student)
const loginSchema = Joi.object({
  phone: Joi.string().trim().min(8).max(20).required().messages({
    "any.required": "رقم الهاتف مطلوب",
    "string.empty": "رقم الهاتف مطلوب",
    "string.min": "رقم الهاتف يجب أن يكون 8 أرقام على الأقل",
    "string.max": "رقم الهاتف يجب أن يكون 20 رقماً على الأكثر",
  }),
  password: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور مطلوبة",
    "string.empty": "كلمة المرور مطلوبة",
    "string.min": "كلمة المرور يجب أن تكون 4 أحرف على الأقل",
    "string.max": "كلمة المرور يجب أن تكون 100 حرف على الأكثر",
  }),
});

// Parent access schema
const parentAccessSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    "any.required": "التوكن مطلوب",
    "string.empty": "التوكن مطلوب",
  }),
});

module.exports = {
  loginSchema,
  parentAccessSchema,
};
