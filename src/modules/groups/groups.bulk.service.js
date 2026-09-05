const { query } = require("../../config/database");
const {
  cleanTime,
  validateTime,
  validateTimeRange,
} = require("../../utils/excelValidator");

const processGroupsBulk = async (data) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  const names = [];
  const gradeIds = [];
  const daysList = [];
  const startTimes = [];
  const endTimes = [];
  const rooms = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    try {
      const name = String(row.name || "").trim();
      const grade_name = String(row.grade_name || "").trim();
      const days = String(row.days || "").trim();
      const start_time = cleanTime(row.start_time);
      const end_time = cleanTime(row.end_time);
      const room = row.room ? String(row.room).trim() : null;

      if (!name) {
        throw new Error("اسم المجموعة مطلوب");
      }

      if (!grade_name) {
        throw new Error("اسم الصف مطلوب");
      }

      if (!days) {
        throw new Error("الأيام مطلوبة");
      }

      if (!start_time || !validateTime(start_time)) {
        throw new Error(`وقت البداية غير صحيح: ${row.start_time}`);
      }

      if (!end_time || !validateTime(end_time)) {
        throw new Error(`وقت النهاية غير صحيح: ${row.end_time}`);
      }

      if (!validateTimeRange(start_time, end_time)) {
        throw new Error(
          `وقت البداية (${start_time}) يجب أن يكون قبل وقت النهاية (${end_time})`,
        );
      }

      const gradeResult = await query(
        "SELECT id FROM grades WHERE name = $1 AND deleted = 0",
        [grade_name],
      );
      const grade = gradeResult.rows[0];

      if (!grade) {
        throw new Error(`الصف غير موجود: ${grade_name}`);
      }

      const duplicateIndex = names.findIndex(
        (n, idx) => n === name && gradeIds[idx] === grade.id,
      );
      if (duplicateIndex !== -1) {
        throw new Error(`المجموعة مكررة في الملف: ${name} في صف ${grade_name}`);
      }

      const existingGroup = await query(
        "SELECT id FROM groups WHERE name = $1 AND grade_id = $2 AND deleted = 0",
        [name, grade.id],
      );
      if (existingGroup.rows[0]) {
        throw new Error(`المجموعة موجودة مسبقاً: ${name} في صف ${grade_name}`);
      }

      names.push(name);
      gradeIds.push(grade.id);
      daysList.push(days);
      startTimes.push(start_time);
      endTimes.push(end_time);
      rooms.push(room);

      results.push({
        row_number: rowNumber,
        name,
        grade_name,
        days,
        start_time,
        end_time,
        room,
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
        `INSERT INTO groups (name, grade_id, days, start_time, end_time, room)
         SELECT unnest($1::text[]), unnest($2::int[]), unnest($3::text[]), unnest($4::time[]), unnest($5::time[]), unnest($6::text[])
         RETURNING id, name, grade_id`,
        [names, gradeIds, daysList, startTimes, endTimes, rooms],
      );

      const insertedGroups = insertResult.rows;
      results.forEach((result) => {
        const inserted = insertedGroups.find((g) => g.name === result.name);
        if (inserted) {
          result.group_id = inserted.id;
        }
      });
    } catch (error) {
      console.error("Bulk insert error:", error);
      throw new Error(`فشل إدخال المجموعات: ${error.message}`);
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
  processGroupsBulk,
};
