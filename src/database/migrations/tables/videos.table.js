const { query } = require("../../../config/database");

async function createVideosTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      video_url VARCHAR(255) NOT NULL,
      file_url TEXT,
      thumbnail_url VARCHAR(255),
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_videos_grade_id ON videos(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_videos_created_by ON videos(created_by)`,
  );

  console.log("videos table created");
}

module.exports = createVideosTable;
