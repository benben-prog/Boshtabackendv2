const Joi = require("joi");

// Add video to playlist schema
const addVideoToPlaylistSchema = Joi.object({
  playlist_id: Joi.number().integer().positive().required().messages({
    "any.required": "قائمة التشغيل مطلوبة",
  }),
  video_id: Joi.number().integer().positive().required().messages({
    "any.required": "الفيديو مطلوب",
  }),
});

module.exports = {
  addVideoToPlaylistSchema,
};
