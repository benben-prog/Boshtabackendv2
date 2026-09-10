const examResultService = require("./exam_results.service");
const { logActivity } = require("../../utils/activityLogger");
const { formatEgyptTime } = require("../../utils/timezone");

// ============================================
// HELPER: Format dates
// ============================================

const formatDate = (date) => {
  if (!date) return null;
  return formatEgyptTime(date, "YYYY-MM-DD HH:mm:ss");
};

const formatDatesInArray = (items) => {
  if (!items || !Array.isArray(items)) return items;
  return items.map((item) => formatDatesInObject(item));
};

const formatDatesInObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const formatted = { ...obj };
  const dateFields = [
    "created_at",
    "updated_at",
    "exam_date",
    "date",
    "submitted_at",
  ];
  dateFields.forEach((field) => {
    if (formatted[field] !== undefined && formatted[field] !== null) {
      formatted[field] = formatDate(formatted[field]);
    }
  });
  return formatted;
};

// ============================================
// CREATE
// ============================================

const createExamResult = async (req, res, next) => {
  try {
    const result = await examResultService.createExamResult(req.body);

    if (!result) {
      throw new Error("فشل تسجيل الدرجة حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_exam_result",
      entity_type: "exam_result",
      entity_id: result.id,
      description: `تسجيل درجة للطالب (ID: ${result.student_id}) - ${result.degree}`,
    });

    const formattedResult = formatDatesInObject(result);

    return res.status(201).json({
      success: true,
      message: "تم تسجيل الدرجة بنجاح",
      data: formattedResult,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPSERT
// ============================================

const upsertExamResult = async (req, res, next) => {
  try {
    const result = await examResultService.upsertExamResult(req.body);

    if (!result) {
      throw new Error("فشل تسجيل الدرجة حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "upsert_exam_result",
      entity_type: "exam_result",
      entity_id: result.id,
      description: `تسجيل/تحديث درجة للطالب (ID: ${result.student_id}) - ${result.degree}`,
    });

    const formattedResult = formatDatesInObject(result);

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدرجة بنجاح",
      data: formattedResult,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPSERT BATCH
// ============================================

const upsertBatchExamResults = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { records } = req.body;

    if (!examId) {
      throw new Error("ID الامتحان مطلوب");
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      throw new Error("يجب إرسال سجلات الدرجات");
    }

    const result = await examResultService.upsertBatchExamResults(
      examId,
      records,
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "upsert_batch_exam_results",
      entity_type: "exam_result",
      entity_id: examId,
      description: `تسجيل ${result.success_count} درجة دفعة واحدة`,
    });

    return res.status(200).json({
      success: true,
      message: `تمت معالجة الدرجات (نجح: ${result.success_count}, فشل: ${result.error_count})`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE
// ============================================

const updateExamResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await examResultService.updateExamResult(id, req.body);

    if (!result) {
      throw new Error("فشل تعديل الدرجة حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_exam_result",
      entity_type: "exam_result",
      entity_id: id,
      description: `تعديل درجة (ID: ${id})`,
    });

    const formattedResult = formatDatesInObject(result);

    return res.status(200).json({
      success: true,
      message: "تم تعديل الدرجة بنجاح",
      data: formattedResult,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE
// ============================================

const deleteExamResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await examResultService.deleteExamResult(id);

    if (!result) {
      throw new Error("فشل حذف الدرجة حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_exam_result",
      entity_type: "exam_result",
      entity_id: id,
      description: `حذف درجة (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الدرجة بنجاح",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

const getExamResults = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const results = await examResultService.getExamResults(examId);

    const formattedResults = formatDatesInArray(results);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدرجات بنجاح",
      data: formattedResults,
    });
  } catch (error) {
    next(error);
  }
};

const getExamResultStats = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const stats = await examResultService.getExamResultStats(examId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى");
    }

    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeExamResultsStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const stats = await examResultService.getGradeExamResultsStats(gradeId);

    const formattedStats = formatDatesInArray(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupExamResultsStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const stats = await examResultService.getGroupExamResultsStats(groupId);

    const formattedStats = formatDatesInArray(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExamResult,
  upsertExamResult,
  upsertBatchExamResults,
  updateExamResult,
  deleteExamResult,
  getExamResults,
  getExamResultStats,
  getGradeExamResultsStats,
  getGroupExamResultsStats,
};
