const Joi = require("joi");

// Create playlist schema
const createPlaylistSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "عنوان قائمة التشغيل مطلوب",
    "string.empty": "عنوان قائمة التشغيل مطلوب",
  }),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
});

// Update playlist schema
const updatePlaylistSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive(),
}).min(1);

module.exports = {
  createPlaylistSchema,
  updatePlaylistSchema,
};
