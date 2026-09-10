// src/modules/groups/groups.bulk.service.js
const { query } = require("../../config/database");
const groupQueries = require("./groups.queries");
const {
  cleanTime,
  validateTime,
  validateTimeRange,
} = require("../../utils/excelValidator");

// ============================================
// PROCESS BULK GROUPS (OPTIMIZED)
// ============================================

const processGroupsBulk = async (data) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  // Step 1: Extract unique grade names
  const gradeNames = new Set();
  data.forEach((row) => {
    const gradeName = String(row.grade_name || "").trim();
    if (gradeName) gradeNames.add(gradeName);
  });

  // Step 2: Fetch all grades in one query
  const gradesResult =
    gradeNames.size > 0
      ? await query(groupQueries.getGradesByNames, [Array.from(gradeNames)])
      : { rows: [] };

  const gradesMap = new Map(gradesResult.rows.map((g) => [g.name, g.id]));

  // Step 3: Validate all rows first
  const validRows = [];
  const seenGroups = new Set(); // To detect duplicates within file

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

      // Validate required fields
      if (!name) throw new Error("اسم المجموعة مطلوب");
      if (!grade_name) throw new Error("اسم المرحلة الدراسية مطلوب");
      if (!days) throw new Error("الأيام مطلوبة");

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

      // Check grade exists
      const gradeId = gradesMap.get(grade_name);
      if (!gradeId) {
        throw new Error(`المرحلة الدراسية غير موجودة: ${grade_name}`);
      }

      // Check duplicate within file
      const groupKey = `${name}||${gradeId}`;
      if (seenGroups.has(groupKey)) {
        throw new Error(`المجموعة مكررة في الملف: ${name} في ${grade_name}`);
      }
      seenGroups.add(groupKey);

      validRows.push({
        row_number: rowNumber,
        name,
        grade_id: gradeId,
        grade_name,
        days,
        start_time,
        end_time,
        room,
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

  // Step 4: Check existing groups in DB (single query)
  if (validRows.length > 0) {
    const groupNames = validRows.map((r) => r.name);
    const gradeIds = validRows.map((r) => r.grade_id);

    const existingGroupsResult = await query(groupQueries.checkExistingGroups, [
      groupNames,
      gradeIds,
    ]);

    const existingKeys = new Set(
      existingGroupsResult.rows.map((g) => `${g.name}||${g.grade_id}`),
    );

    // Filter out existing groups
    const finalValidRows = [];
    for (const row of validRows) {
      const key = `${row.name}||${row.grade_id}`;
      if (existingKeys.has(key)) {
        errors.push({
          row_number: row.row_number,
          name: row.name,
          error: `المجموعة موجودة مسبقاً: ${row.name} في ${row.grade_name}`,
          status: "error",
        });
        errorCount++;
      } else {
        finalValidRows.push(row);
      }
    }

    // Step 5: Bulk insert
    if (finalValidRows.length > 0) {
      try {
        const names = finalValidRows.map((r) => r.name);
        const gradeIdsArr = finalValidRows.map((r) => r.grade_id);
        const daysList = finalValidRows.map((r) => r.days);
        const startTimes = finalValidRows.map((r) => r.start_time);
        const endTimes = finalValidRows.map((r) => r.end_time);
        const rooms = finalValidRows.map((r) => r.room);

        const insertResult = await query(groupQueries.bulkInsertGroups, [
          names,
          gradeIdsArr,
          daysList,
          startTimes,
          endTimes,
          rooms,
        ]);

        const insertedGroups = insertResult.rows;

        // Add success records
        insertedGroups.forEach((group) => {
          const rowData = finalValidRows.find(
            (r) => r.name === group.name && r.grade_id === group.grade_id,
          );
          results.push({
            row_number: rowData?.row_number,
            group_id: group.id,
            name: group.name,
            grade_id: group.grade_id,
            grade_name: rowData?.grade_name,
            status: "success",
          });
          successCount++;
        });
      } catch (error) {
        console.error("Bulk insert error:", error);
        throw new Error(`فشل إدخال المجموعات: ${error.message}`);
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
  processGroupsBulk,
};
