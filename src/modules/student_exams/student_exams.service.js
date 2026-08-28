const { query } = require("../../config/database");
const studentExamQueries = require("./student_exams.queries");

// Create exam attempt
const createExamAttempt = async (examId, studentId) => {
  const result = await query(studentExamQueries.createExamAttempt, [
    examId,
    studentId,
  ]);
  return result.rows[0];
};

// Check existing attempt
const checkExistingAttempt = async (examId, studentId) => {
  const result = await query(studentExamQueries.checkExistingAttempt, [
    examId,
    studentId,
  ]);
  return result.rows[0];
};

// Get student exams by exam ID
const getStudentExamsByExamId = async (examId, page = 1) => {
  const result = await query(studentExamQueries.getStudentExamsByExamId, [
    examId,
    page,
  ]);
  return result.rows;
};

// Get exam attempt stats
const getExamAttemptStats = async (examId) => {
  const result = await query(studentExamQueries.getExamAttemptStats, [examId]);
  return result.rows[0];
};

// Get grade exam attempts stats
const getGradeExamAttemptsStats = async (gradeId) => {
  const result = await query(studentExamQueries.getGradeExamAttemptsStats, [
    gradeId,
  ]);
  return result.rows;
};

// Get group exam attempts stats
const getGroupExamAttemptsStats = async (groupId) => {
  const result = await query(studentExamQueries.getGroupExamAttemptsStats, [
    groupId,
  ]);
  return result.rows;
};

// Submit exam
const submitExam = async (attemptId, studentId, score) => {
  const result = await query(studentExamQueries.submitExam, [
    attemptId,
    studentId,
    score,
  ]);
  return result.rows[0];
};

// Auto submit expired exams
const autoSubmitExpiredExams = async () => {
  const result = await query(studentExamQueries.autoSubmitExpiredExams);
  return result.rows;
};

// Mark absent students
const markAbsentStudents = async () => {
  const result = await query(studentExamQueries.markAbsentStudents);
  return result.rows;
};

module.exports = {
  createExamAttempt,
  checkExistingAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  submitExam,
  autoSubmitExpiredExams,
  markAbsentStudents,
};
