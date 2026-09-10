const { query } = require("../../config/database");
const questionQueries = require("./questions.queries");
const { getNowEgypt } = require("../../utils/timezone");

// ============================================
// HELPER: Check if exam has started
// ============================================

const checkExamNotStarted = async (examId) => {
  const result = await query(questionQueries.getExamStartAt, [examId]);
  const exam = result.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  const now = getNowEgypt();
  const startAt = new Date(exam.start_at);

  if (now >= startAt) {
    throw new Error("لا يمكن تعديل الأسئلة بعد بدء الامتحان");
  }

  return exam;
};

// ============================================
// CREATE
// ============================================

const createQuestion = async (questionData) => {
  const {
    exam_id,
    question_text,
    type,
    file_path = null,
    order,
  } = questionData;

  // Check exam not started
  await checkExamNotStarted(exam_id);

  const result = await query(questionQueries.createQuestion, [
    exam_id,
    question_text,
    type,
    file_path,
    order,
  ]);

  return result.rows[0];
};

// ============================================
// GETTERS
// ============================================

const getQuestionsByExamId = async (examId) => {
  const result = await query(questionQueries.getQuestionsByExamId, [examId]);
  return result.rows;
};

const getQuestionById = async (questionId) => {
  const result = await query(questionQueries.getQuestionById, [questionId]);
  return result.rows[0];
};

// ============================================
// UPDATE
// ============================================

const updateQuestion = async (questionId, questionData) => {
  const { question_text, type, file_path, order } = questionData;

  // Get question with exam info
  const questionResult = await query(questionQueries.getQuestionWithExam, [
    questionId,
  ]);
  const question = questionResult.rows[0];

  if (!question) {
    return null;
  }

  // Check if exam has started
  const now = getNowEgypt();
  const examStart = new Date(question.exam_start_at);

  if (now >= examStart) {
    throw new Error("لا يمكن تعديل الأسئلة بعد بدء الامتحان");
  }

  // Update
  const result = await query(questionQueries.updateQuestion, [
    questionId,
    question_text ?? null,
    type ?? null,
    file_path ?? null,
    order ?? null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const deleteQuestion = async (questionId) => {
  // Get question with exam info
  const questionResult = await query(questionQueries.getQuestionWithExam, [
    questionId,
  ]);
  const question = questionResult.rows[0];

  if (!question) {
    return null;
  }

  // Check if exam has started
  const now = getNowEgypt();
  const examStart = new Date(question.exam_start_at);

  if (now >= examStart) {
    throw new Error("لا يمكن حذف الأسئلة بعد بدء الامتحان");
  }

  // Delete
  const result = await query(questionQueries.deleteQuestion, [questionId]);
  return result.rows[0];
};

// ============================================
// STATS
// ============================================

const getQuestionsCountByExam = async (examId) => {
  const result = await query(questionQueries.getQuestionsCountByExam, [examId]);
  return result.rows[0];
};

module.exports = {
  createQuestion,
  getQuestionsByExamId,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsCountByExam,
};
