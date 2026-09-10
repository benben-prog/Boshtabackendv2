const Joi = require("joi");

// Update settings schema
const updateSettingsSchema = Joi.object({
  center_name: Joi.string().trim().min(2).max(255).messages({
    "string.min": "اسم المركز يجب أن يكون حرفين على الأقل",
    "string.max": "اسم المركز يجب أن يكون 255 حرف على الأكثر",
  }),
  phone: Joi.string().trim().allow("", null).max(20).messages({
    "string.max": "رقم الهاتف يجب أن يكون 20 حرف على الأكثر",
  }),
  address: Joi.string().trim().allow("", null).max(500).messages({
    "string.max": "العنوان يجب أن يكون 500 حرف على الأكثر",
  }),
  default_lock_minutes: Joi.number().integer().min(1).max(180).messages({
    "number.min": "وقت القفل الافتراضي يجب أن يكون دقيقة واحدة على الأقل",
    "number.max": "وقت القفل الافتراضي يجب أن يكون 180 دقيقة على الأكثر",
  }),
  academic_year_status: Joi.string()
    .valid("active", "paused", "ended")
    .messages({
      "any.only": "حالة السنة الدراسية يجب أن تكون active أو paused أو ended",
    }),
  platform_status: Joi.string().valid("active", "paused").messages({
    "any.only": "حالة المنصة يجب أن تكون active أو paused",
  }),
})
  .min(1)
  .messages({
    "object.min": "يجب إرسال حقل واحد على الأقل للتعديل",
  });

// Update academic year status schema
const updateAcademicYearStatusSchema = Joi.object({
  academic_year_status: Joi.string()
    .valid("active", "paused", "ended")
    .required()
    .messages({
      "any.required": "حالة السنة الدراسية مطلوبة",
      "any.only": "حالة السنة الدراسية يجب أن تكون active أو paused أو ended",
    }),
});

module.exports = {
  updateSettingsSchema,
  updateAcademicYearStatusSchema,
};
