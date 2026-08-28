const { query } = require("../../../config/database");

async function createPlaylistsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS playlists (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
      thumbnail_url VARCHAR(255),
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_playlists_grade_id ON playlists(grade_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_playlists_created_by ON playlists(created_by)`,
  );

  console.log("playlists table created");
}

module.exports = createPlaylistsTable;
