const { query } = require("../../../config/database");

async function createPaymentsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
      payment_mode VARCHAR(20) NOT NULL DEFAULT 'normal',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT payments_payment_mode_check 
        CHECK (payment_mode IN ('normal', 'custom'))
    )
  `);

  // Add payment_mode column for existing tables
  await query(`
    ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(20) NOT NULL DEFAULT 'normal'
  `);

  // Add check constraint for existing tables
  await query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'payments_payment_mode_check'
      ) THEN
        ALTER TABLE payments
        ADD CONSTRAINT payments_payment_mode_check 
        CHECK (payment_mode IN ('normal', 'custom'));
      END IF;
    END $$
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
  await query(
    `CREATE INDEX IF NOT EXISTS idx_payments_mode ON payments(payment_mode)`,
  );

  console.log("payments table created");
}

module.exports = createPaymentsTable;
