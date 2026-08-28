const { query } = require("../../../config/database");

async function createActivityLogsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      user_role TEXT NOT NULL,
      user_permissions TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at)`,
  );

  console.log("activity_logs table created");
}

module.exports = createActivityLogsTable;