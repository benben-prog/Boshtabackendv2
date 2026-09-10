const { query } = require("../../config/database");
const studentAnswerQueries = require("./student_answers.queries");
const studentExamService = require("../student_exams/student_exams.service");
const { getNowEgypt } = require("../../utils/timezone");

// ============================================
// HELPER: Validate exam attempt and timing
// ============================================

const validateExamAttempt = async (examId, studentId, questionId) => {
  // Get question + exam info in one query
  const questionResult = await query(studentAnswerQueries.getQuestionWithExam, [
    questionId,
    examId,
  ]);
  const question = questionResult.rows[0];

  if (!question) {
    throw new Error("السؤال غير موجود في هذا الامتحان");
  }

  // Check active attempt
  const attemptResult = await query(studentAnswerQueries.getActiveAttempt, [
    examId,
    studentId,
  ]);
  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("يجب بدء الامتحان أولاً");
  }

  // Check if exam time is still valid
  const now = getNowEgypt();
  const examEnd = new Date(question.exam_end_at);

  // Check by exam end time
  if (now > examEnd) {
    throw new Error("انتهى وقت الامتحان");
  }

  // Check by duration
  const startedAt = new Date(attempt.started_at);
  const durationMs = question.duration_minutes * 60 * 1000;
  const elapsedMs = now.getTime() - startedAt.getTime();

  if (elapsedMs > durationMs) {
    throw new Error("انتهى وقت الامتحان");
  }

  return {
    question,
    attempt,
  };
};

// ============================================
// INSERT MCQ/TRUE-FALSE ANSWER
// ============================================

const insertAnswer = async (answerData) => {
  const { exam_id, student_id, question_id, selected_option_id } = answerData;

  const { question } = await validateExamAttempt(
    exam_id,
    student_id,
    question_id,
  );

  if (question.question_type === "essay") {
    throw new Error("هذا سؤال مقالي - استخدم رفع ملف");
  }

  // Get option correctness
  const optionResult = await query(
    studentAnswerQueries.getOptionWithCorrectness,
    [selected_option_id, question_id],
  );
  const option = optionResult.rows[0];

  if (!option) {
    throw new Error("الاختيار غير صحيح");
  }

  const isCorrect = option.is_correct;

  const result = await query(studentAnswerQueries.insertAnswer, [
    exam_id,
    student_id,
    question_id,
    selected_option_id,
    isCorrect,
  ]);

  return {
    ...result.rows[0],
    is_correct: isCorrect,
  };
};

// ============================================
// UPDATE MCQ/TRUE-FALSE ANSWER
// ============================================

const updateAnswer = async (answerId, answerData) => {
  const { selected_option_id } = answerData;

  // Get existing answer
  const oldAnswer = await query("SELECT * FROM student_answers WHERE id = $1", [
    answerId,
  ]);

  if (!oldAnswer.rows[0]) {
    throw new Error("الإجابة غير موجودة");
  }

  const answer = oldAnswer.rows[0];

  // Validate attempt and timing
  await validateExamAttempt(
    answer.exam_id,
    answer.student_id,
    answer.question_id,
  );

  // Get option correctness
  const optionResult = await query(
    studentAnswerQueries.getOptionWithCorrectness,
    [selected_option_id, answer.question_id],
  );
  const option = optionResult.rows[0];

  if (!option) {
    throw new Error("الاختيار غير صحيح");
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

// ============================================
// INSERT ESSAY ANSWER
// ============================================

const insertEssayAnswer = async (answerData) => {
  const { exam_id, student_id, question_id, file_path } = answerData;

  const { question } = await validateExamAttempt(
    exam_id,
    student_id,
    question_id,
  );

  if (question.question_type !== "essay") {
    throw new Error("هذا السؤال ليس مقالي");
  }

  const result = await query(studentAnswerQueries.insertEssayAnswer, [
    exam_id,
    student_id,
    question_id,
    file_path,
  ]);

  return result.rows[0];
};

// ============================================
// UPDATE ESSAY ANSWER
// ============================================

const updateEssayAnswer = async (answerId, file_path) => {
  const result = await query(studentAnswerQueries.updateEssayAnswer, [
    answerId,
    file_path,
  ]);
  return result.rows[0];
};

// ============================================
// DELETE ANSWER
// ============================================

const deleteAnswer = async (answerId) => {
  const result = await query(studentAnswerQueries.deleteAnswer, [answerId]);
  return result.rows[0];
};

// ============================================
// CHECK EXISTING ANSWER
// ============================================

const checkExistingAnswer = async (examId, studentId, questionId) => {
  const result = await query(studentAnswerQueries.checkExistingAnswer, [
    examId,
    studentId,
    questionId,
  ]);
  return result.rows[0];
};

// ============================================
// GET QUESTION STATS
// ============================================

const getQuestionAnswerStats = async (questionId) => {
  const result = await query(studentAnswerQueries.getQuestionAnswerStats, [
    questionId,
  ]);
  return result.rows[0];
};

// ============================================
// GET MOST SELECTED OPTIONS
// ============================================

const getMostSelectedOptions = async (questionId) => {
  const result = await query(studentAnswerQueries.getMostSelectedOptions, [
    questionId,
  ]);
  return result.rows;
};

// ============================================
// GET STUDENT ANSWERS
// ============================================

const getStudentAnswersByExam = async (examId, studentId) => {
  const result = await query(studentAnswerQueries.getStudentAnswersByExam, [
    examId,
    studentId,
  ]);
  return result.rows;
};

// ============================================
// GRADE ESSAY ANSWER
// ============================================

const gradeEssayAnswer = async (answerId, is_correct) => {
  const result = await query(studentAnswerQueries.gradeEssayAnswer, [
    is_correct,
    answerId,
  ]);

  const gradedAnswer = result.rows[0];

  if (gradedAnswer) {
    const answerInfo = await query(
      "SELECT exam_id, student_id FROM student_answers WHERE id = $1",
      [answerId],
    );

    if (answerInfo.rows[0]) {
      await studentExamService.recalculateScoreAfterEssayGrading(
        answerInfo.rows[0].exam_id,
        answerInfo.rows[0].student_id,
      );
    }
  }

  return gradedAnswer;
};

// ============================================
// GET ESSAY ANSWERS FOR GRADING
// ============================================

const getEssayAnswersForGrading = async () => {
  const result = await query(studentAnswerQueries.getEssayAnswersForGrading);
  return result.rows;
};

// ============================================
// GET ESSAY ANSWERS BY EXAM
// ============================================

const getEssayAnswersByExam = async (examId) => {
  const result = await query(studentAnswerQueries.getEssayAnswersByExam, [
    examId,
  ]);
  return result.rows;
};

// ============================================
// GET ANSWER FILE PATH
// ============================================

const getAnswerFilePath = async (answerId) => {
  const result = await query(studentAnswerQueries.getAnswerFilePath, [
    answerId,
  ]);
  return result.rows[0];
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
  getAnswerFilePath,
};
