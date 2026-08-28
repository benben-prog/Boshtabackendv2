const Joi = require("joi");

// Create template
const createTemplateSchema = Joi.object({
  template: Joi.string().trim().min(2).max(255).required(),
  sent_to: Joi.string().valid("students", "parents", "both").required(),
  delay: Joi.number().integer().min(1).max(3600).default(60),
});

// Update template
const updateTemplateSchema = Joi.object({
  template: Joi.string().trim().min(2).max(255),
  sent_to: Joi.string().valid("students", "parents", "both"),
  delay: Joi.number().integer().min(1).max(3600),
}).min(1);

module.exports = {
  createTemplateSchema,
  updateTemplateSchema,
};