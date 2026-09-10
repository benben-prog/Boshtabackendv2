const express = require("express");
const routes = express.Router();
const optionController = require("./options.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createOptionSchema,
  updateOptionSchema,
} = require("../../middlewares/validations/option.validation");

// ============================================
// GETTERS
// ============================================

// Get options by question
routes.get("/question/:questionId", optionController.getOptionsByQuestionId);

// Get option by ID
routes.get("/:optionId", optionController.getOptionById);

// ============================================
// CREATE
// ============================================

routes.post("/", validate(createOptionSchema), optionController.createOption);

// ============================================
// UPDATE
// ============================================

routes.put(
  "/:optionId",
  validate(updateOptionSchema),
  optionController.updateOption,
);

// ============================================
// DELETE
// ============================================

routes.delete("/:optionId", optionController.deleteOption);

module.exports = routes;
