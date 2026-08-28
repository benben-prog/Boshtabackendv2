const { query } = require("../../config/database");
const onlineExamQueries = require("./online_exams.queries");

// Get all online exams
const getAllOnlineExams = async (page = 1) => {
  const result = await query(onlineExamQueries.getAllOnlineExams, [page]);
  return result.rows;
};

// Get online exam by ID
const getOnlineExamById = async (examId) => {
  const result = await query(onlineExamQueries.getOnlineExamById, [examId]);
  return result.rows[0];
};

// Get online exams by grade
const getOnlineExamsByGradeId = async (gradeId, page = 1) => {
  const result = await query(onlineExamQueries.getOnlineExamsByGradeId, [
    gradeId,
    page,
  ]);
  return result.rows;
};

// Get online exams by group
const getOnlineExamsByGroupId = async (groupId, page = 1) => {
  const result = await query(onlineExamQueries.getOnlineExamsByGroupId, [
    groupId,
    page,
  ]);
  return result.rows;
};

// Get available online exams
const getAvailableOnlineExams = async () => {
  const result = await query(onlineExamQueries.getAvailableOnlineExams);
  return result.rows;
};

// Get expired online exams
const getExpiredOnlineExams = async () => {
  const result = await query(onlineExamQueries.getExpiredOnlineExams);
  return result.rows;
};

// Get online exam stats
const getOnlineExamStats = async (examId) => {
  const result = await query(onlineExamQueries.getOnlineExamStats, [examId]);
  return result.rows[0];
};

// Get grade online exam stats
const getGradeOnlineExamStats = async (gradeId) => {
  const result = await query(onlineExamQueries.getGradeOnlineExamStats, [
    gradeId,
  ]);
  return result.rows[0];
};

// Create online exam
const createOnlineExam = async (examData) => {
  const {
    title,
    description,
    grade_id,
    group_id,
    duration_minutes,
    start_at,
    end_at,
    full_mark,
    randomize_questions,
    created_by,
  } = examData;

  const result = await query(onlineExamQueries.createOnlineExam, [
    title,
    description,
    grade_id,
    group_id,
    duration_minutes,
    start_at,
    end_at,
    full_mark,
    randomize_questions,
    created_by,
  ]);
  return result.rows[0];
};

// Update online exam
const updateOnlineExam = async (examId, examData) => {
  const existing = await query(
    "SELECT * FROM online_exams WHERE id = $1 AND deleted = 0",
    [examId],
  );
  if (!existing.rows[0]) return null;

  const updated = {
    title: examData.title ?? existing.rows[0].title,
    description: examData.description ?? existing.rows[0].description,
    grade_id: examData.grade_id ?? existing.rows[0].grade_id,
    group_id: examData.group_id ?? existing.rows[0].group_id,
    duration_minutes:
      examData.duration_minutes ?? existing.rows[0].duration_minutes,
    start_at: examData.start_at ?? existing.rows[0].start_at,
    end_at: examData.end_at ?? existing.rows[0].end_at,
    full_mark: examData.full_mark ?? existing.rows[0].full_mark,
    randomize_questions:
      examData.randomize_questions ?? existing.rows[0].randomize_questions,
  };

  const result = await query(onlineExamQueries.updateOnlineExam, [
    examId,
    updated.title,
    updated.description,
    updated.grade_id,
    updated.group_id,
    updated.duration_minutes,
    updated.start_at,
    updated.end_at,
    updated.full_mark,
    updated.randomize_questions,
  ]);
  return result.rows[0];
};

// Soft delete online exam
const softDeleteOnlineExam = async (examId) => {
  const result = await query(onlineExamQueries.softDeleteOnlineExam, [examId]);
  return result.rows[0];
};

// Hard delete online exam
const hardDeleteOnlineExam = async (examId) => {
  const result = await query(onlineExamQueries.hardDeleteOnlineExam, [examId]);
  return result.rows[0];
};

module.exports = {
  getAllOnlineExams,
  getOnlineExamById,
  getOnlineExamsByGradeId,
  getOnlineExamsByGroupId,
  getAvailableOnlineExams,
  getExpiredOnlineExams,
  getOnlineExamStats,
  getGradeOnlineExamStats,
  createOnlineExam,
  updateOnlineExam,
  softDeleteOnlineExam,
  hardDeleteOnlineExam,
};
