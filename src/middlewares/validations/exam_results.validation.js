const Joi = require("joi");

// Create exam result schema
const createExamResultSchema = Joi.object({
  exam_id: Joi.number().integer().positive().required().messages({
    "any.required": "الامتحان مطلوب",
  }),
  student_id: Joi.number().integer().positive().required().messages({
    "any.required": "الطالب مطلوب",
  }),
  degree: Joi.number().min(0).required().messages({
    "any.required": "الدرجة مطلوبة",
    "number.min": "الدرجة لا يمكن أن تكون سالبة",
    "number.base": "الدرجة يجب أن تكون رقماً",
  }),
  notes: Joi.string().allow("", null).max(1000),
});

// Upsert exam result schema
const upsertExamResultSchema = Joi.object({
  exam_id: Joi.number().integer().positive().required().messages({
    "any.required": "الامتحان مطلوب",
  }),
  student_id: Joi.number().integer().positive().required().messages({
    "any.required": "الطالب مطلوب",
  }),
  degree: Joi.number().min(0).required().messages({
    "any.required": "الدرجة مطلوبة",
    "number.min": "الدرجة لا يمكن أن تكون سالبة",
    "number.base": "الدرجة يجب أن تكون رقماً",
  }),
  notes: Joi.string().allow("", null).max(1000),
});

// Upsert batch schema
const upsertBatchSchema = Joi.object({
  records: Joi.array()
    .items(
      Joi.object({
        student_id: Joi.number().integer().positive().required().messages({
          "any.required": "الطالب مطلوب",
        }),
        degree: Joi.number().min(0).required().messages({
          "any.required": "الدرجة مطلوبة",
          "number.min": "الدرجة لا يمكن أن تكون سالبة",
        }),
        notes: Joi.string().allow("", null).max(1000),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "يجب إرسال سجل واحد على الأقل",
      "any.required": "السجلات مطلوبة",
    }),
});

// Update exam result schema
const updateExamResultSchema = Joi.object({
  degree: Joi.number().min(0).required().messages({
    "any.required": "الدرجة مطلوبة",
    "number.min": "الدرجة لا يمكن أن تكون سالبة",
    "number.base": "الدرجة يجب أن تكون رقماً",
  }),
  notes: Joi.string().allow("", null).max(1000),
});

module.exports = {
  createExamResultSchema,
  upsertExamResultSchema,
  upsertBatchSchema,
  updateExamResultSchema,
};
