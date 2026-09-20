const { query } = require("../../config/database");
const attendanceQueries = require("./attendance.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const { logActivity } = require("../../utils/activityLogger");
const {
  getTodayEgypt,
  formatEgyptTime,
  getNowEgypt,
} = require("../../utils/timezone");

// ============================================
// HELPER: Check if attendance can be modified
// ============================================

const checkSessionModifiable = async (groupId, date) => {
  const sessionResult = await query(
    attendanceQueries.checkSessionExistsForGroupOnDate,
    [groupId],
  );

  const session = sessionResult.rows[0];

  if (session) {
    // If session is locked (closed), prevent any modification
    if (session.status === "locked" || session.status === "closed") {
      throw new Error("الجلسة مقفولة - لا يمكن التعديل بعد إغلاق الجلسة");
    }

    // If attendance is locked (lock_at passed), prevent modifications
    if (session.attendance_locked === 1) {
      throw new Error("انتهى وقت تسجيل الحضور - لا يمكن التعديل");
    }
  }

  return session;
};

// ============================================
// HELPER: Auto lock attendance if lock_at passed
// Also triggers soft-delete check for students with 3 absences
// ============================================

const autoLockAttendanceIfNeeded = async (session) => {
  if (!session) return session;

  // Already locked
  if (session.attendance_locked === 1) {
    return session;
  }

  // No lock_at set
  if (!session.lock_at) {
    return session;
  }

  const now = getNowEgypt();
  const lockAt = new Date(session.lock_at);

  // lock_at hasn't passed yet
  if (now < lockAt) {
    return session;
  }

  // lock_at passed - lock attendance
  console.log(
    `[Attendance] Auto-locking session ${session.id} - lock_at passed`,
  );

  // Use session started_at date, not today
  const sessionDate = formatEgyptTime(session.started_at, "YYYY-MM-DD");

  // Mark rest absent
  await query(attendanceQueries.markRestAbsent, [
    session.group_id,
    sessionDate,
  ]);

  // Update session attendance_locked flag
  const result = await query(attendanceQueries.lockAttendanceRecording, [
    session.id,
  ]);

  // Also check and soft-delete students with 3 consecutive absences
  try {
    await checkAndSoftDeleteAbsentStudents();
  } catch (error) {
    console.error("[Attendance] Error in soft-delete check:", error.message);
  }

  return result.rows[0] || session;
};

// ============================================
// HELPER: Check and soft delete students with 3 consecutive absences
// ============================================

const checkAndSoftDeleteAbsentStudents = async () => {
  const result = await query(
    attendanceQueries.getStudentsWithThreeConsecutiveAbsences,
  );

  const students = result.rows;

  if (students.length === 0) {
    return { deleted_count: 0, students: [] };
  }

  const studentIds = students.map((s) => s.id);

  // Soft delete all students in one query
  const deleteResult = await query(attendanceQueries.softDeleteStudent, [
    studentIds,
  ]);

  // Log activity for each student
  for (const student of students) {
    await logActivity({
      user_id: null,
      user_role: "system",
      user_permissions: null,
      action: "auto_soft_delete_student",
      entity_type: "student",
      entity_id: student.id,
      description: `حذف تلقائي للطالب ${student.full_name} (${student.barcode}) بسبب 3 غياب متتالي`,
    });
  }

  console.log(
    `[Attendance] Auto soft-deleted ${deleteResult.rows.length} students`,
  );

  return {
    deleted_count: deleteResult.rows.length,
    students: deleteResult.rows,
  };
};

// ============================================
// SESSION MANAGEMENT
// ============================================

const startSession = async (sessionData) => {
  const { group_id, grade_id, started_by } = sessionData;
  // NOTE: lock_at is intentionally NOT accepted from the client.
  // The lock duration is always derived from settings.default_lock_minutes.

  // Validate that group belongs to grade
  const groupCheckResult = await query(
    attendanceQueries.validateGroupBelongsToGrade,
    [group_id],
  );

  if (!groupCheckResult.rows[0]) {
    throw new Error("المجموعة غير موجودة أو محذوفة");
  }

  const groupData = groupCheckResult.rows[0];

  if (Number(groupData.grade_id) !== Number(grade_id)) {
    throw new Error(
      `المرحلة الدراسية غير متطابقة - المجموعة تابعة لـ "${groupData.grade_name}"`,
    );
  }

  // Check if session exists today for this group
  const existingResult = await query(
    attendanceQueries.checkSessionExistsForGroupOnDate,
    [group_id],
  );

  if (existingResult.rows[0]) {
    throw new Error(
      "توجد جلسة بالفعل لهذه المجموعة اليوم - لا يمكن بدء جلسة جديدة",
    );
  }

  // Get default lock minutes from settings
  const settingsResult = await query(attendanceQueries.getDefaultLockMinutes);

  if (!settingsResult.rows[0]) {
    throw new Error("إعدادات المنصة غير موجودة");
  }

  const defaultMinutes = settingsResult.rows[0].default_lock_minutes;

  if (!defaultMinutes || defaultMinutes <= 0) {
    throw new Error("مدة القفل الافتراضية غير صحيحة في الإعدادات");
  }

  // Create session — Postgres computes lock_at from NOW() + defaultMinutes
  const result = await query(attendanceQueries.startSession, [
    group_id,
    grade_id,
    started_by,
    defaultMinutes,
  ]);

  const session = result.rows[0];

  await logActivity({
    user_id: started_by,
    user_role: "system",
    user_permissions: null,
    action: "start_session",
    entity_type: "attendance_session",
    entity_id: session.id,
    description: `بدء جلسة حضور لمجموعة (ID: ${group_id}) - قفل تلقائي بعد ${defaultMinutes} دقيقة`,
  });

  return session;
};

const getActiveSession = async (groupId) => {
  if (!groupId) {
    throw new Error("معرف المجموعة مطلوب");
  }

  const result = await query(attendanceQueries.getActiveSessionByGroup, [
    groupId,
  ]);

  if (!result.rows[0]) {
    return null;
  }

  // Auto lock attendance if lock_at passed
  const session = await autoLockAttendanceIfNeeded(result.rows[0]);

  return session;
};

const getSessionById = async (sessionId) => {
  const result = await query(attendanceQueries.getSessionById, [sessionId]);
  return result.rows[0];
};

const toggleMakeupMode = async (sessionId) => {
  const result = await query(attendanceQueries.toggleMakeupMode, [sessionId]);

  if (!result.rows[0]) {
    throw new Error("الجلسة غير موجودة أو مقفولة");
  }

  return result.rows[0];
};

const closeSession = async (sessionId, groupId) => {
  // Get session
  const sessionResult = await query(attendanceQueries.getSessionById, [
    sessionId,
  ]);
  const session = sessionResult.rows[0];

  if (!session) {
    throw new Error("الجلسة غير موجودة");
  }

  if (session.status !== "active") {
    throw new Error("الجلسة مقفولة بالفعل");
  }

  if (Number(session.group_id) !== Number(groupId)) {
    throw new Error("الجلسة لا تنتمي لهذه المجموعة");
  }

  // Use session started_at date, not today
  const sessionDate = formatEgyptTime(session.started_at, "YYYY-MM-DD");

  // Mark rest absent if not already done
  if (session.attendance_locked === 0) {
    await query(attendanceQueries.markRestAbsent, [groupId, sessionDate]);
  }

  // Close session
  const result = await query(attendanceQueries.closeSession, [sessionId]);

  // Check and soft delete students with 3 consecutive absences
  await checkAndSoftDeleteAbsentStudents();

  return result.rows[0];
};

// ============================================
// BARCODE SCANNING
// ============================================

const scanBarcode = async (barcode, sessionData) => {
  const { group_id, grade_id } = sessionData;

  // Get active session
  const session = await getActiveSession(group_id);

  if (!session) {
    throw new Error("لا توجد جلسة نشطة لهذه المجموعة");
  }

  // Check if attendance recording is locked
  if (session.attendance_locked === 1) {
    throw new Error("انتهى وقت تسجيل الحضور");
  }

  // Check if session is closed
  if (session.status !== "active") {
    throw new Error("الجلسة مقفولة - انتهى وقت تسجيل الحضور");
  }

  // Check student
  const studentResult = await query(attendanceQueries.checkStudentByBarcode, [
    barcode,
  ]);
  const student = studentResult.rows[0];

  if (!student) {
    throw new Error("الطالب غير موجود");
  }

  // Determine if makeup
  let is_makeup = 0;
  let makeup_group_id = null;

  if (Number(student.group_id) === Number(group_id)) {
    is_makeup = 0;
  } else if (
    Number(session.is_makeup_enabled) === 1 &&
    Number(student.grade_id) === Number(grade_id)
  ) {
    is_makeup = 1;
    makeup_group_id = student.group_id;
  } else {
    throw new Error("الطالب غير تابع لهذه المجموعة");
  }

  // Record attendance - ON CONFLICT prevents race condition
  const attendanceResult = await query(
    attendanceQueries.recordAttendanceWithSession,
    [student.id, group_id, grade_id, is_makeup, makeup_group_id],
  );

  // If no row returned, student was already marked
  if (!attendanceResult.rows[0]) {
    throw new Error("الطالب مسجل حضوره بالفعل");
  }

  return {
    student,
    attendance: attendanceResult.rows[0],
    is_makeup,
  };
};

// ============================================
// ATTENDANCE CRUD
// ============================================

const createAttendance = async (attendanceData) => {
  const {
    student_id,
    group_id,
    grade_id,
    attendance_date,
    status,
    method = "manual",
    is_makeup = 0,
    makeup_group_id = null,
    notes = null,
  } = attendanceData;

  // Check if session can be modified
  await checkSessionModifiable(group_id, attendance_date);

  const result = await query(attendanceQueries.createAttendance, [
    student_id,
    group_id,
    grade_id,
    attendance_date,
    status,
    method,
    is_makeup,
    makeup_group_id,
    notes,
  ]);

  const attendance = result.rows[0];

  // Send WhatsApp notification if absent
  if (attendance && status === "absent") {
    try {
      const studentResult = await query(
        "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
        [student_id],
      );
      const student = studentResult.rows[0];

      if (student) {
        const formattedDate = attendance_date
          ? formatEgyptTime(attendance_date, "DD/MM/YYYY")
          : formatEgyptTime(getTodayEgypt(), "DD/MM/YYYY");

        const absenceMessage = whatsappDispatcher.generateAbsenceMessage(
          student,
          formattedDate,
        );

        await whatsappDispatcher.enqueueForStudentAndParent(
          student,
          "absence",
          {
            message: absenceMessage,
            date: formattedDate,
          },
        );
      }
    } catch (error) {
      console.error("Error enqueueing absence message:", error.message);
    }
  }

  return attendance;
};

const getAttendanceByGroupAndDate = async (groupId, date) => {
  const result = await query(attendanceQueries.getAttendanceByGroupAndDate, [
    groupId,
    date || getTodayEgypt(),
  ]);
  return result.rows;
};
const getAbsentByGroupAndDate = async (groupId, date) => {
  const result = await query(attendanceQueries.getAbsentByGroupAndDate, [
    groupId,
    date || getTodayEgypt(),
  ]);
  return result.rows;
};

const getAttendanceByGroupAndMonth = async (groupId, month, page = 1) => {
  const result = await query(attendanceQueries.getAttendanceByGroupAndMonth, [
    groupId,
    month,
    page,
  ]);
  return result.rows;
};

const getAttendanceSummary = async (groupId, date) => {
  if (!groupId) {
    throw new Error("معرف المجموعة مطلوب");
  }

  const result = await query(attendanceQueries.getAttendanceSummary, [
    groupId,
    date || getTodayEgypt(),
  ]);
  return result.rows[0];
};

const getAttendanceById = async (id) => {
  const result = await query(attendanceQueries.getAttendanceById, [id]);
  return result.rows[0];
};

const updateAttendance = async (id, attendanceData) => {
  // Get existing attendance
  const existingResult = await query(attendanceQueries.getAttendanceById, [id]);
  const existing = existingResult.rows[0];

  if (!existing) {
    throw new Error("سجل الحضور غير موجود");
  }

  // Check if session can be modified
  await checkSessionModifiable(existing.group_id, existing.attendance_date);

  const { status, method, is_makeup, makeup_group_id, notes } = attendanceData;

  // Don't pass attendance_time - SQL will use NOW()
  const result = await query(attendanceQueries.updateAttendance, [
    status,
    null,
    method,
    is_makeup,
    makeup_group_id,
    notes,
    id,
  ]);

  return result.rows[0];
};

const deleteAttendance = async (id) => {
  // Get existing attendance
  const existingResult = await query(attendanceQueries.getAttendanceById, [id]);
  const existing = existingResult.rows[0];

  if (!existing) {
    throw new Error("سجل الحضور غير موجود");
  }

  // Check if session can be modified
  await checkSessionModifiable(existing.group_id, existing.attendance_date);

  const result = await query(attendanceQueries.deleteAttendance, [id]);
  return result.rows[0];
};

// ============================================
// STATISTICS
// ============================================

const getGradeAttendanceStats = async (gradeId) => {
  const result = await query(attendanceQueries.getGradeAttendanceStats, [
    gradeId,
  ]);
  return result.rows;
};

const getOverallAttendanceStats = async () => {
  const result = await query(attendanceQueries.getOverallAttendanceStats);
  return result.rows;
};

const getStudentsWithThreeConsecutiveAbsences = async () => {
  const result = await query(
    attendanceQueries.getStudentsWithThreeConsecutiveAbsences,
  );
  return result.rows;
};

const getDashboard = async (groupId) => {
  if (!groupId) {
    throw new Error("معرف المجموعة مطلوب لعرض الإحصائيات");
  }

  const result = await query(attendanceQueries.getDashboard, [groupId]);
  return result.rows[0];
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Session management
  startSession,
  getActiveSession,
  getSessionById,
  toggleMakeupMode,
  closeSession,
  // Attendance
  createAttendance,
  getAttendanceByGroupAndDate,
  getAttendanceByGroupAndMonth,
  getAttendanceSummary,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAbsentByGroupAndDate,
  // Barcode
  scanBarcode,
  // Statistics
  getGradeAttendanceStats,
  getOverallAttendanceStats,
  getStudentsWithThreeConsecutiveAbsences,
  getDashboard,
  // Helpers
  checkAndSoftDeleteAbsentStudents,
};
