const { query } = require("../../../config/database");

async function createStudentsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      barcode TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT DEFAULT NULL,
      parent_phone TEXT DEFAULT NULL,
      password TEXT DEFAULT NULL,
      parent_token TEXT UNIQUE NOT NULL,
      profile_image VARCHAR(255),
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_grade_id ON students(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_group_id ON students(group_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_parent_phone ON students(parent_phone)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_barcode ON students(barcode)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_parent_token ON students(parent_token)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_deleted ON students(deleted)`,
  );

  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_barcode_deleted ON students(barcode, deleted)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_students_phone_not_null ON students(phone) WHERE phone IS NOT NULL`,
  );

  console.log("students table created");
}

module.exports = createStudentsTable;
