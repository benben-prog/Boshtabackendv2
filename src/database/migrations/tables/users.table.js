const { query } = require("../../../config/database");

async function createUsersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'assistant' CHECK (role IN ('super_admin', 'assistant', 'teacher')),
      permissions TEXT NOT NULL DEFAULT 'online_management' CHECK (permissions IN ('online_management', 'center_management')),
      profile_image VARCHAR(255),
      is_active INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_users_permissions ON users(permissions)`,
  );
  await query(`CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted)`);

  console.log("users table created");
}

module.exports = createUsersTable;
