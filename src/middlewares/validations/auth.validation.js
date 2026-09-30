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

// Student verify activation schema (Step 1)
const verifyActivationSchema = Joi.object({
  barcode: Joi.string().trim().required().messages({
    "any.required": "باركود الكارت مطلوب",
    "string.empty": "باركود الكارت مطلوب",
  }),
  parent_phone: Joi.string().trim().min(8).max(20).required().messages({
    "any.required": "رقم هاتف ولي الأمر مطلوب",
    "string.empty": "رقم هاتف ولي الأمر مطلوب",
    "string.min": "رقم هاتف ولي الأمر يجب أن يكون 8 أرقام على الأقل",
    "string.max": "رقم هاتف ولي الأمر يجب أن يكون 20 رقماً على الأكثر",
  }),
});

// Student complete activation schema (Step 2)
const completeActivationSchema = Joi.object({
  activation_token: Joi.string().trim().optional(),
  barcode: Joi.string().trim().optional(),
  parent_phone: Joi.string().trim().min(8).max(20).optional(),
  password: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور مطلوبة",
    "string.empty": "كلمة المرور مطلوبة",
    "string.min": "كلمة المرور يجب أن تكون 4 أحرف على الأقل",
    "string.max": "كلمة المرور يجب أن تكون 100 حرف على الأكثر",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.required": "تأكيد كلمة المرور مطلوب",
      "any.only": "كلمتا المرور غير متطابقتين",
    }),
}).or("activation_token", "barcode").messages({
  "object.missing": "يجب إرسال إما توكن التفعيل (activation_token) أو الباركود ورقم ولي الأمر",
});

module.exports = {
  loginSchema,
  parentAccessSchema,
  verifyActivationSchema,
  completeActivationSchema,
};
