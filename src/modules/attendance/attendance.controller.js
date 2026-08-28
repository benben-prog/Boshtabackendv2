const attendanceService = require("./attendance.service");
const { logActivity } = require("../../utils/activityLogger");

// Create or update attendance
const createAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.createAttendance(req.body);

    if (!attendance) {
      throw new Error("فشل تسجيل الحضور حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم تسجيل الحضور بنجاح!",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance by group and date
const getAttendanceByGroupAndDate = async (req, res, next) => {
  try {
    const { groupId, date } = req.params;

    const attendance = await attendanceService.getAttendanceByGroupAndDate(
      groupId,
      date,
    );

    if (!attendance) {
      throw new Error("فشل تحميل الحضور حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الحضور بنجاح!",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance by group and month
const getAttendanceByGroupAndMonth = async (req, res, next) => {
  try {
    const { groupId, month } = req.params;
    const page = parseInt(req.query.page) || 1;

    const attendance = await attendanceService.getAttendanceByGroupAndMonth(
      groupId,
      month,
      page,
    );

    if (!attendance) {
      throw new Error("فشل تحميل الحضور حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الحضور بنجاح!",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance summary
const getAttendanceSummary = async (req, res, next) => {
  try {
    const { groupId, date } = req.params;

    const summary = await attendanceService.getAttendanceSummary(groupId, date);

    if (!summary) {
      throw new Error("فشل تحميل الملخص حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الملخص بنجاح!",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// Mark rest as absent
const markRestAbsent = async (req, res, next) => {
  try {
    const { groupId, date } = req.body;

    const result = await attendanceService.markRestAbsent(groupId, date);

    if (!result) {
      throw new Error("فشل تسجيل الغياب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "mark_rest_absent",
      entity_type: "attendance",
      entity_id: null,
      description: `تسجيل باقي الطلاب كغائبين (مجموعة: ${groupId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الغياب بنجاح!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get grade attendance stats
const getGradeAttendanceStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const stats = await attendanceService.getGradeAttendanceStats(gradeId);

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

// Get overall attendance stats
const getOverallAttendanceStats = async (req, res, next) => {
  try {
    const stats = await attendanceService.getOverallAttendanceStats();

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

// Get students with 3+ consecutive absences
const getStudentsWithThreeConsecutiveAbsences = async (req, res, next) => {
  try {
    const students =
      await attendanceService.getStudentsWithThreeConsecutiveAbsences();

    if (!students) {
      throw new Error("فشل تحميل الطلاب حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح!",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await attendanceService.getAttendanceById(id);

    if (!attendance) {
      throw new Error("فشل تحميل سجل الحضور حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل سجل الحضور بنجاح!",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Update attendance
const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await attendanceService.updateAttendance(id, req.body);

    if (!attendance) {
      throw new Error("فشل تعديل الحضور حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم تعديل الحضور بنجاح!",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Delete attendance
const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await attendanceService.deleteAttendance(id);

    if (!attendance) {
      throw new Error("فشل حذف سجل الحضور حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف سجل الحضور بنجاح!",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats
const getDashboard = async (req, res, next) => {
  try {
    const stats = await attendanceService.getDashboard();

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

// Start session
const startSession = async (req, res, next) => {
  try {
    const { group_id, grade_id } = req.body;
    const started_by = req.clientId;
    const lock_at = req.body.lock_at || null;

    const session = await attendanceService.startSession({
      group_id,
      grade_id,
      started_by,
      lock_at,
    });

    // Log activity
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
      message: "تم بدء الجلسة بنجاح!",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// Get active session
const getActiveSession = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const session = await attendanceService.getActiveSession(groupId);

    return res.status(200).json({
      success: true,
      message: session ? "تم تحميل الجلسة بنجاح!" : "لا توجد جلسة نشطة",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle makeup mode
const toggleMakeupMode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await attendanceService.toggleMakeupMode(id);

    if (!session) {
      throw new Error("الجلسة غير موجودة أو منتهية!");
    }

    // Log activity
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
        ? "تم تفعيل الحضور التعويضي!"
        : "تم تعطيل الحضور التعويضي!",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// Scan barcode
const scanBarcode = async (req, res, next) => {
  try {
    const { barcode, group_id, grade_id, session_id } = req.body;

    const result = await attendanceService.scanBarcode(barcode, {
      group_id,
      grade_id,
      session_id,
    });

    // Log activity
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
      message: "تم تسجيل الحضور بنجاح!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Lock session
const lockSession = async (req, res, next) => {
  try {
    const { id, groupId } = req.body;
    const result = await attendanceService.lockSession(id, groupId);

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "lock_session",
      entity_type: "attendance_session",
      entity_id: id,
      description: `قفل جلسة حضور وتسجيل الغائبين (جلسة: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم قفل الجلسة وتسجيل الغائبين!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAttendance,
  getAttendanceByGroupAndDate,
  getAttendanceByGroupAndMonth,
  getAttendanceSummary,
  markRestAbsent,
  getGradeAttendanceStats,
  getOverallAttendanceStats,
  getStudentsWithThreeConsecutiveAbsences,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getDashboard,
  startSession,
  getActiveSession,
  toggleMakeupMode,
  scanBarcode,
  lockSession,
};
