const Joi = require("joi");

// Create video schema
const createVideoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "عنوان الفيديو مطلوب",
    "string.empty": "عنوان الفيديو مطلوب",
  }),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
  video_url: Joi.string().uri().required().max(500).messages({
    "any.required": "رابط الفيديو مطلوب",
    "string.uri": "رابط الفيديو غير صحيح",
  }),
});

// Update video schema
const updateVideoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive(),
  video_url: Joi.string().uri().max(500),
}).min(1);

module.exports = {
  createVideoSchema,
  updateVideoSchema,
};
