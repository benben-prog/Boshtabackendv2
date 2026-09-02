const onlineExamService = require("./online_exams.service");
const { logActivity } = require("../../utils/activityLogger");

// Get all online exams
const getAllOnlineExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const exams = await onlineExamService.getAllOnlineExams(page);

    if (!exams) {
      throw new Error("فشل تحميل الامتحانات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح!",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get online exam by ID
const getOnlineExamById = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.getOnlineExamById(examId);

    if (!exam) {
      throw new Error("فشل تحميل الامتحان حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحان بنجاح!",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Get online exams by grade
const getOnlineExamsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await onlineExamService.getOnlineExamsByGradeId(
      gradeId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح!",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get online exams by group
const getOnlineExamsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const exams = await onlineExamService.getOnlineExamsByGroupId(
      groupId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات بنجاح!",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get available online exams
const getAvailableOnlineExams = async (req, res, next) => {
  try {
    const exams = await onlineExamService.getAvailableOnlineExams();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات المتاحة بنجاح!",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get expired online exams
const getExpiredOnlineExams = async (req, res, next) => {
  try {
    const exams = await onlineExamService.getExpiredOnlineExams();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات المنتهية بنجاح!",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get online exam stats
const getOnlineExamStats = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const stats = await onlineExamService.getOnlineExamStats(examId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get grade online exam stats
const getGradeOnlineExamStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await onlineExamService.getGradeOnlineExamStats(gradeId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Create online exam
const createOnlineExam = async (req, res, next) => {
  try {
    const exam = await onlineExamService.createOnlineExam({
      ...req.body,
      created_by: req.clientId,
    });

    if (!exam) {
      throw new Error("فشل إنشاء الامتحان حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_online_exam",
      entity_type: "online_exam",
      entity_id: exam.id,
      description: `إنشاء امتحان إلكتروني: ${exam.title}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الامتحان بنجاح!",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Update online exam
const updateOnlineExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.updateOnlineExam(examId, req.body);

    if (!exam) {
      throw new Error("فشل تعديل الامتحان حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_online_exam",
      entity_type: "online_exam",
      entity_id: examId,
      description: `تعديل امتحان إلكتروني (ID: ${examId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الامتحان بنجاح!",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete online exam
const softDeleteOnlineExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.softDeleteOnlineExam(examId);

    if (!exam) {
      throw new Error("فشل حذف الامتحان حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الامتحان بنجاح!",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Hard delete online exam
const hardDeleteOnlineExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await onlineExamService.hardDeleteOnlineExam(examId);

    if (!exam) {
      throw new Error("فشل حذف الامتحان نهائيًا حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الامتحان نهائيًا بنجاح!",
      data: exam,
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
