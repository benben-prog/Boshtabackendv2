const { query } = require("../../../config/database");

async function createPaymentsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(
    `CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date)`,
  );

  console.log("payments table created");
}

module.exports = createPaymentsTable;
