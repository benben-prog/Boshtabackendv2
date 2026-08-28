const { query } = require("../../../config/database");

async function createStudentExamsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS student_exams (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER NOT NULL REFERENCES online_exams(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      score DECIMAL(10,2) DEFAULT 0,
      started_at TIMESTAMP NOT NULL,
      submitted_at TIMESTAMP,
      UNIQUE(exam_id, student_id)
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_student_exams_exam_id ON student_exams(exam_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_student_exams_student_id ON student_exams(student_id)`,
  );

  console.log("student_exams table created");
}

module.exports = createStudentExamsTable;
