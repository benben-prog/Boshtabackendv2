const { query } = require("../../config/database");
const examQueries = require("./exams.queries");

// ============================================
// CREATE
// ============================================

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

// ============================================
// GETTERS
// ============================================

const getAllExams = async (page = 1) => {
  const result = await query(examQueries.getAllExams, [page]);
  return result.rows;
};

const getExamById = async (examId) => {
  const result = await query(examQueries.getExamById, [examId]);
  return result.rows[0];
};

const getExamsByGradeId = async (gradeId, page = 1) => {
  const result = await query(examQueries.getExamsByGradeId, [gradeId, page]);
  return result.rows;
};

const getExamsByGroupId = async (groupId, page = 1) => {
  const result = await query(examQueries.getExamsByGroupId, [groupId, page]);
  return result.rows;
};

// ============================================
// UPDATE (with validation)
// ============================================

const updateExam = async (id, examData) => {
  const { title, grade_id, group_id, total_degree, exam_date, notes } =
    examData;

  // Check if exam exists
  const existingResult = await query(examQueries.getExamById, [id]);
  const existing = existingResult.rows[0];

  if (!existing) {
    return null;
  }

  // Check if there are exam results
  const resultCountResult = await query(examQueries.countExamResults, [id]);
  const resultCount = parseInt(resultCountResult.rows[0]?.count || 0);

  // If there are results, restrict update (no total_degree)
  if (resultCount > 0) {
    const result = await query(examQueries.updateExamRestricted, [
      id,
      title ?? null,
      grade_id ?? null,
      group_id ?? null,
      exam_date ?? null,
      notes ?? null,
    ]);
    return result.rows[0];
  }

  // No results - full update allowed
  const result = await query(examQueries.updateExam, [
    id,
    title ?? null,
    grade_id ?? null,
    group_id ?? null,
    total_degree ?? null,
    exam_date ?? null,
    notes ?? null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const softDeleteExam = async (id) => {
  const result = await query(examQueries.softDeleteExam, [id]);
  return result.rows[0];
};

const hardDeleteExam = async (id) => {
  const result = await query(examQueries.hardDeleteExam, [id]);
  return result.rows[0];
};

// ============================================
// STATISTICS
// ============================================

const getExamStats = async (examId) => {
  const result = await query(examQueries.getExamStats, [examId]);
  return result.rows[0];
};

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
