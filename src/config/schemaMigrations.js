const { query } = require("./database");

/**
 * Automatically applies non-destructive idempotent schema migrations on startup.
 */
async function runSchemaMigrations() {
  try {
    // 1. Ensure students has is_active and deactivation_reason
    await query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
    `);

    await query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS deactivation_reason TEXT DEFAULT NULL;
    `);

    // 2. Ensure any legacy soft-deleted student (deleted = 1) is active/inactive without hiding payments
    await query(`
      UPDATE students 
      SET is_active = FALSE, 
          deactivation_reason = COALESCE(deactivation_reason, 'غياب متكرر (3 حصص متتالية)'), 
          deleted = 0 
      WHERE deleted = 1;
    `);

    // 3. Ensure exam_results has is_absent
    await query(`
      ALTER TABLE exam_results 
      ADD COLUMN IF NOT EXISTS is_absent BOOLEAN DEFAULT FALSE;
    `);

    // 4. Ensure student_exams has is_absent
    await query(`
      ALTER TABLE student_exams 
      ADD COLUMN IF NOT EXISTS is_absent BOOLEAN DEFAULT FALSE;
    `);

    console.log("[DB] Schema migrations checked and up-to-date.");
  } catch (error) {
    console.error("[DB] Warning: Schema migration check failed:", error.message);
  }
}

module.exports = {
  runSchemaMigrations,
};
