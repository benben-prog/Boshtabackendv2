const Joi = require("joi");

// Create payment schema
const createPaymentSchema = Joi.object({
  subscription_id: Joi.number().integer().positive().required().messages({
    "any.required": "الاشتراك مطلوب",
  }),
  student_id: Joi.number().integer().positive().required().messages({
    "any.required": "الطالب مطلوب",
  }),
  payment_date: Joi.date().iso().required().messages({
    "any.required": "تاريخ الدفع مطلوب",
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  payment_mode: Joi.string()
    .valid("normal", "custom")
    .default("normal")
    .messages({
      "any.only": "نوع الدفع يجب أن يكون normal أو custom",
    }),
  amount: Joi.number().positive().optional().messages({
    "number.positive": "المبلغ يجب أن يكون أكبر من صفر",
  }),
  notes: Joi.string().allow("", null).max(1000),
});

// Update payment schema (flexible - any field can be updated)
const updatePaymentSchema = Joi.object({
  amount: Joi.number().positive().messages({
    "number.positive": "المبلغ يجب أن يكون أكبر من صفر",
  }),
  payment_date: Joi.date().iso().messages({
    "date.base": "صيغة التاريخ غير صحيحة",
  }),
  payment_mode: Joi.string().valid("normal", "custom").messages({
    "any.only": "نوع الدفع يجب أن يكون normal أو custom",
  }),
  notes: Joi.string().allow("", null).max(1000),
}).min(1);

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
