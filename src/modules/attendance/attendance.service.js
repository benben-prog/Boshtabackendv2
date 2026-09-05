const { query } = require("../../config/database");
const attendanceQueries = require("./attendance.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");
const { getTodayEgypt, formatEgyptTime } = require("../../utils/timezone");

// Create or update attendance record (Upsert)
const createAttendance = async (attendanceData) => {
  const {
    student_id,
    group_id,
    grade_id,
    attendance_date,
    status,
    attendance_time,
    method = "manual",
    is_makeup = 0,
    makeup_group_id = null,
    notes = null,
  } = attendanceData;

  const result = await query(attendanceQueries.createAttendance, [
    student_id,
    group_id,
    grade_id,
    attendance_date,
    status,
    attendance_time,
    method,
    is_makeup,
    makeup_group_id,
    notes,
  ]);

  const attendance = result.rows[0];

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
      console.error("Error enqueueing absence message:", error);
    }
  }

  return attendance;
};

// Get attendance by group and date
const getAttendanceByGroupAndDate = async (groupId, date) => {
  const result = await query(attendanceQueries.getAttendanceByGroupAndDate, [
    groupId,
    date || getTodayEgypt(),
  ]);
  return result.rows;
};

// Get attendance by group and month
const getAttendanceByGroupAndMonth = async (groupId, month, page = 1) => {
  const result = await query(attendanceQueries.getAttendanceByGroupAndMonth, [
    groupId,
    month,
    page,
  ]);
  return result.rows;
};

// Get attendance summary
const getAttendanceSummary = async (groupId, date) => {
  const result = await query(attendanceQueries.getAttendanceSummary, [
    groupId,
    date || getTodayEgypt(),
  ]);
  return result.rows[0];
};

// Mark all unmarked students as absent
const markRestAbsent = async (groupId, date) => {
  const result = await query(attendanceQueries.markRestAbsent, [groupId, date]);
  return result.rows;
};

// Get grade attendance stats
const getGradeAttendanceStats = async (gradeId) => {
  const result = await query(attendanceQueries.getGradeAttendanceStats, [
    gradeId,
  ]);
  return result.rows;
};

// Get overall attendance stats
const getOverallAttendanceStats = async () => {
  const result = await query(attendanceQueries.getOverallAttendanceStats);
  return result.rows;
};

// Get students with 3+ consecutive absences
const getStudentsWithThreeConsecutiveAbsences = async () => {
  const result = await query(
    attendanceQueries.getStudentsWithThreeConsecutiveAbsences,
  );
  return result.rows;
};

// Get attendance by ID
const getAttendanceById = async (id) => {
  const result = await query(attendanceQueries.getAttendanceById, [id]);
  return result.rows[0];
};

// Update attendance record
const updateAttendance = async (id, attendanceData) => {
  const { status, attendance_time, method, is_makeup, makeup_group_id, notes } =
    attendanceData;

  const result = await query(attendanceQueries.updateAttendance, [
    status,
    attendance_time,
    method,
    is_makeup,
    makeup_group_id,
    notes,
    id,
  ]);
  return result.rows[0];
};

// Delete attendance record
const deleteAttendance = async (id) => {
  const result = await query(attendanceQueries.deleteAttendance, [id]);
  return result.rows[0];
};

// Get dashboard stats
const getDashboard = async () => {
  const result = await query(attendanceQueries.getDashboard);
  return result.rows[0];
};

// Start new session
const startSession = async (sessionData) => {
  const { group_id, grade_id, started_by, lock_at } = sessionData;

  // Check if session exists
  const existing = await query(attendanceQueries.checkActiveSession, [
    group_id,
  ]);
  if (existing.rows[0]) {
    throw new Error("توجد جلسة نشطة بالفعل لهذه المجموعة!");
  }

  const result = await query(attendanceQueries.startSession, [
    group_id,
    grade_id,
    started_by,
    lock_at,
  ]);
  return result.rows[0];
};

// Get active session
const getActiveSession = async (groupId) => {
  const result = await query(attendanceQueries.checkActiveSession, [groupId]);
  return result.rows[0];
};

// Toggle makeup mode
const toggleMakeupMode = async (sessionId) => {
  const result = await query(attendanceQueries.toggleMakeupMode, [sessionId]);
  return result.rows[0];
};

// Scan barcode
const scanBarcode = async (barcode, sessionData) => {
  const { session_id, group_id, grade_id } = sessionData;

  // Get session
  const session = await getActiveSession(group_id);
  if (!session) {
    throw new Error("لا توجد جلسة نشطة لهذه المجموعة!");
  }

  // Check if session is locked
  if (session.status === "locked") {
    throw new Error("الجلسة مقفلة - انتهى وقت تسجيل الحضور!");
  }

  // Check student
  const student = await query(attendanceQueries.checkStudentByBarcode, [
    barcode,
  ]);
  const studentData = student.rows[0];

  if (!studentData) {
    throw new Error("الطالب غير موجود!");
  }

  // Check if student belongs to this group or grade (makeup)
  let is_makeup = 0;
  let makeup_group_id = null;

  if (studentData.group_id === group_id) {
    is_makeup = 0;
  } else if (
    session.is_makeup_enabled === 1 &&
    studentData.grade_id === grade_id
  ) {
    is_makeup = 1;
    makeup_group_id = studentData.group_id;
  } else {
    throw new Error("الطالب غير تابع لهذه المجموعة!");
  }

  // Check if already attended
  const existing = await query(attendanceQueries.checkExistingAttendance, [
    studentData.id,
  ]);
  if (existing.rows[0]) {
    throw new Error("الطالب مسجل حضوره بالفعل!");
  }

  // Record attendance
  const attendance = await query(
    attendanceQueries.recordAttendanceWithSession,
    [studentData.id, group_id, grade_id, is_makeup, makeup_group_id],
  );

  return {
    student: studentData,
    attendance: attendance.rows[0],
    is_makeup,
  };
};

// Lock session
const lockSession = async (sessionId, groupId) => {
  await query(attendanceQueries.lockSession, [sessionId]);
  const absent = await query(attendanceQueries.markAbsentInSession, [groupId]);
  return absent.rows;
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
