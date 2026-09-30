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

    // 2. Ensure any inactive student is soft-deleted (deleted = 1)
    await query(`
      UPDATE students 
      SET deleted = 1 
      WHERE (is_active = FALSE OR deactivation_reason IS NOT NULL) AND deleted = 0;
    `);

    // Ensure any soft-deleted student has is_active = FALSE
    await query(`
      UPDATE students 
      SET is_active = FALSE,
          deactivation_reason = COALESCE(deactivation_reason, 'تم إلغاء التفعيل بواسطة الإدارة')
      WHERE deleted = 1 AND is_active = TRUE;
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
