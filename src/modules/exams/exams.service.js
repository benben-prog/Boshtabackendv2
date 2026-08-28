const { query } = require("../../config/database");
const examQueries = require("./exams.queries");

// Create a new exam
const createExam = async (examData) => {
  const { title, grade_id, group_id, total_degree, exam_date, notes } =
    examData;
  const result = await query(examQueries.createExam, [
    title,
    grade_id,
    group_id,
    total_degree,
    exam_date,
    notes,
  ]);
  return result.rows[0];
};

// Get all exams
const getAllExams = async (page = 1) => {
  const result = await query(examQueries.getAllExams, [page]);
  return result.rows;
};

// Get exam by ID
const getExamById = async (examId) => {
  const result = await query(examQueries.getExamById, [examId]);
  return result.rows[0];
};

// Get exams by grade
const getExamsByGradeId = async (gradeId, page = 1) => {
  const result = await query(examQueries.getExamsByGradeId, [gradeId, page]);
  return result.rows;
};

// Get exams by group
const getExamsByGroupId = async (groupId, page = 1) => {
  const result = await query(examQueries.getExamsByGroupId, [groupId, page]);
  return result.rows;
};

// Update an exam
const updateExam = async (id, examData) => {
  const { title, grade_id, group_id, total_degree, exam_date, notes } =
    examData;
  const result = await query(examQueries.updateExam, [
    title,
    grade_id,
    group_id,
    total_degree,
    exam_date,
    notes,
    id,
  ]);
  return result.rows[0];
};

// Soft delete an exam
const softDeleteExam = async (id) => {
  const result = await query(examQueries.softDeleteExam, [id]);
  return result.rows[0];
};

// Hard delete an exam
const hardDeleteExam = async (id) => {
  const result = await query(examQueries.hardDeleteExam, [id]);
  return result.rows[0];
};

// Get exam statistics
const getExamStats = async (examId) => {
  const result = await query(examQueries.getExamStats, [examId]);
  return result.rows[0];
};

// Get grade exam statistics
const getGradeExamStats = async (gradeId) => {
  const result = await query(examQueries.getGradeExamStats, [gradeId]);
  return result.rows[0];
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  getExamsByGradeId,
  getExamsByGroupId,
  updateExam,
  softDeleteExam,
  hardDeleteExam,
  getExamStats,
  getGradeExamStats,
};
