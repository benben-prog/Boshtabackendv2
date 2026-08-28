const express = require("express");
const routes = express.Router();
const settingsController = require("./settings.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  updateSettingsSchema,
  updateAcademicYearStatusSchema,
} = require("../../middlewares/validations/settings.validation");

// Get settings
routes.get("/", settingsController.getSettings);

// Update settings
routes.put(
  "/",
  validate(updateSettingsSchema),
  settingsController.updateSettings,
);

// Toggle platform status
routes.put("/toggle-platform", settingsController.togglePlatformStatus);

// Update academic year status
routes.put(
  "/academic-year",
  validate(updateAcademicYearStatusSchema),
  settingsController.updateAcademicYearStatus,
);

module.exports = routes;
