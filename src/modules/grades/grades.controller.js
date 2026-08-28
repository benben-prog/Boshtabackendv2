const gradeService = require("./grades.service");
const { logActivity } = require("../../utils/activityLogger");

const getGradesWithStudentsCount = async (req, res, next) => {
  try {
    const gradeStats = await gradeService.getGradesWithStudentsCount();

    if (!gradeStats) {
      throw new Error("فشل تحميل الصفوف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصفوف بنجاح!",
      data: gradeStats,
    });
  } catch (error) {
    next(error);
  }
};

const getGradesWithGroupsCount = async (req, res, next) => {
  try {
    const gradeStats = await gradeService.getGradesWithGroupsCount();

    if (!gradeStats) {
      throw new Error("فشل تحميل الصفوف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصفوف بنجاح!",
      data: gradeStats,
    });
  } catch (error) {
    next(error);
  }
};

const getAllGradesStats = async (req, res, next) => {
  try {
    const gradesStats = await gradeService.getAllGradesStats();

    if (!gradesStats) {
      throw new Error("فشل تحميل إحصائيات الصفوف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الصفوف بنجاح!",
      data: gradesStats,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gradeStats = await gradeService.getGradeStats(id);

    if (!gradeStats) {
      throw new Error("فشل تحميل إحصائيات الصف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل إحصائيات الصف بنجاح!",
      data: gradeStats,
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
      throw new Error("فشل حذف الصف نهائيًا حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الصف نهائيًا بنجاح!",
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;

    const grade = await gradeService.softDeleteGrade(id);

    if (!grade) {
      throw new Error("فشل حذف الصف حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الصف بنجاح!",
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, monthlyPrice } = req.body;

    const grade = await gradeService.updateGrade(id, name, monthlyPrice);

    if (!grade) {
      throw new Error("فشل تعديل الصف حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_grade",
      entity_type: "grade",
      entity_id: id,
      description: `تعديل صف (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الصف بنجاح!",
      data: grade,
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
      throw new Error("فشل تحميل الصف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصف بنجاح!",
      data: grade,
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
      throw new Error("فشل تحميل الصف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصف بنجاح!",
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

const getAllGrades = async (req, res, next) => {
  try {
    const grades = await gradeService.getAllGrades();

    if (!grades) {
      throw new Error("فشل تحميل الصفوف حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصفوف بنجاح!",
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};

const createGrade = async (req, res, next) => {
  try {
    const { name, monthlyPrice } = req.body;

    const grade = await gradeService.createGrade(name, monthlyPrice);

    if (!grade) {
      throw new Error("فشل إنشاء الصف حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_grade",
      entity_type: "grade",
      entity_id: grade.id,
      description: `إنشاء صف جديد: ${grade.name}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الصف بنجاح!",
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
  updateGrade,
  softDeleteGrade,
  hardDeleteGrade,
  getGradeStats,
  getAllGradesStats,
  getGradesWithGroupsCount,
  getGradesWithStudentsCount,
};
