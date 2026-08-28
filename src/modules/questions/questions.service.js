const { query } = require("../../config/database");
const questionQueries = require("./questions.queries");

// Create question
const createQuestion = async (questionData) => {
  const {
    exam_id,
    question_text,
    type,
    file_path = null,
    order,
  } = questionData;
  const result = await query(questionQueries.createQuestion, [
    exam_id,
    question_text,
    type,
    file_path,
    order,
  ]);
  return result.rows[0];
};

// Get questions by exam ID
const getQuestionsByExamId = async (examId) => {
  const result = await query(questionQueries.getQuestionsByExamId, [examId]);
  return result.rows;
};

// Get question by ID
const getQuestionById = async (questionId) => {
  const result = await query(questionQueries.getQuestionById, [questionId]);
  return result.rows[0];
};

// Update question
const updateQuestion = async (questionId, questionData) => {
  const existing = await query("SELECT * FROM questions WHERE id = $1", [
    questionId,
  ]);
  if (!existing.rows[0]) return null;

  const updated = {
    question_text: questionData.question_text ?? existing.rows[0].question_text,
    type: questionData.type ?? existing.rows[0].type,
    file_path: questionData.file_path ?? existing.rows[0].file_path,
    order: questionData.order ?? existing.rows[0].order,
  };

  const result = await query(questionQueries.updateQuestion, [
    questionId,
    updated.question_text,
    updated.type,
    updated.file_path,
    updated.order,
  ]);
  return result.rows[0];
};

// Delete question
const deleteQuestion = async (questionId) => {
  const result = await query(questionQueries.deleteQuestion, [questionId]);
  return result.rows[0];
};

// Get questions count by exam
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
