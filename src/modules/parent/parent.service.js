const { query } = require("../../config/database");
const parentQueries = require("./parent.queries");

// Get student by parent token
const getStudentByParentToken = async (token) => {
  const result = await query(parentQueries.getStudentByParentToken, [token]);
  return result.rows[0];
};

// Get attendance summary
const getParentDashboardAttendance = async (studentId) => {
  const result = await query(parentQueries.getParentDashboardAttendance, [
    studentId,
  ]);
  return result.rows[0];
};

// Get attendance history
const getAttendanceHistory = async (studentId, page = 1) => {
  const result = await query(parentQueries.getAttendanceHistory, [
    studentId,
    page,
  ]);
  return result.rows;
};

// Get payments summary
const getParentDashboardPayments = async (studentId) => {
  const result = await query(parentQueries.getParentDashboardPayments, [
    studentId,
  ]);
  return result.rows[0];
};

// Get payment history
const getPaymentHistory = async (studentId, page = 1) => {
  const result = await query(parentQueries.getPaymentHistory, [
    studentId,
    page,
  ]);
  return result.rows;
};

// Get paper exams
const getPaperExams = async (studentId) => {
  const result = await query(parentQueries.getPaperExams, [studentId]);
  return result.rows;
};

// Get online exams
const getOnlineExams = async (studentId) => {
  const result = await query(parentQueries.getOnlineExams, [studentId]);
  return result.rows;
};

// Get assignments
const getParentDashboardAssignments = async (studentId) => {
  const result = await query(parentQueries.getParentDashboardAssignments, [
    studentId,
  ]);
  return result.rows;
};

// Get group info
const getGroupInfo = async (studentId) => {
  const result = await query(parentQueries.getGroupInfo, [studentId]);
  return result.rows[0];
};

// Get overall stats
const getStudentOverallStats = async (studentId) => {
  const result = await query(parentQueries.getStudentOverallStats, [studentId]);
  return result.rows[0];
};

module.exports = {
  getStudentByParentToken,
  getParentDashboardAttendance,
  getAttendanceHistory,
  getParentDashboardPayments,
  getPaymentHistory,
  getPaperExams,
  getOnlineExams,
  getParentDashboardAssignments,
  getGroupInfo,
  getStudentOverallStats,
};
