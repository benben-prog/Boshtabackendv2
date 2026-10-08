const Joi = require("joi");

const validateYoutubeUploadSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "عنوان الفيديو مطلوب",
    "string.empty": "عنوان الفيديو مطلوب",
    "string.max": "عنوان الفيديو يجب ألا يتجاوز 100 حرف",
  }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
    "number.base": "الصف الدراسي يجب أن يكون رقماً صحيحاً",
  }),
  playlist_id: Joi.number().integer().positive().allow(null, "").optional(),
  file_size: Joi.number().positive().required().messages({
    "any.required": "حجم ملف الفيديو مطلوب بالبايت",
    "number.positive": "حجم ملف الفيديو غير صحيح",
  }),
  mime_type: Joi.string()
    .trim()
    .pattern(/^video\//i)
    .required()
    .messages({
      "any.required": "نوع ملف الفيديو مطلوب",
      "string.pattern.base": "نوع الملف غير مدعوم، يجب أن يكون ملف فيديو صالحاً",
    }),
});

const initYoutubeUploadSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "عنوان الفيديو مطلوب",
    "string.empty": "عنوان الفيديو مطلوب",
    "string.max": "عنوان الفيديو يجب ألا يتجاوز 100 حرف",
  }),
  description: Joi.string().allow("", null).max(5000),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
    "number.base": "الصف الدراسي يجب أن يكون رقماً صحيحاً",
  }),
  playlist_id: Joi.number().integer().positive().allow(null, "").optional(),
  file_size: Joi.number().positive().required().messages({
    "any.required": "حجم ملف الفيديو مطلوب بالبايت",
    "number.positive": "حجم ملف الفيديو غير صحيح",
  }),
  mime_type: Joi.string()
    .trim()
    .pattern(/^video\//i)
    .required()
    .messages({
      "any.required": "نوع ملف الفيديو مطلوب",
      "string.pattern.base": "نوع الملف غير مدعوم، يجب أن يكون ملف فيديو صالحاً",
    }),
  privacy_status: Joi.string()
    .valid("unlisted", "private", "public")
    .default("unlisted"),
});

const confirmYoutubeUploadSchema = Joi.object({
  youtube_video_id: Joi.string().trim().min(5).max(30).required().messages({
    "any.required": "معرف فيديو يوتيوب مطلوب",
    "string.empty": "معرف فيديو يوتيوب مطلوب",
  }),
  title: Joi.string().trim().min(2).max(255).required().messages({
    "any.required": "عنوان الفيديو مطلوب",
    "string.empty": "عنوان الفيديو مطلوب",
  }),
  description: Joi.string().allow("", null).max(5000),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
  playlist_id: Joi.number().integer().positive().allow(null, "").optional(),
  thumbnail_url: Joi.string().allow("", null).max(500),
  file_url: Joi.string().allow("", null).max(500),
});

module.exports = {
  validateYoutubeUploadSchema,
  initYoutubeUploadSchema,
  confirmYoutubeUploadSchema,
};
