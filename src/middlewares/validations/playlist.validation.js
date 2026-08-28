const Joi = require("joi");

// Create playlist
const createPlaylistSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive().required(),
});

// Update playlist
const updatePlaylistSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().allow("", null).max(2000),
  grade_id: Joi.number().integer().positive(),
}).min(1);

module.exports = {
  createPlaylistSchema,
  updatePlaylistSchema,
};
