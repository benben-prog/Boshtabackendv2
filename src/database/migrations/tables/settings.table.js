const { query } = require("../../../config/database");

async function createSettingsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      center_name TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      default_lock_minutes INTEGER DEFAULT 30,
      academic_year_status TEXT DEFAULT 'active' CHECK (academic_year_status IN ('active', 'paused', 'ended')),
      platform_status TEXT DEFAULT 'active' CHECK (platform_status IN ('active', 'paused')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log("settings table created");
}

module.exports = createSettingsTable;
