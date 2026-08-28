const { query } = require("../../../config/database");

async function createAssignmentsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
      file_path VARCHAR(255),
      full_mark DECIMAL(10,2) NOT NULL,
      deadline TIMESTAMP NOT NULL,
      is_closed INTEGER DEFAULT 0,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignments_grade_id ON assignments(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignments_group_id ON assignments(group_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignments_created_by ON assignments(created_by)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignments_deadline ON assignments(deadline)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignments_deleted ON assignments(deleted)`,
  );

  console.log("assignments table created");
}

module.exports = createAssignmentsTable;
