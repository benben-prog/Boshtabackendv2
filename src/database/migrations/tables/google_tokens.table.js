const { query } = require("../../../config/database");

async function createGoogleTokensTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS google_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      scope TEXT,
      token_type TEXT DEFAULT 'Bearer',
      expiry_date BIGINT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_google_tokens_user_id ON google_tokens(user_id)`,
  );

  console.log("google_tokens table created");
}

module.exports = createGoogleTokensTable;
