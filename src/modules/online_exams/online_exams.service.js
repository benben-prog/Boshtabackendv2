const { query } = require("../../config/database");
const onlineExamQueries = require("./online_exams.queries");
const { getNowEgypt } = require("../../utils/timezone");

// ============================================
// HELPER: Check if exam has started
// ============================================

const hasExamStarted = async (examId) => {
  const examResult = await query(onlineExamQueries.getOnlineExamById, [examId]);
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  // Check if start_at has passed
  const now = getNowEgypt();
  const startAt = new Date(exam.start_at);
  const startPassed = now >= startAt;

  // Check if there are attempts
  const attemptsResult = await query(onlineExamQueries.countExamAttempts, [
    examId,
  ]);
  const attemptsCount = parseInt(attemptsResult.rows[0]?.count || 0);

  return {
    exam,
    hasStarted: startPassed || attemptsCount > 0,
    attemptsCount,
    startPassed,
  };
};

// ============================================
// CREATE
// ============================================

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

// ============================================
// GETTERS
// ============================================

const getAllOnlineExams = async (page = 1) => {
  const result = await query(onlineExamQueries.getAllOnlineExams, [page]);
  return result.rows;
};

const getOnlineExamById = async (examId) => {
  const result = await query(onlineExamQueries.getOnlineExamById, [examId]);
  return result.rows[0];
};

const getOnlineExamsByGradeId = async (gradeId, page = 1) => {
  const result = await query(onlineExamQueries.getOnlineExamsByGradeId, [
    gradeId,
    page,
  ]);
  return result.rows;
};

const getOnlineExamsByGroupId = async (groupId, page = 1) => {
  const result = await query(onlineExamQueries.getOnlineExamsByGroupId, [
    groupId,
    page,
  ]);
  return result.rows;
};

const getAvailableOnlineExams = async () => {
  const result = await query(onlineExamQueries.getAvailableOnlineExams);
  return result.rows;
};

const getExpiredOnlineExams = async () => {
  const result = await query(onlineExamQueries.getExpiredOnlineExams);
  return result.rows;
};

// ============================================
// UPDATE (with validation)
// ============================================

const updateOnlineExam = async (examId, examData) => {
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
  } = examData;

  // Check if exam has started
  const { hasStarted, exam } = await hasExamStarted(examId);

  // If exam has started, restrict update
  if (hasStarted) {
    // Validate end_at if provided
    let finalEndAt = null;

    if (end_at) {
      const newEndAt = new Date(end_at);
      const examStart = new Date(exam.start_at);
      const now = getNowEgypt();

      if (newEndAt <= examStart) {
        throw new Error("وقت النهاية يجب أن يكون بعد وقت البداية");
      }

      if (newEndAt <= now) {
        throw new Error("وقت النهاية يجب أن يكون في المستقبل");
      }

      finalEndAt = end_at;
    }

    // Restricted update: only title, description, end_at
    const result = await query(onlineExamQueries.updateOnlineExamRestricted, [
      examId,
      title ?? null,
      description ?? null,
      finalEndAt,
    ]);

    return result.rows[0];
  }

  // No start yet - full update allowed
  // Validate start_at < end_at if both provided
  const finalStartAt = start_at ?? exam.start_at;
  const finalEndAt = end_at ?? exam.end_at;

  if (new Date(finalStartAt) >= new Date(finalEndAt)) {
    throw new Error("وقت النهاية يجب أن يكون بعد وقت البداية");
  }

  const result = await query(onlineExamQueries.updateOnlineExam, [
    examId,
    title ?? null,
    description ?? null,
    grade_id ?? null,
    group_id ?? null,
    duration_minutes ?? null,
    start_at ?? null,
    end_at ?? null,
    full_mark ?? null,
    randomize_questions ?? null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const softDeleteOnlineExam = async (examId) => {
  const result = await query(onlineExamQueries.softDeleteOnlineExam, [examId]);
  return result.rows[0];
};

const hardDeleteOnlineExam = async (examId) => {
  const result = await query(onlineExamQueries.hardDeleteOnlineExam, [examId]);
  return result.rows[0];
};

// ============================================
// STATISTICS
// ============================================

const getOnlineExamStats = async (examId) => {
  const result = await query(onlineExamQueries.getOnlineExamStats, [examId]);
  return result.rows[0];
};

const getGradeOnlineExamStats = async (gradeId) => {
  const result = await query(onlineExamQueries.getGradeOnlineExamStats, [
    gradeId,
  ]);
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
