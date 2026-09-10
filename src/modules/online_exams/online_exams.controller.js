const onlineExamService = require("./online_exams.service");
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
    "start_at",
    "end_at",
    "submitted_at",
    "started_at",
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

const createOnlineExam = async (req, res, next) => {
  try {
    const exam = await onlineExamService.createOnlineExam({
      ...req.body,
      created_by: req.clientId,
    });

    if (!exam) {
      throw new Error("فشل إنشاء الامتحان حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_online_exam",
      entity_type: "online_exam",
      entity_id: exam.id,
      description: `إنشاء امتحان إلكتروني: ${exam.title}`,
    });

    const formattedExam = formatDatesInObject(exam);

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الامتحان بنجاح",
      data: formattedExam,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

const getAllOnlineExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const exams = await onlineExamService.getAllOnlineExams(page);

    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

const getOnlineExamById = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.getOnlineExamById(examId);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    const formattedExam = formatDatesInObject(exam);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحان بنجاح",
      data: formattedExam,
    });
  } catch (error) {
    next(error);
  }
};

const getOnlineExamsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await onlineExamService.getOnlineExamsByGradeId(
      gradeId,
      page,
    );

    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

const getOnlineExamsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await onlineExamService.getOnlineExamsByGroupId(
      groupId,
      page,
    );

    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableOnlineExams = async (req, res, next) => {
  try {
    const exams = await onlineExamService.getAvailableOnlineExams();

    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات المتاحة بنجاح",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

const getExpiredOnlineExams = async (req, res, next) => {
  try {
    const exams = await onlineExamService.getExpiredOnlineExams();

    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات المنتهية بنجاح",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE
// ============================================

const updateOnlineExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.updateOnlineExam(examId, req.body);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_online_exam",
      entity_type: "online_exam",
      entity_id: examId,
      description: `تعديل امتحان إلكتروني (ID: ${examId})`,
    });

    const formattedExam = formatDatesInObject(exam);

    return res.status(200).json({
      success: true,
      message: "تم تعديل الامتحان بنجاح",
      data: formattedExam,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE
// ============================================

const softDeleteOnlineExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.softDeleteOnlineExam(examId);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "soft_delete_online_exam",
      entity_type: "online_exam",
      entity_id: examId,
      description: `حذف مؤقت لامتحان إلكتروني (ID: ${examId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الامتحان بنجاح",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const hardDeleteOnlineExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.hardDeleteOnlineExam(examId);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "hard_delete_online_exam",
      entity_type: "online_exam",
      entity_id: examId,
      description: `حذف نهائي لامتحان إلكتروني (ID: ${examId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الامتحان نهائياً بنجاح",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// STATISTICS
// ============================================

const getOnlineExamStats = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const stats = await onlineExamService.getOnlineExamStats(examId);

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

const getGradeOnlineExamStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await onlineExamService.getGradeOnlineExamStats(gradeId);

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

module.exports = {
  getAllOnlineExams,
  getOnlineExamById,
  getOnlineExamsByGradeId,
  getOnlineExamsByGroupId,
  getAvailableOnlineExams,
  getExpiredOnlineExams,
  getOnlineExamStats,
  getGradeOnlineExamStats,
  createOnlineExam,
  updateOnlineExam,
  softDeleteOnlineExam,
  hardDeleteOnlineExam,
};
