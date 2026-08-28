const { query } = require("../../../config/database");

async function createExamResultsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS exam_results (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      degree DECIMAL(10,2) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(student_id, exam_id)
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_exam_results_exam_id ON exam_results(exam_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id)`,
  );

  console.log("exam_results table created");
}

module.exports = createExamResultsTable;
