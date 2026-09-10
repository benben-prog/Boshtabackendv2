const gradeService = require("./grades.service");
const { logActivity } = require("../../utils/activityLogger");
const { formatEgyptTime } = require("../../utils/timezone");

// ============================================
// HELPER: Format dates
// ============================================

const formatDate = (date) => {
  if (!date) return null;
  return formatEgyptTime(date, "YYYY-MM-DD HH:mm:ss");
};

const formatGradeDates = (grade) => {
  if (!grade) return grade;

  const formatted = { ...grade };
  if (formatted.created_at) {
    formatted.created_at = formatDate(formatted.created_at);
  }
  if (formatted.updated_at) {
    formatted.updated_at = formatDate(formatted.updated_at);
  }

  return formatted;
};

// ============================================
// CREATE
// ============================================

const createGrade = async (req, res, next) => {
  try {
    const grade = await gradeService.createGrade(req.body);

    if (!grade) {
      throw new Error("فشل إنشاء الصف حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_grade",
      entity_type: "grade",
      entity_id: grade.id,
      description: `إنشاء صف جديد: ${grade.name}`,
    });

    const formattedGrade = formatGradeDates(grade);

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الصف بنجاح",
      data: formattedGrade,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

const getAllGrades = async (req, res, next) => {
  try {
    const search = req.query.search ? `%${req.query.search}%` : "";
    const grades = await gradeService.getAllGrades(search);

    const formattedGrades = grades.map(formatGradeDates);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصفوف بنجاح",
      data: formattedGrades,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await gradeService.getGradeById(id);

    if (!grade) {
      throw new Error("الصف غير موجود");
    }

    const formattedGrade = formatGradeDates(grade);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصف بنجاح",
      data: formattedGrade,
    });
  } catch (error) {
    next(error);
  }
};

const findGradeByName = async (req, res, next) => {
  try {
    const { name } = req.body;
    const grade = await gradeService.findGradeByName(name);

    if (!grade) {
      throw new Error("الصف غير موجود");
    }

    const formattedGrade = formatGradeDates(grade);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصف بنجاح",
      data: formattedGrade,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET GRADE DETAILS (FULL)
// ============================================

const getGradeDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const details = await gradeService.getGradeDetails(id);

    if (!details) {
      throw new Error("الصف غير موجود");
    }

    // Format dates
    const formattedDetails = {
      grade: formatGradeDates(details.grade),
      stats: details.stats,
      groups: details.groups,
    };

    return res.status(200).json({
      success: true,
      message: "تم تحميل تفاصيل الصف بنجاح",
      data: formattedDetails,
    });
  } catch (error) {
    next(error);
  }
};

const getGradesWithGroupsCount = async (req, res, next) => {
  try {
    const grades = await gradeService.getGradesWithGroupsCount();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصفوف بنجاح",
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};

const getGradesWithStudentsCount = async (req, res, next) => {
  try {
    const grades = await gradeService.getGradesWithStudentsCount();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصفوف بنجاح",
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};

const getAllGradesStats = async (req, res, next) => {
  try {
    const grades = await gradeService.getAllGradesStats();

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الصفوف بنجاح",
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await gradeService.getGradeStats(id);

    if (!stats) {
      throw new Error("فشل تحميل إحصائيات الصف حاول مرة أخرى");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الصف بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE
// ============================================

const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await gradeService.updateGrade(id, req.body);

    if (!grade) {
      throw new Error("الصف غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_grade",
      entity_type: "grade",
      entity_id: id,
      description: `تعديل صف (ID: ${id})`,
    });

    const formattedGrade = formatGradeDates(grade);

    return res.status(200).json({
      success: true,
      message: "تم تعديل الصف بنجاح",
      data: formattedGrade,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE
// ============================================

const softDeleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await gradeService.softDeleteGrade(id);

    if (!grade) {
      throw new Error("الصف غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "soft_delete_grade",
      entity_type: "grade",
      entity_id: id,
      description: `حذف مؤقت لصف (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الصف بنجاح",
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

const hardDeleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await gradeService.hardDeleteGrade(id);

    if (!grade) {
      throw new Error("الصف غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "hard_delete_grade",
      entity_type: "grade",
      entity_id: id,
      description: `حذف نهائي لصف (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الصف نهائياً بنجاح",
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGrade,
  getAllGrades,
  getGradeById,
  findGradeByName,
  getGradeDetails,
  updateGrade,
  softDeleteGrade,
  hardDeleteGrade,
  getGradeStats,
  getAllGradesStats,
  getGradesWithGroupsCount,
  getGradesWithStudentsCount,
};
