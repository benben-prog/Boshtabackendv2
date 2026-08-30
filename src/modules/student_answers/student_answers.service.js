const { query } = require("../../config/database");
const studentAnswerQueries = require("./student_answers.queries");

// Insert MCQ/True-False answer with auto verification
const insertAnswer = async (answerData) => {
  const { exam_id, student_id, question_id, selected_option_id } = answerData;

  const attemptCheck = await query(
    "SELECT id FROM student_exams WHERE exam_id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [exam_id, student_id],
  );

  if (!attemptCheck.rows[0]) {
    throw new Error("Please start the exam first");
  }

  const questionCheck = await query(
    "SELECT id, type FROM questions WHERE id = $1 AND exam_id = $2",
    [question_id, exam_id],
  );
  const question = questionCheck.rows[0];

  if (!question) {
    throw new Error("Question not found in this exam");
  }

  if (question.type === "essay") {
    throw new Error("This is an essay question - use file upload");
  }

  const optionCheck = await query(
    "SELECT id, is_correct FROM options WHERE id = $1 AND question_id = $2",
    [selected_option_id, question_id],
  );
  const option = optionCheck.rows[0];

  if (!option) {
    throw new Error("Invalid option");
  }

  const is_correct = option.is_correct;

  const result = await query(studentAnswerQueries.insertAnswer, [
    exam_id,
    student_id,
    question_id,
    selected_option_id,
    is_correct,
  ]);

  return {
    ...result.rows[0],
    is_correct,
  };
};

// Update answer
const updateAnswer = async (answerId, answerData) => {
  const { selected_option_id } = answerData;

  const oldAnswer = await query("SELECT * FROM student_answers WHERE id = $1", [
    answerId,
  ]);

  if (!oldAnswer.rows[0]) {
    throw new Error("Answer not found");
  }

  const optionCheck = await query(
    "SELECT is_correct FROM options WHERE id = $1 AND question_id = $2",
    [selected_option_id, oldAnswer.rows[0].question_id],
  );
  const option = optionCheck.rows[0];

  if (!option) {
    throw new Error("Invalid option");
  }

  const result = await query(studentAnswerQueries.updateAnswer, [
    answerId,
    selected_option_id,
    option.is_correct,
  ]);

  return {
    ...result.rows[0],
    is_correct: option.is_correct,
  };
};

// Insert essay answer with file
const insertEssayAnswer = async (answerData) => {
  const { exam_id, student_id, question_id, file_path } = answerData;

  const attemptCheck = await query(
    "SELECT id FROM student_exams WHERE exam_id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [exam_id, student_id],
  );

  if (!attemptCheck.rows[0]) {
    throw new Error("Please start the exam first");
  }

  const questionCheck = await query(
    "SELECT id, type FROM questions WHERE id = $1 AND exam_id = $2",
    [question_id, exam_id],
  );
  const question = questionCheck.rows[0];

  if (!question) {
    throw new Error("Question not found in this exam");
  }

  if (question.type !== "essay") {
    throw new Error("This is not an essay question");
  }

  const result = await query(studentAnswerQueries.insertEssayAnswer, [
    exam_id,
    student_id,
    question_id,
    file_path,
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

// Check existing answer
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

// Grade essay answer
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
  updateAnswer,
  insertEssayAnswer,
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
