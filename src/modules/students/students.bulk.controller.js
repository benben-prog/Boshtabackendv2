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

/**
 * رفع ملف Excel لإضافة طلاب
 */
const bulkUploadStudents = async (req, res, next) => {
  try {
    // التحقق من وجود الملف
    if (!req.file) {
      throw new Error("يجب رفع ملف Excel!");
    }

    const filePath = req.file.path;

    // قراءة الملف
    const rawData = readExcelFile(filePath);
    const data = cleanExcelData(rawData);

    // الأعمدة المطلوبة
    const requiredColumns = [
      "barcode",
      "full_name",
      "grade_name",
      "group_name",
    ];

    // التحقق من الأعمدة
    validateColumns(data, requiredColumns);

    // معالجة البيانات
    const result = await studentsBulkService.processStudentsBulk(data);

    // حذف الملف بعد المعالجة
    deleteExcelFile(filePath);

    // Log activity
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
    // حذف الملف في حالة الخطأ
    if (req.file && req.file.path) {
      deleteExcelFile(req.file.path);
    }
    next(error);
  }
};

/**
 * تحميل Template للطلاب
 */
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
