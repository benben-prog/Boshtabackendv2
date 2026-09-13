const attendanceService = require("./attendance.service");
const { logActivity } = require("../../utils/activityLogger");

// ============================================
// SESSION MANAGEMENT
// ============================================

// ============================================
// GET DASHBOARD - now requires group_id
// ============================================

const getDashboard = async (req, res, next) => {
  try {
    const { group_id } = req.query;

    if (!group_id) {
      throw new Error("معرف المجموعة مطلوب");
    }

    const stats = await attendanceService.getDashboard(parseInt(group_id));

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ACTIVE SESSION - validates groupId
// ============================================

const getActiveSession = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      throw new Error("معرف المجموعة مطلوب");
    }

    const session = await attendanceService.getActiveSession(parseInt(groupId));

    return res.status(200).json({
      success: true,
      message: session ? "تم تحميل الجلسة بنجاح" : "لا توجد جلسة نشطة",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// START SESSION
// ============================================

const startSession = async (req, res, next) => {
  try {
    const { group_id, grade_id } = req.body;
    const started_by = req.clientId;

    const session = await attendanceService.startSession({
      group_id,
      grade_id,
      started_by,
    });

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "start_session",
      entity_type: "attendance_session",
      entity_id: session.id,
      description: `بدء جلسة حضور (مجموعة: ${group_id})`,
    });

    return res.status(201).json({
      success: true,
      message: "تم بدء الجلسة بنجاح",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const toggleMakeupMode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await attendanceService.toggleMakeupMode(id);

    if (!session) {
      throw new Error("الجلسة غير موجودة أو منتهية");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "toggle_makeup_mode",
      entity_type: "attendance_session",
      entity_id: id,
      description: `${session.is_makeup_enabled ? "تفعيل" : "تعطيل"} الحضور التعويضي (جلسة: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: session.is_makeup_enabled
        ? "تم تفعيل الحضور التعويضي"
        : "تم تعطيل الحضور التعويضي",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const lockSession = async (req, res, next) => {
  try {
    const { id, groupId } = req.body;

    const result = await attendanceService.closeSession(id, groupId);

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "close_session",
      entity_type: "attendance_session",
      entity_id: id,
      description: `إغلاق جلسة حضور وتسجيل الغائبين (جلسة: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم إغلاق الجلسة وتسجيل الغائبين",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// BARCODE SCANNING
// ============================================

const scanBarcode = async (req, res, next) => {
  try {
    const { barcode, group_id, grade_id } = req.body;

    const result = await attendanceService.scanBarcode(barcode, {
      group_id,
      grade_id,
    });

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "scan_barcode",
      entity_type: "attendance",
      entity_id: result.attendance.id,
      description: `تسجيل حضور بالباركود: ${result.student.full_name}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الحضور بنجاح",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ATTENDANCE CRUD
// ============================================

const createAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.createAttendance(req.body);

    if (!attendance) {
      throw new Error("فشل تسجيل الحضور حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_attendance",
      entity_type: "attendance",
      entity_id: attendance.id,
      description: `تسجيل حضور للطالب (ID: ${attendance.student_id}) - ${attendance.status}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم تسجيل الحضور بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceByGroupAndDate = async (req, res, next) => {
  try {
    const { groupId, date } = req.params;
    const attendance = await attendanceService.getAttendanceByGroupAndDate(
      groupId,
      date,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الحضور بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceByGroupAndMonth = async (req, res, next) => {
  try {
    const { groupId, month } = req.params;
    const page = parseInt(req.query.page) || 1;

    const attendance = await attendanceService.getAttendanceByGroupAndMonth(
      groupId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الحضور بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceSummary = async (req, res, next) => {
  try {
    const { groupId, date } = req.params;
    const summary = await attendanceService.getAttendanceSummary(groupId, date);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الملخص بنجاح",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeAttendanceStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await attendanceService.getGradeAttendanceStats(gradeId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getOverallAttendanceStats = async (req, res, next) => {
  try {
    const stats = await attendanceService.getOverallAttendanceStats();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentsWithThreeConsecutiveAbsences = async (req, res, next) => {
  try {
    const students =
      await attendanceService.getStudentsWithThreeConsecutiveAbsences();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendance = await attendanceService.getAttendanceById(id);

    if (!attendance) {
      throw new Error("فشل تحميل سجل الحضور حاول مرة أخرى");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل سجل الحضور بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendance = await attendanceService.updateAttendance(id, req.body);

    if (!attendance) {
      throw new Error("فشل تعديل الحضور حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_attendance",
      entity_type: "attendance",
      entity_id: id,
      description: `تعديل سجل حضور (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الحضور بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendance = await attendanceService.deleteAttendance(id);

    if (!attendance) {
      throw new Error("فشل حذف سجل الحضور حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_attendance",
      entity_type: "attendance",
      entity_id: id,
      description: `حذف سجل حضور (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف سجل الحضور بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Session management
  startSession,
  getActiveSession,
  toggleMakeupMode,
  lockSession,
  // Barcode
  scanBarcode,
  // Attendance CRUD
  createAttendance,
  getAttendanceByGroupAndDate,
  getAttendanceByGroupAndMonth,
  getAttendanceSummary,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  // Statistics
  getGradeAttendanceStats,
  getOverallAttendanceStats,
  getStudentsWithThreeConsecutiveAbsences,
  getDashboard,
};
