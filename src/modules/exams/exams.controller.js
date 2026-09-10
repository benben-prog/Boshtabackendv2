const examService = require("./exams.service");
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
  const dateFields = ["created_at", "updated_at", "exam_date", "date"];
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

const createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.body);

    if (!exam) {
      throw new Error("فشل إنشاء الامتحان حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_exam",
      entity_type: "exam",
      entity_id: exam.id,
      description: `إنشاء امتحان ورقي: ${exam.title}`,
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

const getAllExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getAllExams(page);

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

const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.getExamById(id);

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

const getExamsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getExamsByGradeId(gradeId, page);

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

const getExamsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getExamsByGroupId(groupId, page);

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

// ============================================
// UPDATE
// ============================================

const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.updateExam(id, req.body);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_exam",
      entity_type: "exam",
      entity_id: id,
      description: `تعديل امتحان ورقي (ID: ${id})`,
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

const softDeleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.softDeleteExam(id);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "soft_delete_exam",
      entity_type: "exam",
      entity_id: id,
      description: `حذف مؤقت لامتحان (ID: ${id})`,
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

const hardDeleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.hardDeleteExam(id);

    if (!exam) {
      throw new Error("الامتحان غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "hard_delete_exam",
      entity_type: "exam",
      entity_id: id,
      description: `حذف نهائي لامتحان (ID: ${id})`,
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

const getExamStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await examService.getExamStats(id);

    if (!stats) {
      throw new Error("فشل تحميل إحصائيات الامتحان حاول مرة أخرى");
    }

    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الامتحان بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeExamStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await examService.getGradeExamStats(gradeId);

    if (!stats) {
      throw new Error("فشل تحميل إحصائيات الصف حاول مرة أخرى");
    }

    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الصف بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  getExamsByGradeId,
  getExamsByGroupId,
  updateExam,
  softDeleteExam,
  hardDeleteExam,
  getExamStats,
  getGradeExamStats,
};
