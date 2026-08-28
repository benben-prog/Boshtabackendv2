const Joi = require("joi");

// Create payment - without amount (comes from subscription required_amount)
const createPaymentSchema = Joi.object({
  subscription_id: Joi.number().integer().positive().required(),
  student_id: Joi.number().integer().positive().required(),
  payment_date: Joi.date().iso().required(),
  notes: Joi.string().allow("", null).max(1000),
});

// Update payment
const updatePaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  payment_date: Joi.date().iso().required(),
  notes: Joi.string().allow("", null).max(1000),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
