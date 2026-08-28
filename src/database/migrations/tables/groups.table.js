const { query } = require("../../../config/database");

async function createGroupsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      days TEXT,
      start_time TIME,
      end_time TIME,
      room TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_groups_grade_id ON groups(grade_id)`,
  );
  await query(`CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name)`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_groups_deleted ON groups(deleted)`,
  );

  await query(
    `CREATE INDEX IF NOT EXISTS idx_groups_name_grade ON groups(name, grade_id, deleted)`,
  );

  console.log("groups table created");
}

module.exports = createGroupsTable;
