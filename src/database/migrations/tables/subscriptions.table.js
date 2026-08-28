const { query } = require("../../../config/database");

async function createSubscriptionsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      month VARCHAR(7) NOT NULL,
      required_amount DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
      created_at TIMESTAMP DEFAULT NOW(),
      deleted INTEGER DEFAULT 0,
      UNIQUE(student_id, month)
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_subscriptions_student_id ON subscriptions(student_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_subscriptions_month ON subscriptions(month)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_subscriptions_deleted ON subscriptions(deleted)`,
  );

  console.log("subscriptions table created");
}

module.exports = createSubscriptionsTable;
