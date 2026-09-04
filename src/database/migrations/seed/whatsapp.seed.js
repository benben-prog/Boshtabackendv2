// src/database/migrations/seed/whatsapp.seed.js
const { query } = require("../../../config/database");

async function seedWhatsappTemplates() {
  const templates = [
    {
      type: "welcome",
      template: "welcome",
      sent_to: "parents",
      delay: 45,
    },
    {
      type: "absence",
      template: "absent",
      sent_to: "parents",
      delay: 45,
    },
    {
      type: "payment",
      template: "payment",
      sent_to: "parents",
      delay: 45,
    },
    {
      type: "exam",
      template: "exam",
      sent_to: "parents",
      delay: 45,
    },
  ];

  for (const template of templates) {
    await query(
      `
      INSERT INTO whatsapp_messages (type, template, is_active, sent_to, delay)
      VALUES ($1, $2, 1, $3, $4)
      ON CONFLICT (type) 
      DO UPDATE SET 
        template = EXCLUDED.template,
        sent_to = EXCLUDED.sent_to,
        delay = EXCLUDED.delay
    `,
      [template.type, template.template, template.sent_to, template.delay]
    );
  }

  console.log("WhatsApp templates seeded");
}

module.exports = seedWhatsappTemplates;