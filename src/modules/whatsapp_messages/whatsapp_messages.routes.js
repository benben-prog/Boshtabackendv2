const express = require("express");
const routes = express.Router();
const whatsappController = require("./whatsapp_messages.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createTemplateSchema,
  updateTemplateSchema,
} = require("../../middlewares/validations/whatsapp.validation");

// Get all templates
routes.get("/", whatsappController.getAllTemplates);

// Get template by ID
routes.get("/:templateId", whatsappController.getTemplateById);

// Create template
routes.post("/", validate(createTemplateSchema), whatsappController.createTemplate);

// Update template
routes.put("/:templateId", validate(updateTemplateSchema), whatsappController.updateTemplate);

// Toggle active
routes.put("/:templateId/toggle", whatsappController.toggleTemplateActive);

module.exports = routes;