const { query } = require("../../../config/database");

async function createExamsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS exams (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
      total_degree DECIMAL(10,2) NOT NULL,
      exam_date DATE NOT NULL,
      notes TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_exams_grade_id ON exams(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_exams_group_id ON exams(group_id)`,
  );
  await query(`CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(exam_date)`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by)`,
  );
  await query(`CREATE INDEX IF NOT EXISTS idx_exams_deleted ON exams(deleted)`);

  console.log("exams table created");
}

module.exports = createExamsTable;
