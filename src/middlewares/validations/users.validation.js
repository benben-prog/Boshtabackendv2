const Joi = require("joi");

// Create user schema
const createUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "اسم المستخدم مطلوب",
    "string.empty": "اسم المستخدم مطلوب",
    "string.min": "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
    "string.max": "اسم المستخدم يجب أن يكون 255 حرف على الأكثر",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      "any.required": "رقم الهاتف مطلوب",
      "string.empty": "رقم الهاتف مطلوب",
      "string.pattern.base":
        "رقم الهاتف يجب أن يكون رقماً مصرياً صحيحاً (01xxxxxxxxx)",
    }),
  password: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور مطلوبة",
    "string.empty": "كلمة المرور مطلوبة",
    "string.min": "كلمة المرور يجب أن تكون 4 أحرف على الأقل",
    "string.max": "كلمة المرور يجب أن تكون 100 حرف على الأكثر",
  }),
  role: Joi.string()
    .valid("super_admin", "assistant", "teacher")
    .required()
    .messages({
      "any.required": "الدور مطلوب",
      "any.only": "الدور يجب أن يكون super_admin أو assistant أو teacher",
    }),
  permissions: Joi.string()
    .valid("online_management", "center_management")
    .required()
    .messages({
      "any.required": "الصلاحيات مطلوبة",
      "any.only":
        "الصلاحيات يجب أن تكون online_management أو center_management",
    }),
});

// Update user schema
const updateUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(255).messages({
    "string.min": "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .messages({
      "string.pattern.base":
        "رقم الهاتف يجب أن يكون رقماً مصرياً صحيحاً (01xxxxxxxxx)",
    }),
  role: Joi.string().valid("super_admin", "assistant", "teacher").messages({
    "any.only": "الدور يجب أن يكون super_admin أو assistant أو teacher",
  }),
  permissions: Joi.string()
    .valid("online_management", "center_management")
    .messages({
      "any.only":
        "الصلاحيات يجب أن تكون online_management أو center_management",
    }),
}).min(1);

// Update user password schema (flexible)
const updateUserPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور القديمة مطلوبة",
    "string.empty": "كلمة المرور القديمة مطلوبة",
    "string.min": "كلمة المرور القديمة يجب أن تكون 4 أحرف على الأقل",
  }),
  password: Joi.string().min(4).max(100).messages({
    "string.min": "كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل",
  }),
  newPassword: Joi.string().min(4).max(100).messages({
    "string.min": "كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"), Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "تأكيد كلمة المرور غير مطابق",
      "any.required": "تأكيد كلمة المرور مطلوب",
    }),
})
  .xor("password", "newPassword")
  .messages({
    "object.missing": "كلمة المرور الجديدة مطلوبة",
    "object.xor": "أرسل password أو newPassword وليس الاثنين معاً",
  });

// Find user by phone schema
const findUserByPhoneSchema = Joi.object({
  phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      "any.required": "رقم الهاتف مطلوب",
      "string.pattern.base":
        "رقم الهاتف يجب أن يكون رقماً مصرياً صحيحاً (01xxxxxxxxx)",
    }),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  findUserByPhoneSchema,
};
