const Joi = require("joi");

// Create subscription schema
const createSubscriptionSchema = Joi.object({
  student_id: Joi.number().integer().positive().required().messages({
    "any.required": "الطالب مطلوب",
  }),
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      "any.required": "الشهر مطلوب",
      "string.pattern.base": "صيغة الشهر يجب أن تكون YYYY-MM",
    }),
});

// Update subscription status schema
const updateSubscriptionStatusSchema = Joi.object({
  status: Joi.string().valid("paid", "unpaid").required().messages({
    "any.required": "الحالة مطلوبة",
    "any.only": "الحالة يجب أن تكون مدفوع أو غير مدفوع",
  }),
});

module.exports = {
  createSubscriptionSchema,
  updateSubscriptionStatusSchema,
};
