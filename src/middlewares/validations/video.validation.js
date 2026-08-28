const Joi = require("joi");

// Create video
const createVideoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive().required(),
  video_url: Joi.string().required().uri().max(500),
});

// Update video
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
