// src/database/migrations/tables/whatsapp.table.js
const { query } = require("../../../config/database");

async function createWhatsappMessagesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id SERIAL PRIMARY KEY,
      type VARCHAR(20) NOT NULL DEFAULT 'custom'
        CHECK (type IN ('welcome', 'absence', 'exam', 'payment', 'custom')),
      template TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sent_to TEXT NOT NULL DEFAULT 'parents' CHECK (sent_to IN ('parents', 'both')),
      delay INTEGER DEFAULT 45,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    ALTER TABLE whatsapp_messages
    ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'custom'
  `);

  await query(`
    ALTER TABLE whatsapp_messages
    ALTER COLUMN sent_to SET DEFAULT 'parents'
  `);

  await query(`
    ALTER TABLE whatsapp_messages
    ALTER COLUMN delay SET DEFAULT 45
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_is_active ON whatsapp_messages(is_active)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sent_to ON whatsapp_messages(sent_to)`,
  );
  await query(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_messages_type ON whatsapp_messages(type) WHERE type != 'custom'`,
  );

  console.log("whatsapp_messages table created successfully");
}

module.exports = createWhatsappMessagesTable;
