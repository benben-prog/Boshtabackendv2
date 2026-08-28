const express = require("express");
const routes = express.Router();
const optionController = require("./options.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createOptionSchema,
  updateOptionSchema,
} = require("../../middlewares/validations/option.validation");

// Get options by question
routes.get("/question/:questionId", optionController.getOptionsByQuestionId);

// Get option by ID
routes.get("/:optionId", optionController.getOptionById);

// Create option
routes.post("/", validate(createOptionSchema), optionController.createOption);

// Update option
routes.put(
  "/:optionId",
  validate(updateOptionSchema),
  optionController.updateOption,
);

// Delete option
routes.delete("/:optionId", optionController.deleteOption);

module.exports = routes;
