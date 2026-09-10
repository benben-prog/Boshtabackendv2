const { query } = require("../../config/database");
const { cleanNumber } = require("../../utils/excelValidator");

// ============================================
// PROCESS BULK GRADES
// ============================================

const processGradesBulk = async (data) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  // ============================================
  // Step 1: Validate all rows
  // ============================================

  const validRows = [];
  const usedNames = new Set();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    try {
      const name = String(row.name || "").trim();
      const monthly_price = cleanNumber(row.monthly_price);

      // Validate name
      if (!name) {
        throw new Error("اسم الصف مطلوب");
      }

      // Validate monthly_price
      if (
        monthly_price === null ||
        monthly_price === undefined ||
        isNaN(monthly_price)
      ) {
        throw new Error(`السعر غير صحيح: ${row.monthly_price}`);
      }

      if (monthly_price <= 0) {
        throw new Error(`السعر يجب أن يكون أكبر من صفر: ${monthly_price}`);
      }

      // Check duplicate in file
      if (usedNames.has(name)) {
        throw new Error(`اسم الصف مكرر في الملف: ${name}`);
      }

      usedNames.add(name);

      validRows.push({
        row_number: rowNumber,
        name,
        monthly_price,
      });
    } catch (error) {
      errors.push({
        row_number: rowNumber,
        name: row.name || null,
        error: error.message,
        status: "error",
      });
      errorCount++;
    }
  }

  // ============================================
  // Step 2: Check existing grades in DB
  // ============================================

  if (validRows.length > 0) {
    const names = validRows.map((r) => r.name);

    const existingResult = await query(
      "SELECT name FROM grades WHERE name = ANY($1) AND deleted = 0",
      [names],
    );

    const existingNames = new Set(existingResult.rows.map((g) => g.name));

    // Filter out existing
    const finalValidRows = [];
    for (const row of validRows) {
      if (existingNames.has(row.name)) {
        errors.push({
          row_number: row.row_number,
          name: row.name,
          error: `الصف موجود مسبقاً: ${row.name}`,
          status: "error",
        });
        errorCount++;
      } else {
        finalValidRows.push(row);
      }
    }

    // ============================================
    // Step 3: Bulk insert
    // ============================================

    if (finalValidRows.length > 0) {
      try {
        const namesArr = finalValidRows.map((r) => r.name);
        const pricesArr = finalValidRows.map((r) => r.monthly_price);

        const insertResult = await query(
          `INSERT INTO grades (name, monthly_price)
           SELECT unnest($1::text[]), unnest($2::numeric[])
           RETURNING id, name, monthly_price`,
          [namesArr, pricesArr],
        );

        const insertedGrades = insertResult.rows;

        // Build success records
        for (const row of finalValidRows) {
          const inserted = insertedGrades.find((g) => g.name === row.name);

          results.push({
            row_number: row.row_number,
            grade_id: inserted?.id || null,
            name: row.name,
            monthly_price: row.monthly_price,
            status: "success",
          });
          successCount++;
        }
      } catch (error) {
        console.error("Bulk insert error:", error);
        throw new Error(`فشل إدخال الصفوف: ${error.message}`);
      }
    }
  }

  return {
    total_rows: data.length,
    success_count: successCount,
    error_count: errorCount,
    success_records: results,
    error_records: errors,
  };
};

module.exports = {
  processGradesBulk,
};
