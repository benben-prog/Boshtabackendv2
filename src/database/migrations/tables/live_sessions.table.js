const { query } = require("../../../config/database");

async function createLiveSessionsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS live_sessions (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      duration_minutes INTEGER NOT NULL,
      meet_link VARCHAR(500) NOT NULL,
      google_event_id VARCHAR(255),
      target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('grade', 'group', 'student')),
      grade_id INTEGER REFERENCES grades(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      material_file_path VARCHAR(255),
      material_name VARCHAR(255),
      recording_url VARCHAR(500),
      status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_sessions_grade_id ON live_sessions(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_sessions_group_id ON live_sessions(group_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_sessions_student_id ON live_sessions(student_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_sessions_start_time ON live_sessions(start_time)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_sessions_deleted ON live_sessions(deleted)`,
  );

  console.log("live_sessions table created");
}

module.exports = createLiveSessionsTable;
