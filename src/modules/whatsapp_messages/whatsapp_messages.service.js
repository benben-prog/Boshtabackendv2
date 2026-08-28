const { query } = require("../../config/database");
const whatsappQueries = require("./whatsapp_messages.queries");

// Create template
const createTemplate = async (templateData) => {
  const { template, sent_to, delay = 60 } = templateData;
  const result = await query(whatsappQueries.createTemplate, [
    template,
    sent_to,
    delay,
  ]);
  return result.rows[0];
};

// Get all templates
const getAllTemplates = async () => {
  const result = await query(whatsappQueries.getAllTemplates);
  return result.rows;
};

// Get template by ID
const getTemplateById = async (templateId) => {
  const result = await query(whatsappQueries.getTemplateById, [templateId]);
  return result.rows[0];
};

// Update template
const updateTemplate = async (templateId, templateData) => {
  const existing = await query("SELECT * FROM whatsapp_messages WHERE id = $1", [templateId]);
  if (!existing.rows[0]) return null;

  const updated = {
    template: templateData.template ?? existing.rows[0].template,
    sent_to: templateData.sent_to ?? existing.rows[0].sent_to,
    delay: templateData.delay ?? existing.rows[0].delay,
  };

  const result = await query(whatsappQueries.updateTemplate, [
    templateId,
    updated.template,
    updated.sent_to,
    updated.delay,
  ]);
  return result.rows[0];
};

// Toggle template active
const toggleTemplateActive = async (templateId) => {
  const result = await query(whatsappQueries.toggleTemplateActive, [templateId]);
  return result.rows[0];
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  toggleTemplateActive,
};