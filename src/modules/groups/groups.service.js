const { query } = require("../../config/database");
const groupQueries = require("./groups.queries");

// ============================================
// CREATE
// ============================================

const createGroup = async (groupData) => {
  const { name, grade_id, days, start_time, end_time, room } = groupData;
  const result = await query(groupQueries.createGroup, [
    name,
    grade_id,
    days,
    start_time,
    end_time,
    room,
  ]);
  return result.rows[0];
};

// ============================================
// GETTERS
// ============================================

const getAllGroups = async (filters = {}) => {
  const { grade_id = null, search = "" } = filters;
  const searchPattern = search ? `%${search}%` : "";

  const result = await query(groupQueries.getAllGroups, [
    grade_id,
    searchPattern,
  ]);
  return result.rows;
};

const getGroupById = async (groupId) => {
  const result = await query(groupQueries.getGroupById, [groupId]);
  return result.rows[0];
};

const findGroupByName = async (name, grade_id) => {
  const result = await query(groupQueries.findGroupByName, [name, grade_id]);
  return result.rows[0];
};

const getGroupsByGradeId = async (gradeId) => {
  const result = await query(groupQueries.getGroupsByGradeId, [gradeId]);
  return result.rows;
};

// ============================================
// UPDATE
// ============================================

const updateGroup = async (id, groupData) => {
  const { name, days, start_time, end_time, room } = groupData;

  const result = await query(groupQueries.updateGroup, [
    name ?? null,
    days ?? null,
    start_time ?? null,
    end_time ?? null,
    room ?? null,
    id,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const softDeleteGroup = async (id) => {
  const result = await query(groupQueries.softDeleteGroup, [id]);
  return result.rows[0];
};

const hardDeleteGroup = async (id) => {
  const result = await query(groupQueries.hardDeleteGroup, [id]);
  return result.rows[0];
};

// ============================================
// STATISTICS
// ============================================

const getGroupStats = async (groupId) => {
  const result = await query(groupQueries.getGroupStats, [groupId]);
  return result.rows[0];
};

const getAllGroupsStats = async () => {
  const result = await query(groupQueries.getAllGroupsStats);
  return result.rows;
};

const getGroupsWithStudentsCount = async () => {
  const result = await query(groupQueries.getGroupsWithStudentsCount);
  return result.rows;
};

const getGroupsWithGradeName = async () => {
  const result = await query(groupQueries.getGroupsWithGradeName);
  return result.rows;
};

// ============================================
// FULL STATS (OPTIMIZED - PARALLEL QUERIES)
// ============================================

const getGroupFullStats = async (groupId) => {
  // Run all queries in parallel
  const [
    basicResult,
    attendanceResult,
    paymentResult,
    examResult,
    studentsResult,
  ] = await Promise.all([
    query(groupQueries.getGroupBasicStats, [groupId]),
    query(groupQueries.getGroupAttendanceStats, [groupId]),
    query(groupQueries.getGroupPaymentStats, [groupId]),
    query(groupQueries.getGroupExamStats, [groupId]),
    query(groupQueries.getGroupStudentsList, [groupId]),
  ]);

  const basic = basicResult.rows[0];

  if (!basic) {
    return null;
  }

  const attendance = attendanceResult.rows[0] || {
    attendance_percentage: 0,
    present_days: 0,
    absent_days: 0,
  };

  const payment = paymentResult.rows[0] || {
    total_required: 0,
    total_paid: 0,
    total_remaining: 0,
    paid_percentage: 0,
    fully_paid_students: 0,
    unpaid_students: 0,
  };

  const exam = examResult.rows[0] || {
    avg_exam_score: 0,
    highest_score: 0,
    lowest_score: 0,
  };

  return {
    // Basic info
    id: basic.id,
    name: basic.name,
    grade_id: basic.grade_id,
    grade_name: basic.grade_name,
    days: basic.days,
    start_time: basic.start_time,
    end_time: basic.end_time,
    room: basic.room,
    created_at: basic.created_at,
    updated_at: basic.updated_at,
    // Students
    total_students: basic.total_students,
    active_students: basic.active_students,
    deleted_students: basic.deleted_students,
    // Attendance
    attendance_percentage: attendance.attendance_percentage || 0,
    present_days: attendance.present_days || 0,
    absent_days: attendance.absent_days || 0,
    // Payments
    total_required: payment.total_required || 0,
    total_paid: payment.total_paid || 0,
    total_remaining: payment.total_remaining || 0,
    paid_percentage: payment.paid_percentage || 0,
    fully_paid_students: payment.fully_paid_students || 0,
    unpaid_students: payment.unpaid_students || 0,
    // Exams
    avg_exam_score: exam.avg_exam_score || 0,
    highest_score: exam.highest_score || 0,
    lowest_score: exam.lowest_score || 0,
    // Students list
    students_list: studentsResult.rows,
  };
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  findGroupByName,
  getGroupsByGradeId,
  updateGroup,
  softDeleteGroup,
  hardDeleteGroup,
  getGroupStats,
  getAllGroupsStats,
  getGroupsWithStudentsCount,
  getGroupsWithGradeName,
  getGroupFullStats,
};
