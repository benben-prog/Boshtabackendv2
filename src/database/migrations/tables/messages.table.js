const { query } = require("../../../config/database");

async function createMessagesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
      scheduled_at TIMESTAMP,
      sent_at TIMESTAMP,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_messages_student_id ON messages(student_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`,
  );

  console.log("messages table created");
}

module.exports = createMessagesTable;
