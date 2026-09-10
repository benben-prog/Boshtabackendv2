// src/modules/students/students.bulk.service.js
const { query } = require("../../config/database");
const {
  validateEgyptianPhone,
  cleanPhone,
} = require("../../utils/excelValidator");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const stdQr = require("./students.queries");

// ============================================
// CONSTANTS
// ============================================

const PARENT_TOKEN_LENGTH = 10;
const PARENT_TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PARENT_TOKEN_MAX_RETRIES = 3;

// ============================================
// HELPER: Generate parent token
// ============================================

const generateParentToken = () => {
  let token = "";
  for (let i = 0; i < PARENT_TOKEN_LENGTH; i++) {
    token += PARENT_TOKEN_CHARS.charAt(
      Math.floor(Math.random() * PARENT_TOKEN_CHARS.length),
    );
  }
  return token;
};

// ============================================
// HELPER: Generate unique tokens for multiple students
// ============================================

const generateUniqueTokens = (count, existingTokens = new Set()) => {
  const tokens = [];
  const usedTokens = new Set(existingTokens);

  for (let i = 0; i < count; i++) {
    let token;
    let attempts = 0;

    do {
      token = generateParentToken();
      attempts++;
    } while (usedTokens.has(token) && attempts < PARENT_TOKEN_MAX_RETRIES);

    tokens.push(token);
    usedTokens.add(token);
  }

  return tokens;
};

// ============================================
// PROCESS BULK STUDENTS (OPTIMIZED)
// ============================================

