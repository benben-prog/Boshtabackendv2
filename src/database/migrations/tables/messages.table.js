const { query } = require("../../../config/database");

async function createMessagesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'custom',
      recipient VARCHAR(20) DEFAULT 'parent',
      status TEXT DEFAULT 'pending',
      params JSONB,
      ref_key VARCHAR(100) UNIQUE,
      template_id INTEGER REFERENCES whatsapp_messages(id) ON DELETE SET NULL,
      attempts INTEGER DEFAULT 0,
      error_message TEXT,
      message_id VARCHAR(255),
      scheduled_at TIMESTAMP,
      sent_at TIMESTAMP,
      delivered_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Update status check constraint to include scheduled and read
  await query(`
    DO $$
    BEGIN
      -- Drop old constraint if exists
      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'messages_status_check'
      ) THEN
        ALTER TABLE messages DROP CONSTRAINT messages_status_check;
      END IF;
      
      -- Add new constraint with all statuses
      ALTER TABLE messages 
      ADD CONSTRAINT messages_status_check 
      CHECK (status IN ('pending', 'scheduled', 'sent', 'failed', 'delivered', 'read'));
    EXCEPTION
      WHEN others THEN
        RAISE NOTICE 'Could not update status constraint: %', SQLERRM;
    END $$;
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
  await query(
    `CREATE INDEX IF NOT EXISTS idx_messages_ref_key ON messages(ref_key)`,
  );
  await query(`CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type)`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient)`,
  );

  console.log("messages table created");
}

module.exports = createMessagesTable;
