// src/modules/students/students.bulk.controller.js
const studentsBulkService = require("./students.bulk.service");
const { logActivity } = require("../../utils/activityLogger");
const {
  readExcelFile,
  cleanExcelData,
  validateColumns,
  deleteExcelFile,
} = require("../../utils/excelReader");
const {
  validateEgyptianPhone,
  cleanPhone,
} = require("../../utils/excelValidator");

const bulkUploadStudents = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("يجب رفع ملف Excel!");
    }

    const filePath = req.file.path;

    const rawData = readExcelFile(filePath);
    const data = cleanExcelData(rawData);

    // Column mapping from Arabic to English
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

    const result = await studentsBulkService.processStudentsBulk(mappedData);

    deleteExcelFile(filePath);

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "bulk_upload_students",
      entity_type: "student",
      entity_id: null,
      description: `رفع ${result.success_count} طالب من ملف Excel`,
    });

    return res.status(200).json({
      success: true,
      message: `تمت معالجة الملف بنجاح! (نجح: ${result.success_count}, فشل: ${result.error_count})`,
      data: result,
    });
  } catch (error) {
    if (req.file && req.file.path) {
      deleteExcelFile(req.file.path);
    }
    next(error);
  }
};

const downloadStudentsTemplate = async (req, res, next) => {
  try {
    const { downloadTemplate } = require("../../utils/excelTemplates");
    return downloadTemplate(res, "students");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bulkUploadStudents,
  downloadStudentsTemplate,
};
