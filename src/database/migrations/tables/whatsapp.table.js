// backend/.../migrations/create_whatsapp_messages_table.js
const { query } = require("../../../config/database");

async function createWhatsappMessagesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id SERIAL PRIMARY KEY,
      type VARCHAR(20) NOT NULL DEFAULT 'custom'
        CHECK (type IN ('welcome', 'absence', 'exam', 'payment', 'custom')),
      template TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sent_to TEXT NOT NULL CHECK (sent_to IN ('students', 'parents', 'both')),
      delay INTEGER DEFAULT 60,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ✅ لو الجدول كان موجود قبل كده من غير عمود type
  await query(`
    ALTER TABLE whatsapp_messages
    ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'custom'
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
  await query(
    `CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_updated_at ON whatsapp_messages(updated_at)`,
  );

  console.log("whatsapp_messages table created successfully");
}

module.exports = createWhatsappMessagesTable;
