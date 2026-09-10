const Joi = require("joi");

// Common validation helpers
const stringRequired = (min = 1, max = 255) => 
  Joi.string().trim().min(min).max(max).required();

const stringOptional = (min = 1, max = 255) => 
  Joi.string().trim().min(min).max(max).allow("", null);

const emailRequired = () => 
  Joi.string().trim().email().required();

const phoneOptional = () => 
  Joi.string().trim().pattern(/^01[0125][0-9]{8}$/).allow("", null);

const numberRequired = (min = 0, max = 999999) => 
  Joi.number().min(min).max(max).required();

const numberOptional = (min = 0, max = 999999) => 
  Joi.number().min(min).max(max).allow(null);

const dateRequired = () => 
  Joi.date().iso().required();

const dateOptional = () => 
  Joi.date().iso().allow(null);

const idRequired = () => 
  Joi.number().integer().positive().required();

const idOptional = () => 
  Joi.number().integer().positive().allow(null);

// Common messages
const messages = {
  "any.required": "هذا الحقل مطلوب",
  "string.empty": "هذا الحقل لا يمكن أن يكون فارغاً",
  "string.min": "الحد الأدنى للطول هو {#limit} حرف",
  "string.max": "الحد الأقصى للطول هو {#limit} حرف",
  "number.base": "يجب أن يكون رقماً",
  "number.min": "الحد الأدنى للقيمة هو {#limit}",
  "number.max": "الحد الأقصى للقيمة هو {#limit}",
  "date.base": "صيغة التاريخ غير صحيحة",
  "any.only": "القيمة غير صالحة",
};

module.exports = {
  stringRequired,
  stringOptional,
  emailRequired,
  phoneOptional,
  numberRequired,
  numberOptional,
  dateRequired,
  dateOptional,
  idRequired,
  idOptional,
  messages,
};