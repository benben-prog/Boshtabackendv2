const Joi = require("joi");

// Login schema (user + student)
const loginSchema = Joi.object({
  phone: Joi.string().required().min(8).max(20),
  password: Joi.string().required().min(4).max(100),
});

// Parent access schema
const parentAccessSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = {
  loginSchema,
  parentAccessSchema,
};
