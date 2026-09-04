// src/modules/students/students.bulk.service.js
const { query } = require("../../config/database");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
  validateEgyptianPhone,
  cleanPhone,
} = require("../../utils/excelValidator");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");

const generateParentToken = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

const processStudentsBulk = async (data) => {
  // Column mapping from Arabic to English (double protection)
  const columnMapping = {
    "الاسم الكامل": "full_name",
    الباركود: "barcode",
    "المرحلة الدراسية": "grade_name",
    المجموعة: "group_name",
    "رقم الجوال": "phone",
    "رقم ولي الامر": "parent_phone",
    ملاحظات: "notes",
  };

  const mappedData = data.map((row) => {
    const newRow = {};
    Object.keys(row).forEach((key) => {
      const englishKey = columnMapping[key] || key;
      newRow[englishKey] = row[key];
    });
    return newRow;
  });

  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  const barcodes = [];
  const fullNames = [];
  const phones = [];
  const parentPhones = [];
  const parentTokens = [];
  const gradeIds = [];
  const groupIds = [];
  const notesList = [];

  for (let i = 0; i < mappedData.length; i++) {
    const row = mappedData[i];
    const rowNumber = i + 2;

    try {
      const barcode = String(row.barcode || "").trim();
      const full_name = String(row.full_name || "").trim();
      const grade_name = String(row.grade_name || "").trim();
      const group_name = String(row.group_name || "").trim();

      if (!barcode) throw new Error("Barcode required");
      if (!full_name) throw new Error("Student name required");
      if (!grade_name) throw new Error("Grade name required");
      if (!group_name) throw new Error("Group name required");

      const phone = cleanPhone(row.phone);
      if (phone && !validateEgyptianPhone(phone)) {
        throw new Error(`Invalid phone: ${row.phone}`);
      }

      const parent_phone = cleanPhone(row.parent_phone);
      if (parent_phone && !validateEgyptianPhone(parent_phone)) {
        throw new Error(`Invalid parent phone: ${row.parent_phone}`);
      }

      if (barcodes.includes(barcode)) {
        throw new Error(`Duplicate barcode: ${barcode}`);
      }

      const existingBarcode = await query(
        "SELECT id FROM students WHERE barcode = $1 AND deleted = 0",
        [barcode],
      );
      if (existingBarcode.rows[0]) {
        throw new Error(`Barcode exists: ${barcode}`);
      }

      const gradeResult = await query(
        "SELECT id FROM grades WHERE name = $1 AND deleted = 0",
        [grade_name],
      );
      const grade = gradeResult.rows[0];
      if (!grade) throw new Error(`Grade not found: ${grade_name}`);

      const groupResult = await query(
        "SELECT id FROM groups WHERE name = $1 AND grade_id = $2 AND deleted = 0",
        [group_name, grade.id],
      );
      const group = groupResult.rows[0];
      if (!group) throw new Error(`Group not found: ${group_name}`);

      const parentToken = generateParentToken();

      barcodes.push(barcode);
      fullNames.push(full_name);
      phones.push(phone);
      parentPhones.push(parent_phone);
      parentTokens.push(parentToken);
      gradeIds.push(grade.id);
      groupIds.push(group.id);
      notesList.push(row.notes ? String(row.notes).trim() : null);

      results.push({
        row_number: rowNumber,
        barcode,
        full_name,
        status: "success",
      });
      successCount++;
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

  if (barcodes.length > 0) {
    try {
      const insertResult = await query(
        `INSERT INTO students (barcode, full_name, phone, parent_phone, parent_token, grade_id, group_id, notes)
         SELECT * FROM UNNEST(
           $1::text[],
           $2::text[],
           $3::text[],
           $4::text[],
           $5::text[],
           $6::int[],
           $7::int[],
           $8::text[]
         )
         RETURNING id, barcode, full_name, phone, parent_phone, parent_token`,
        [
          barcodes,
          fullNames,
          phones,
          parentPhones,
          parentTokens,
          gradeIds,
          groupIds,
          notesList,
        ],
      );

      const insertedStudents = insertResult.rows;

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
          console.error("Error enqueueing welcome message:", error);
        }
      }

      results.forEach((result) => {
        const inserted = insertedStudents.find(
          (s) => s.barcode === result.barcode,
        );
        if (inserted) {
          result.student_id = inserted.id;
        }
      });
    } catch (error) {
      console.error("Bulk insert error:", error);
      throw new Error(`Failed to insert data: ${error.message}`);
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
