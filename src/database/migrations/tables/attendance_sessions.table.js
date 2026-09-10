// src/database/migrations/tables/attendance_sessions.table.js
const { query } = require("../../../config/database");

async function createAttendanceSessionsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id SERIAL PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      started_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      started_at TIMESTAMP DEFAULT NOW(),
      lock_at TIMESTAMP,
      ended_at TIMESTAMP,
      is_makeup_enabled INTEGER DEFAULT 0,
      attendance_locked INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'locked', 'closed')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Add attendance_locked column for existing tables
  await query(`
    ALTER TABLE attendance_sessions
    ADD COLUMN IF NOT EXISTS attendance_locked INTEGER DEFAULT 0
  `);

  // Drop old unique index if exists
  await query(`
    DROP INDEX IF EXISTS unique_session_per_group_day
  `);

  // Create new unique index with Egypt timezone
  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_session_per_group_day
    ON attendance_sessions(group_id, DATE(started_at AT TIME ZONE 'Africa/Cairo'))
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_sessions_group ON attendance_sessions(group_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_sessions_status ON attendance_sessions(status)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_sessions_lock ON attendance_sessions(lock_at)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_sessions_date ON attendance_sessions(DATE(started_at))`,
  );

  console.log("attendance_sessions table created");
}

module.exports = createAttendanceSessionsTable;
