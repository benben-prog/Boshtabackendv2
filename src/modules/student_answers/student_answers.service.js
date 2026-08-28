const { query } = require("../../config/database");
const studentAnswerQueries = require("./student_answers.queries");

// Insert MCQ/True-False answer
const insertAnswer = async (answerData) => {
  const { exam_id, student_id, question_id, selected_option_id, is_correct } =
    answerData;
  const result = await query(studentAnswerQueries.insertAnswer, [
    exam_id,
    student_id,
    question_id,
    selected_option_id,
    is_correct,
  ]);
  return result.rows[0];
};

// Insert essay answer with file
const insertEssayAnswer = async (answerData) => {
  const { exam_id, student_id, question_id, file_path } = answerData;
  const result = await query(studentAnswerQueries.insertEssayAnswer, [
    exam_id,
    student_id,
    question_id,
    file_path,
  ]);
  return result.rows[0];
};

// Update answer
const updateAnswer = async (answerId, answerData) => {
  const { selected_option_id, is_correct } = answerData;
  const result = await query(studentAnswerQueries.updateAnswer, [
    answerId,
    selected_option_id,
    is_correct,
  ]);
  return result.rows[0];
};

// Update essay answer file
const updateEssayAnswer = async (answerId, file_path) => {
  const result = await query(studentAnswerQueries.updateEssayAnswer, [
    answerId,
    file_path,
  ]);
  return result.rows[0];
};

// Delete answer
const deleteAnswer = async (answerId) => {
  const result = await query(studentAnswerQueries.deleteAnswer, [answerId]);
  return result.rows[0];
};

// Check if answer exists
const checkExistingAnswer = async (examId, studentId, questionId) => {
  const result = await query(studentAnswerQueries.checkExistingAnswer, [
    examId,
    studentId,
    questionId,
  ]);
  return result.rows[0];
};

// Get question answer stats
const getQuestionAnswerStats = async (questionId) => {
  const result = await query(studentAnswerQueries.getQuestionAnswerStats, [
    questionId,
  ]);
  return result.rows[0];
};

// Get most selected options
const getMostSelectedOptions = async (questionId) => {
  const result = await query(studentAnswerQueries.getMostSelectedOptions, [
    questionId,
  ]);
  return result.rows;
};

// Get student answers for an exam
const getStudentAnswersByExam = async (examId, studentId) => {
  const result = await query(studentAnswerQueries.getStudentAnswersByExam, [
    examId,
    studentId,
  ]);
  return result.rows;
};

const gradeEssayAnswer = async (answerId, is_correct) => {
  const result = await query(studentAnswerQueries.gradeEssayAnswer, [
    is_correct,
    answerId,
  ]);
  return result.rows[0];
};


// Get essay answers for grading
const getEssayAnswersForGrading = async () => {
  const result = await query(studentAnswerQueries.getEssayAnswersForGrading);
  return result.rows;
};

// Get essay answers by exam
const getEssayAnswersByExam = async (examId) => {
  const result = await query(studentAnswerQueries.getEssayAnswersByExam, [
    examId,
  ]);
  return result.rows;
};

module.exports = {
  insertAnswer,
  insertEssayAnswer,
  updateAnswer,
  updateEssayAnswer,
  deleteAnswer,
  checkExistingAnswer,
  getQuestionAnswerStats,
  getMostSelectedOptions,
  getStudentAnswersByExam,
  gradeEssayAnswer,
  getEssayAnswersForGrading,
  getEssayAnswersByExam,
};
