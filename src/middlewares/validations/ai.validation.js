const Joi = require("joi");

const chatSchema = Joi.object({
  message: Joi.string().trim().allow("", null).messages({
    "string.base": "الرسالة يجب أن تكون نصاً",
  }),
}).unknown(true);

module.exports = {
  chatSchema,
};
