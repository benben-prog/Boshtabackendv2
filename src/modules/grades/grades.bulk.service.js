const { query } = require("../../config/database");
const { cleanNumber } = require("../../utils/excelValidator");

const processGradesBulk = async (data) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  const names = [];
  const prices = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    try {
      const name = String(row.name || "").trim();
      const monthly_price = cleanNumber(row.monthly_price);

      if (!name) {
        throw new Error("اسم الصف مطلوب");
      }

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

      if (names.includes(name)) {
        throw new Error(`اسم الصف مكرر في الملف: ${name}`);
      }

      const existingGrade = await query(
        "SELECT id FROM grades WHERE name = $1 AND deleted = 0",
        [name],
      );
      if (existingGrade.rows[0]) {
        throw new Error(`الصف موجود مسبقاً: ${name}`);
      }

      names.push(name);
      prices.push(monthly_price);

      results.push({
        row_number: rowNumber,
        name,
        monthly_price,
        status: "success",
      });
      successCount++;
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

  if (names.length > 0) {
    try {
      const insertResult = await query(
        `INSERT INTO grades (name, monthly_price)
         SELECT unnest($1::text[]), unnest($2::numeric[])
         RETURNING id, name, monthly_price`,
        [names, prices],
      );

      const insertedGrades = insertResult.rows;
      results.forEach((result) => {
        const inserted = insertedGrades.find((g) => g.name === result.name);
        if (inserted) {
          result.grade_id = inserted.id;
        }
      });
    } catch (error) {
      console.error("Bulk insert error:", error);
      throw new Error(`فشل إدخال الصفوف: ${error.message}`);
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
