const { query } = require("../../../config/database");

async function createAssignmentSubmissionsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      file_path VARCHAR(255) NOT NULL,
      score DECIMAL(10,2),
      feedback TEXT,
      reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      submitted_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      reviewed_at TIMESTAMP
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id)`,
  );

  console.log("assignment_submissions table created");
}

module.exports = createAssignmentSubmissionsTable;
