const examService = require("./exams.service");
const { logActivity } = require("../../utils/activityLogger");

// ✅ دالة مساعدة لتحويل التواقيت
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString('en-US', { 
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// ✅ دالة مساعدة لتحويل التواقيت في المصفوفة
const formatDatesInArray = (items) => {
  if (!items || !Array.isArray(items)) return items;
  return items.map(item => formatDatesInObject(item));
};

// ✅ دالة مساعدة لتحويل التواقيت في الكائن
const formatDatesInObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const formatted = { ...obj };
  const dateFields = ['created_at', 'updated_at', 'exam_date', 'date'];
  dateFields.forEach(field => {
    if (formatted[field] !== undefined && formatted[field] !== null) {
      formatted[field] = formatDate(formatted[field]);
    }
  });
  return formatted;
};

// Create a new exam
const createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.body);

    if (!exam) {
      throw new Error("فشل إنشاء الامتحان حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_exam",
      entity_type: "exam",
      entity_id: exam.id,
      description: `إنشاء امتحان ورقي: ${exam.title}`,
    });

    // ✅ تحويل التواقيت
    const formattedExam = formatDatesInObject(exam);

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الامتحان بنجاح!",
      data: formattedExam,
    });
  } catch (error) {
    next(error);
  }
};

// Get all exams
const getAllExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getAllExams(page);

    if (!exams) {
      throw new Error("فشل تحميل الامتحانات حاول مرة أخرى!");
    }

    // ✅ تحويل التواقيت
    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح!",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

// Get exam by ID
const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.getExamById(id);

    if (!exam) {
      throw new Error("فشل تحميل الامتحان حاول مرة أخرى!");
    }

    // ✅ تحويل التواقيت
    const formattedExam = formatDatesInObject(exam);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحان بنجاح!",
      data: formattedExam,
    });
  } catch (error) {
    next(error);
  }
};

// Get exams by grade
const getExamsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getExamsByGradeId(gradeId, page);

    if (!exams) {
      throw new Error("فشل تحميل الامتحانات حاول مرة أخرى!");
    }

    // ✅ تحويل التواقيت
    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح!",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

// Get exams by group
const getExamsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getExamsByGroupId(groupId, page);

    if (!exams) {
      throw new Error("فشل تحميل الامتحانات حاول مرة أخرى!");
    }

    // ✅ تحويل التواقيت
    const formattedExams = formatDatesInArray(exams);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح!",
      data: formattedExams,
    });
  } catch (error) {
    next(error);
  }
};

// Update exam
const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.updateExam(id, req.body);

    if (!exam) {
      throw new Error("فشل تعديل الامتحان حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_exam",
      entity_type: "exam",
      entity_id: id,
      description: `تعديل امتحان ورقي (ID: ${id})`,
    });

    // ✅ تحويل التواقيت
    const formattedExam = formatDatesInObject(exam);

    return res.status(200).json({
      success: true,
      message: "تم تعديل الامتحان بنجاح!",
      data: formattedExam,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete exam
const softDeleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.softDeleteExam(id);

    if (!exam) {
      throw new Error("فشل حذف الامتحان حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الامتحان بنجاح!",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Hard delete exam
const hardDeleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await examService.hardDeleteExam(id);

    if (!exam) {
      throw new Error("فشل حذف الامتحان نهائيًا حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الامتحان نهائيًا بنجاح!",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Get exam stats
const getExamStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await examService.getExamStats(id);

    if (!stats) {
      throw new Error("فشل تحميل إحصائيات الامتحان حاول مرة أخرى!");
    }

    // ✅ تحويل التواقيت
    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الامتحان بنجاح!",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

// Get grade exam stats
const getGradeExamStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await examService.getGradeExamStats(gradeId);

    if (!stats) {
      throw new Error("فشل تحميل إحصائيات الصف حاول مرة أخرى!");
    }

    // ✅ تحويل التواقيت
    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الصف بنجاح!",
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
