const { query } = require("../../../config/database");

async function createAiTable() {
  // 1. Table for daily message and file usage quotas
  await query(`
    CREATE TABLE IF NOT EXISTS ai_daily_usage (
      id SERIAL PRIMARY KEY,
      user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'assistant', 'teacher', 'super_admin')),
      user_id INTEGER NOT NULL,
      usage_date DATE DEFAULT CURRENT_DATE,
      message_count INTEGER DEFAULT 0,
      file_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT uq_ai_daily_usage UNIQUE (user_type, user_id, usage_date)
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_ai_daily_usage_lookup 
    ON ai_daily_usage(user_type, user_id, usage_date)
  `);

  // 2. Table for chat messages and conversation context
  await query(`
    CREATE TABLE IF NOT EXISTS ai_messages (
      id SERIAL PRIMARY KEY,
      user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'assistant', 'teacher', 'super_admin')),
      user_id INTEGER NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'model')),
      message TEXT NOT NULL,
      file_name VARCHAR(255),
      file_path VARCHAR(500),
      file_mime_type VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_ai_messages_user 
    ON ai_messages(user_type, user_id, created_at DESC)
  `);

  console.log("ai tables (ai_daily_usage, ai_messages) created successfully");
}

module.exports = createAiTable;
