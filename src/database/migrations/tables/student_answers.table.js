const { query } = require("../../../config/database");

async function createStudentAnswersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS student_answers (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER NOT NULL REFERENCES online_exams(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      selected_option_id INTEGER REFERENCES options(id) ON DELETE SET NULL,
      file_path VARCHAR(255),
      is_correct INTEGER,
      submitted_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(exam_id, student_id, question_id)
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_student_answers_exam_id ON student_answers(exam_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_student_answers_student_id ON student_answers(student_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_student_answers_question_id ON student_answers(question_id)`,
  );

  console.log("student_answers table created");
}

module.exports = createStudentAnswersTable;
