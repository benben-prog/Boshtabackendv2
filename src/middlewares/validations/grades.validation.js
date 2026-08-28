const Joi = require("joi");

// Create a new grade
const createGradeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  monthlyPrice: Joi.number().positive().required(),
});

// Update a grade
const updateGradeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  monthlyPrice: Joi.number().positive().required(),
});

// Grade ID validation (for params)
const gradeIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createGradeSchema,
  updateGradeSchema,
  gradeIdSchema,
};
