const Joi = require("joi");

// Create user
const createUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(255).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  password: Joi.string().min(4).max(100).required(),
  role: Joi.string().valid("super_admin", "assistant", "teacher").required(),
  permissions: Joi.string()
    .valid("online_management", "center_management")
    .required(),
});

// Update user
const updateUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(255),
  phone: Joi.string().trim().min(8).max(20),
  role: Joi.string().valid("super_admin", "assistant", "teacher"),
  permissions: Joi.string().valid("online_management", "center_management"),
}).min(1);

// Update user password
const updateUserPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور القديمة مطلوبة",
    "string.empty": "كلمة المرور القديمة مطلوبة",
  }),
  // يقبل password أو newPassword (واحدة منهم فقط)
  password: Joi.string().min(4).max(100).messages({
    "string.min": "كلمة المرور الجديدة يجب ألا تقل عن 4 أحرف",
  }),
  newPassword: Joi.string().min(4).max(100).messages({
    "string.min": "كلمة المرور الجديدة يجب ألا تقل عن 4 أحرف",
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
    "object.xor": "ابعت password أو newPassword وليس الاثنين معًا",
  });

// Find user by phone
const findUserByPhoneSchema = Joi.object({
  phone: Joi.string().trim().min(8).max(20).required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  findUserByPhoneSchema,
};
