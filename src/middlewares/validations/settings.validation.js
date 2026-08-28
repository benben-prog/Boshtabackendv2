const Joi = require("joi");

// Update settings
const updateSettingsSchema = Joi.object({
  center_name: Joi.string().trim().min(2).max(255).required(),
  phone: Joi.string().trim().allow("", null).max(20),
  address: Joi.string().trim().allow("", null).max(500),
  default_lock_minutes: Joi.number().integer().min(1).max(180).required(),
  academic_year_status: Joi.string()
    .valid("active", "paused", "ended")
    .required(),
  platform_status: Joi.string().valid("active", "paused").required(),
});

// Update academic year status
const updateAcademicYearStatusSchema = Joi.object({
  academic_year_status: Joi.string()
    .valid("active", "paused", "ended")
    .required(),
});

module.exports = {
  updateSettingsSchema,
  updateAcademicYearStatusSchema,
};
