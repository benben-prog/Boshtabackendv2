const examResultsBulkService = require("./exam_results.bulk.service");
const { logActivity } = require("../../utils/activityLogger");
const {
  readExcelFile,
  cleanExcelData,
  validateColumns,
  deleteExcelFile,
} = require("../../utils/excelReader");

/**
 * رفع ملف Excel لإضافة درجات الامتحانات الورقية
 */
const bulkUploadExamResults = async (req, res, next) => {
  try {
    // التحقق من وجود الملف
    if (!req.file) {
      throw new Error("يجب رفع ملف Excel!");
    }

    // التحقق من وجود examId
    const { examId } = req.params;
    if (!examId) {
      throw new Error("معرف الامتحان مطلوب!");
    }

    const filePath = req.file.path;

    // قراءة الملف
    const rawData = readExcelFile(filePath);
    const data = cleanExcelData(rawData);

    // الأعمدة المطلوبة
    const requiredColumns = ["barcode", "degree"];

    // التحقق من الأعمدة
    validateColumns(data, requiredColumns);

    // معالجة البيانات
    const result = await examResultsBulkService.processExamResultsBulk(
      examId,
      data,
    );

    // حذف الملف بعد المعالجة
    deleteExcelFile(filePath);

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "bulk_upload_exam_results",
      entity_type: "exam_result",
      entity_id: examId,
      description: `رفع ${result.success_count} درجة من ملف Excel للامتحان (ID: ${examId})`,
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
 * تحميل Template للدرجات
 */
const downloadExamResultsTemplate = async (req, res, next) => {
  try {
    const { downloadTemplate } = require("../../utils/excelTemplates");
    return downloadTemplate(res, "exam-results");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bulkUploadExamResults,
  downloadExamResultsTemplate,
};