const Joi = require("joi");

// Add video to playlist
const addVideoToPlaylistSchema = Joi.object({
  playlist_id: Joi.number().integer().positive().required(),
  video_id: Joi.number().integer().positive().required(),
});

module.exports = {
  addVideoToPlaylistSchema,
};
