/* ============================================
   WHATSAPP MESSAGES QUERIES
   ============================================ */

// Create whatsapp template name
const createTemplate = `
INSERT INTO whatsapp_messages (template, sent_to, delay)
VALUES ($1, $2, $3)
RETURNING *
`;

// Get all templates
const getAllTemplates = `
SELECT 
  id,
  template,
  is_active,
  sent_to,
  delay,
  created_at
FROM whatsapp_messages
ORDER BY created_at DESC
`;

// Get template by ID
const getTemplateById = `
SELECT 
  id,
  template,
  is_active,
  sent_to,
  delay,
  created_at
FROM whatsapp_messages
WHERE id = $1
`;

// Update template
const updateTemplate = `
UPDATE whatsapp_messages
SET 
  template = $2,
  sent_to = $3,
  delay = $4
WHERE id = $1
RETURNING *
`;

// Toggle template active status
const toggleTemplateActive = `
UPDATE whatsapp_messages
SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
WHERE id = $1
RETURNING id, is_active
`;

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  toggleTemplateActive,
};