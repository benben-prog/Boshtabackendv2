const { query } = require("../../config/database");
const optionQueries = require("./options.queries");
const questionQueries = require("../questions/questions.queries");
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
    throw new Error("لا يمكن تعديل الاختيارات بعد بدء الامتحان");
  }

  return exam;
};

// ============================================
// CREATE
// ============================================

const createOption = async (optionData) => {
  const { question_id, option_text, is_correct, order } = optionData;

  // Get question to know exam_id
  const questionResult = await query(questionQueries.getQuestionById, [
    question_id,
  ]);
  const question = questionResult.rows[0];

  if (!question) {
    throw new Error("السؤال غير موجود");
  }

  // Check exam not started
  await checkExamNotStarted(question.exam_id);

  // If is_correct = 1, check if there's already a correct option
  if (is_correct === 1 && question.type !== "essay") {
    const correctCountResult = await query(optionQueries.countCorrectOptions, [
      question_id,
    ]);
    const correctCount = parseInt(correctCountResult.rows[0]?.count || 0);

    if (correctCount > 0) {
      throw new Error("يوجد إجابة صحيحة بالفعل لهذا السؤال");
    }
  }

  const result = await query(optionQueries.createOption, [
    question_id,
    option_text,
    is_correct,
    order,
  ]);

  return result.rows[0];
};

// ============================================
// GETTERS
// ============================================

const getOptionsByQuestionId = async (questionId) => {
  const result = await query(optionQueries.getOptionsByQuestionId, [
    questionId,
  ]);
  return result.rows;
};

const getOptionById = async (optionId) => {
  const result = await query(optionQueries.getOptionById, [optionId]);
  return result.rows[0];
};

// ============================================
// UPDATE
// ============================================

const updateOption = async (optionId, optionData) => {
  const { option_text, is_correct, order } = optionData;

  // Get option with exam info
  const optionResult = await query(optionQueries.getOptionWithExam, [optionId]);
  const option = optionResult.rows[0];

  if (!option) {
    return null;
  }

  // Check if exam has started
  const now = getNowEgypt();
  const examStart = new Date(option.exam_start_at);

  if (now >= examStart) {
    throw new Error("لا يمكن تعديل الاختيارات بعد بدء الامتحان");
  }

  // If changing to is_correct = 1, check if there's already a correct option (different one)
  if (is_correct === 1) {
    const correctCountResult = await query(optionQueries.countCorrectOptions, [
      option.question_id,
    ]);
    const correctCount = parseInt(correctCountResult.rows[0]?.count || 0);

    // Check if the current option was already correct (then we can update it)
    if (correctCount > 0 && option.is_correct !== 1) {
      throw new Error("يوجد إجابة صحيحة بالفعل لهذا السؤال");
    }
  }

  const result = await query(optionQueries.updateOption, [
    optionId,
    option_text ?? null,
    is_correct ?? null,
    order ?? null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const deleteOption = async (optionId) => {
  // Get option with exam info
  const optionResult = await query(optionQueries.getOptionWithExam, [optionId]);
  const option = optionResult.rows[0];

  if (!option) {
    return null;
  }

  // Check if exam has started
  const now = getNowEgypt();
  const examStart = new Date(option.exam_start_at);

  if (now >= examStart) {
    throw new Error("لا يمكن حذف الاختيارات بعد بدء الامتحان");
  }

  const result = await query(optionQueries.deleteOption, [optionId]);
  return result.rows[0];
};

// ============================================
// DELETE BY QUESTION
// ============================================

const deleteOptionsByQuestionId = async (questionId) => {
  const result = await query(optionQueries.deleteOptionsByQuestionId, [
    questionId,
  ]);
  return result.rows;
};

module.exports = {
  createOption,
  getOptionsByQuestionId,
  getOptionById,
  updateOption,
  deleteOption,
  deleteOptionsByQuestionId,
};
