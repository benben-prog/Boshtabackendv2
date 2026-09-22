const { query } = require("../../config/database");
const parentQueries = require("./parent.queries");
const stdQr = require("../students/students.queries");
// ============================================
// GETTERS
// ============================================
const getPerentTokenByParentPhone = async (parent_phone) => {
  const result = await query(stdQr.findStudentByParentPhone, [parent_phone]);
  return result.rows[0];
};

const getStudentByParentToken = async (token) => {
  const result = await query(parentQueries.getStudentByParentToken, [
    token,
  ]);
  return result.rows[0];
};

const getParentDashboardAttendance = async (studentId) => {
  const result = await query(parentQueries.getParentDashboardAttendance, [
    studentId,
  ]);
  return result.rows[0];
};

const getAttendanceHistory = async (studentId, page = 1) => {
  const result = await query(parentQueries.getAttendanceHistory, [
    studentId,
    page,
  ]);
  return result.rows;
};

const getParentDashboardPayments = async (studentId) => {
  const result = await query(parentQueries.getParentDashboardPayments, [
    studentId,
  ]);
  return result.rows[0];
};

const getPaymentHistory = async (studentId, page = 1) => {
  const result = await query(parentQueries.getPaymentHistory, [
    studentId,
    page,
  ]);
  return result.rows;
};

const getAllExams = async (studentId) => {
  const result = await query(parentQueries.getParentAllExams, [studentId]);
  return result.rows;
};

const getParentDashboardAssignments = async (studentId) => {
  const result = await query(parentQueries.getParentDashboardAssignments, [
    studentId,
  ]);
  return result.rows;
};

const getGroupInfo = async (studentId) => {
  const result = await query(parentQueries.getGroupInfo, [studentId]);
  return result.rows[0];
};

const getStudentOverallStats = async (studentId) => {
  const result = await query(parentQueries.getStudentOverallStats, [studentId]);
  return result.rows[0];
};

module.exports = {
  getPerentTokenByParentPhone,
  getStudentByParentToken,
  getParentDashboardAttendance,
  getAttendanceHistory,
  getParentDashboardPayments,
  getPaymentHistory,
  getAllExams,
  getParentDashboardAssignments,
  getGroupInfo,
  getStudentOverallStats,
};
