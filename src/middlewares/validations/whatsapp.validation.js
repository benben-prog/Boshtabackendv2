const Joi = require("joi");

// Create template schema
const createTemplateSchema = Joi.object({
  template: Joi.string().trim().min(2).max(255).required().messages({
    "any.required": "القالب مطلوب",
    "string.empty": "القالب مطلوب",
  }),
  sent_to: Joi.string().valid("parents", "both").required().messages({
    "any.required": "المستلم مطلوب",
    "any.only": "المستلم يجب أن يكون parents أو both",
  }),
  delay: Joi.number().integer().min(1).max(3600).default(60),
});

// Update template schema
const updateTemplateSchema = Joi.object({
  template: Joi.string().trim().min(2).max(255),
  sent_to: Joi.string().valid("parents", "both"),
  delay: Joi.number().integer().min(1).max(3600),
}).min(1);

module.exports = {
  createTemplateSchema,
  updateTemplateSchema,
};
