const Joi = require("joi");

// Create exam result
const createExamResultSchema = Joi.object({
  exam_id: Joi.number().integer().positive().required(),
  student_id: Joi.number().integer().positive().required(),
  degree: Joi.number().min(0).required(),
  notes: Joi.string().allow("", null).max(1000),
});

// Upsert exam result
const upsertExamResultSchema = Joi.object({
  exam_id: Joi.number().integer().positive().required(),
  student_id: Joi.number().integer().positive().required(),
  degree: Joi.number().min(0).required(),
  notes: Joi.string().allow("", null).max(1000),
});

// Upsert batch
const upsertBatchSchema = Joi.object({
  records: Joi.array()
    .items(
      Joi.object({
        exam_id: Joi.number().integer().positive().required(),
        student_id: Joi.number().integer().positive().required(),
        degree: Joi.number().min(0).required(),
        notes: Joi.string().allow("", null).max(1000),
      }),
    )
    .min(1)
    .required(),
});

// Update exam result
const updateExamResultSchema = Joi.object({
  degree: Joi.number().min(0).required(),
  notes: Joi.string().allow("", null).max(1000),
});

module.exports = {
  createExamResultSchema,
  upsertExamResultSchema,
  upsertBatchSchema,
  updateExamResultSchema,
};