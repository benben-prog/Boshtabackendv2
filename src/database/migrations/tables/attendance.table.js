const { query } = require("../../../config/database");

async function createAttendanceTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      attendance_date DATE NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
      attendance_time TIME DEFAULT CURRENT_TIME,
      method TEXT DEFAULT 'manual' CHECK (method IN ('manual', 'barcode')),
      is_makeup INTEGER DEFAULT 0,
      makeup_group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(student_id, attendance_date)
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_attendance_group ON attendance(group_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_attendance_grade ON attendance(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_attendance_date_group ON attendance(attendance_date, group_id)`,
  );

  console.log("attendance table created");
}

module.exports = createAttendanceTable;
