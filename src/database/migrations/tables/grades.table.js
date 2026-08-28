const { query } = require("../../../config/database");

async function createGradesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS grades (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      monthly_price DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_grades_name ON grades(name)`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_grades_deleted ON grades(deleted)`,
  );

  await query(
    `CREATE INDEX IF NOT EXISTS idx_grades_name_deleted ON grades(name, deleted)`,
  );

  console.log("grades table created");
}

module.exports = createGradesTable;