const processStudentsBulk = async (data) => {
  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  // Column mapping (Arabic to English)
  const columnMapping = {
    "الاسم الكامل": "full_name",
    الباركود: "barcode",
    "المرحلة الدراسية": "grade_name",
    المجموعة: "group_name",
    "رقم الجوال": "phone",
    "رقم ولي الامر": "parent_phone",
    ملاحظات: "notes",
  };

  // Step 1: Map all columns first
  const mappedData = data.map((row) => {
    const newRow = {};
    Object.keys(row).forEach((key) => {
      const englishKey = columnMapping[key] || key;
      newRow[englishKey] = row[key];
    });
    return newRow;
  });

  // Step 2: Extract all unique lookups
  const allBarcodes = [];
  const allGradeNames = new Set();
  const allGroupKeys = new Set();

  mappedData.forEach((row, index) => {
    const barcode = String(row.barcode || "").trim();
    const gradeName = String(row.grade_name || "").trim();
    const groupName = String(row.group_name || "").trim();

    if (barcode) allBarcodes.push(barcode);
    if (gradeName) allGradeNames.add(gradeName);
    if (gradeName && groupName) allGroupKeys.add(`${gradeName}||${groupName}`);
  });

  // Step 3: Fetch all lookups in parallel
  const [existingBarcodesResult, gradesResult, existingTokensResult] =
    await Promise.all([
      allBarcodes.length > 0
        ? query(stdQr.checkExistingBarcodes, [allBarcodes])
        : Promise.resolve({ rows: [] }),
      allGradeNames.size > 0
        ? query(stdQr.getGradesByNames, [Array.from(allGradeNames)])
        : Promise.resolve({ rows: [] }),
      query(stdQr.checkExistingParentTokens, [
        // Generate a batch of candidate tokens
        Array.from({ length: mappedData.length * 2 }, generateParentToken),
      ]),
    ]);

  // Build lookup maps
  const existingBarcodes = new Set(
    existingBarcodesResult.rows.map((r) => r.barcode),
  );
  const existingTokens = new Set(
    existingTokensResult.rows.map((r) => r.parent_token),
  );
  const gradesMap = new Map(gradesResult.rows.map((g) => [g.name, g.id]));

  // Fetch groups by grade (only if we have grades)
  let groupsMap = new Map();
  if (gradesResult.rows.length > 0) {
    const gradeIds = gradesResult.rows.map((g) => g.id);
    const groupNames = Array.from(
      new Set(
        mappedData
          .map((r) => String(r.group_name || "").trim())
          .filter(Boolean),
      ),
    );

    if (groupNames.length > 0) {
      const groupsResult = await query(stdQr.getGroupsByNamesAndGrades, [
        groupNames,
        gradeIds,
      ]);
      groupsMap = new Map(
        groupsResult.rows.map((g) => [`${g.name}||${g.grade_id}`, g.id]),
      );
    }
  }

  // Step 4: Validate and prepare data
  const validRows = [];
  const barcodesSeen = new Set();

  for (let i = 0; i < mappedData.length; i++) {
    const row = mappedData[i];
    const rowNumber = i + 2;

    try {
      const barcode = String(row.barcode || "").trim();
      const full_name = String(row.full_name || "").trim();
      const grade_name = String(row.grade_name || "").trim();
      const group_name = String(row.group_name || "").trim();

      // Validate required fields
      if (!barcode) throw new Error("الباركود مطلوب");
      if (!full_name) throw new Error("اسم الطالب مطلوب");
      if (!grade_name) throw new Error("المرحلة الدراسية مطلوبة");
      if (!group_name) throw new Error("المجموعة مطلوبة");

      // Validate phones
      const phone = cleanPhone(row.phone);
      if (phone && !validateEgyptianPhone(phone)) {
        throw new Error(`رقم الهاتف غير صحيح: ${row.phone}`);
      }

      const parent_phone = cleanPhone(row.parent_phone);
      if (parent_phone && !validateEgyptianPhone(parent_phone)) {
        throw new Error(`رقم ولي الأمر غير صحيح: ${row.parent_phone}`);
      }

      // Check duplicate in file
      if (barcodesSeen.has(barcode)) {
        throw new Error(`الباركود مكرر في الملف: ${barcode}`);
      }
      barcodesSeen.add(barcode);

      // Check existing barcode in DB
      if (existingBarcodes.has(barcode)) {
        throw new Error(`الباركود موجود مسبقاً: ${barcode}`);
      }

      // Check grade exists
      const gradeId = gradesMap.get(grade_name);
      if (!gradeId) {
        throw new Error(`المرحلة الدراسية غير موجودة: ${grade_name}`);
      }

      // Check group exists
      const groupId = groupsMap.get(`${group_name}||${gradeId}`);
      if (!groupId) {
        throw new Error(`المجموعة غير موجودة: ${group_name} في ${grade_name}`);
      }

      validRows.push({
        row_number: rowNumber,
        barcode,
        full_name,
        phone,
        parent_phone,
        grade_id: gradeId,
        group_id: groupId,
        grade_name,
        group_name,
        notes: row.notes ? String(row.notes).trim() : null,
      });
    } catch (error) {
      errors.push({
        row_number: rowNumber,
        barcode: row.barcode || null,
        error: error.message,
        status: "error",
      });
      errorCount++;
    }
  }

  // Step 5: Bulk insert valid rows
  if (validRows.length > 0) {
    try {
      // Generate unique tokens for all valid rows
      const tokens = generateUniqueTokens(validRows.length, existingTokens);

      // Attach tokens
      validRows.forEach((row, index) => {
        row.parent_token = tokens[index];
      });

      // Prepare arrays for bulk insert
      const barcodes = validRows.map((r) => r.barcode);
      const fullNames = validRows.map((r) => r.full_name);
      const phones = validRows.map((r) => r.phone);
      const parentPhones = validRows.map((r) => r.parent_phone);
      const parentTokens = validRows.map((r) => r.parent_token);
      const gradeIds = validRows.map((r) => r.grade_id);
      const groupIds = validRows.map((r) => r.group_id);
      const notesList = validRows.map((r) => r.notes);

      const insertResult = await query(stdQr.bulkInsertStudents, [
        barcodes,
        fullNames,
        phones,
        parentPhones,
        parentTokens,
        gradeIds,
        groupIds,
        notesList,
      ]);

      const insertedStudents = insertResult.rows;

      // Add success records
      insertedStudents.forEach((student) => {
        const rowData = validRows.find((r) => r.barcode === student.barcode);
        results.push({
          row_number: rowData?.row_number,
          student_id: student.id,
          barcode: student.barcode,
          full_name: student.full_name,
          status: "success",
        });
        successCount++;
      });

      // Enqueue welcome messages for all inserted students
      for (const student of insertedStudents) {
        try {
          const welcomeMessage = whatsappDispatcher.generateWelcomeMessage({
            full_name: student.full_name,
            barcode: student.barcode,
            parent_token: student.parent_token,
          });

          await whatsappDispatcher.enqueueForStudentAndParent(
            student,
            "welcome",
            { message: welcomeMessage },
          );
        } catch (error) {
          console.error(
            `Error enqueueing welcome for ${student.barcode}:`,
            error.message,
          );
        }
      }
    } catch (error) {
      console.error("Bulk insert error:", error);
      throw new Error(`فشل إدخال البيانات: ${error.message}`);
    }
  }

  return {
    total_rows: mappedData.length,
    success_count: successCount,
    error_count: errorCount,
    success_records: results,
    error_records: errors,
  };
};

module.exports = {
  processStudentsBulk,
};
