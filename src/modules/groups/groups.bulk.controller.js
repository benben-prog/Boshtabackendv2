const groupsBulkService = require("./groups.bulk.service");
const { logActivity } = require("../../utils/activityLogger");
const {
  readExcelFile,
  cleanExcelData,
  validateColumns,
  deleteExcelFile,
} = require("../../utils/excelReader");

/**
 * رفع ملف Excel لإضافة المجموعات
 */
const bulkUploadGroups = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("يجب رفع ملف Excel!");
    }

    const filePath = req.file.path;

    // قراءة الملف
    const rawData = readExcelFile(filePath);
    const data = cleanExcelData(rawData);

    // الأعمدة المطلوبة
    const requiredColumns = [
      "name",
      "grade_name",
      "days",
      "start_time",
      "end_time",
    ];

    // التحقق من الأعمدة
    validateColumns(data, requiredColumns);

    // معالجة البيانات
    const result = await groupsBulkService.processGroupsBulk(data);

    // حذف الملف
    deleteExcelFile(filePath);

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "bulk_upload_groups",
      entity_type: "group",
      entity_id: null,
      description: `رفع ${result.success_count} مجموعة من ملف Excel`,
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

/**
 * تحميل Template للمجموعات
 */
const downloadGroupsTemplate = async (req, res, next) => {
  try {
    const { downloadTemplate } = require("../../utils/excelTemplates");
    return downloadTemplate(res, "groups");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bulkUploadGroups,
  downloadGroupsTemplate,
};