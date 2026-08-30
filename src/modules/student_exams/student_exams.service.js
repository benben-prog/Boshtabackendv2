const { query } = require("../../config/database");
const studentExamQueries = require("./student_exams.queries");

// Create exam attempt
const createExamAttempt = async (examId, studentId) => {
  const examCheck = await query(
    "SELECT id, start_at, end_at, full_mark, title, duration_minutes, grade_id, group_id FROM online_exams WHERE id = $1 AND deleted = 0",
    [examId],
  );
  const exam = examCheck.rows[0];

  if (!exam) {
    throw new Error("Exam not found");
  }

  const existingAttempt = await query(studentExamQueries.checkExistingAttempt, [
    examId,
    studentId,
  ]);

  if (existingAttempt.rows[0]) {
    const attempt = existingAttempt.rows[0];

    if (attempt.submitted_at === null) {
      return {
        ...attempt,
        is_resumed: true,
      };
    }

    throw new Error("You have already completed this exam");
  }

  const now = new Date();
  const startAt = new Date(exam.start_at);
  const endAt = new Date(exam.end_at);

  if (now < startAt) {
    throw new Error("Exam has not started yet");
  }

  if (now > endAt) {
    throw new Error("Exam time has ended");
  }

  const studentCheck = await query(
    "SELECT id, grade_id, group_id FROM students WHERE id = $1 AND deleted = 0",
    [studentId],
  );
  const student = studentCheck.rows[0];

  if (!student) {
    throw new Error("Student not found");
  }

  if (student.grade_id !== exam.grade_id) {
    throw new Error("This exam is not available for your grade");
  }

  if (exam.group_id && student.group_id !== exam.group_id) {
    throw new Error("This exam is not available for your group");
  }

  const result = await query(studentExamQueries.createExamAttempt, [
    examId,
    studentId,
  ]);

  return {
    ...result.rows[0],
    is_resumed: false,
  };
};

// Get student exam with questions
const getStudentExamWithQuestions = async (attemptId, studentId) => {
  const attemptResult = await query(
    `SELECT 
      se.id AS attempt_id,
      se.exam_id,
      se.student_id,
      se.score,
      se.started_at,
      se.submitted_at,
      oe.title,
      oe.description,
      oe.full_mark,
      oe.duration_minutes,
      oe.start_at,
      oe.end_at,
      oe.randomize_questions,
      oe.grade_id,
      oe.group_id
     FROM student_exams se
     JOIN online_exams oe ON se.exam_id = oe.id
     WHERE se.id = $1 AND se.student_id = $2 AND se.submitted_at IS NULL`,
    [attemptId, studentId],
  );

  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("Attempt not found or already submitted");
  }

  const questionsResult = await query(
    `SELECT 
      q.id,
      q.question_text,
      q.type,
      q.file_path,
      q."order"
     FROM questions q
     WHERE q.exam_id = $1
     ORDER BY q."order" ASC`,
    [attempt.exam_id],
  );

  let questions = questionsResult.rows;

  const answersResult = await query(
    `SELECT 
      question_id,
      selected_option_id,
      file_path,
      is_correct
     FROM student_answers
     WHERE exam_id = $1 AND student_id = $2`,
    [attempt.exam_id, studentId],
  );

  const previousAnswers = {};
  answersResult.rows.forEach((answer) => {
    previousAnswers[answer.question_id] = {
      selected_option_id: answer.selected_option_id,
      file_path: answer.file_path,
      is_correct: answer.is_correct,
    };
  });

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      if (question.type === "mcq" || question.type === "true_false") {
        const optionsResult = await query(
          `SELECT 
            id,
            option_text,
            "order"
           FROM options
           WHERE question_id = $1
           ORDER BY "order" ASC`,
          [question.id],
        );

        return {
          ...question,
          options: optionsResult.rows.map((opt) => ({
            id: opt.id,
            option_text: opt.option_text,
            order: opt.order,
          })),
          previous_answer: previousAnswers[question.id] || null,
        };
      }

      return {
        ...question,
        previous_answer: previousAnswers[question.id] || null,
      };
    }),
  );

  const now = new Date();
  const startTime = new Date(attempt.started_at);
  const durationMs = attempt.duration_minutes * 60 * 1000;
  const elapsedMs = now.getTime() - startTime.getTime();
  const remainingMs = Math.max(0, durationMs - elapsedMs);
  const remainingSeconds = Math.floor(remainingMs / 1000);

  const examEndAt = new Date(attempt.end_at);
  const isTimeUp = now > examEndAt || remainingMs <= 0;

  return {
    attempt_id: attempt.attempt_id,
    exam_id: attempt.exam_id,
    title: attempt.title,
    description: attempt.description,
    full_mark: attempt.full_mark,
    duration_minutes: attempt.duration_minutes,
    start_at: attempt.start_at,
    end_at: attempt.end_at,
    started_at: attempt.started_at,
    remaining_seconds: remainingSeconds,
    is_time_up: isTimeUp,
    randomize_questions: attempt.randomize_questions === 1,
    questions_count: questions.length,
    answered_count: Object.keys(previousAnswers).length,
    questions: questionsWithOptions,
  };
};

// Check existing attempt
const checkExistingAttempt = async (examId, studentId) => {
  const result = await query(studentExamQueries.checkExistingAttempt, [
    examId,
    studentId,
  ]);
  return result.rows[0];
};

// Submit exam - auto calculate score
const submitExam = async (attemptId, studentId) => {
  const attemptResult = await query(
    "SELECT * FROM student_exams WHERE id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [attemptId, studentId],
  );
  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("Attempt not found or already submitted");
  }

  const examResult = await query(
    "SELECT id, full_mark FROM online_exams WHERE id = $1 AND deleted = 0",
    [attempt.exam_id],
  );
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("Exam not found");
  }

  const questionsResult = await query(
    `SELECT id, type FROM questions WHERE exam_id = $1`,
    [attempt.exam_id],
  );
  const questions = questionsResult.rows;

  if (questions.length === 0) {
    throw new Error("Exam has no questions");
  }

  const answersResult = await query(
    `SELECT question_id, selected_option_id, is_correct, file_path 
     FROM student_answers 
     WHERE exam_id = $1 AND student_id = $2`,
    [attempt.exam_id, studentId],
  );
  const answers = answersResult.rows;

  const autoGradedQuestions = questions.filter(
    (q) => q.type === "mcq" || q.type === "true_false",
  );
  const essayQuestions = questions.filter((q) => q.type === "essay");

  let score = 0;
  let answeredCount = 0;
  const questionScore = exam.full_mark / questions.length;

  autoGradedQuestions.forEach((question) => {
    const answer = answers.find((a) => a.question_id === question.id);
    if (answer) {
      answeredCount++;
      if (answer.is_correct === 1) {
        score += questionScore;
      }
    }
  });

  const isFullyGraded = essayQuestions.length === 0;

  const updatedAttempt = await query(
    `UPDATE student_exams 
     SET score = $1, submitted_at = NOW()
     WHERE id = $2 AND submitted_at IS NULL
     RETURNING *`,
    [score, attemptId],
  );

  if (!updatedAttempt.rows[0]) {
    throw new Error("Failed to submit exam");
  }

  return {
    ...updatedAttempt.rows[0],
    is_fully_graded: isFullyGraded,
    pending_essay_questions: essayQuestions.length,
    auto_graded_score: score,
    total_questions: questions.length,
    answered_questions: answeredCount,
  };
};

// Auto submit expired exams
const autoSubmitExpiredExams = async () => {
  const expiredAttempts = await query(
    `SELECT se.id, se.exam_id, se.student_id, oe.full_mark
     FROM student_exams se
     JOIN online_exams oe ON se.exam_id = oe.id
     WHERE se.submitted_at IS NULL 
       AND oe.end_at < NOW()
       AND oe.deleted = 0`,
  );

  const results = [];
  for (const attempt of expiredAttempts.rows) {
    const result = await submitExam(attempt.id, attempt.student_id);
    results.push(result);
  }
  return results;
};

// Mark absent students
const markAbsentStudents = async () => {
  const result = await query(studentExamQueries.markAbsentStudents);
  return result.rows;
};

// Get student exams by exam ID
const getStudentExamsByExamId = async (examId, page = 1) => {
  const result = await query(studentExamQueries.getStudentExamsByExamId, [
    examId,
    page,
  ]);
  return result.rows;
};

// Get exam attempt stats
const getExamAttemptStats = async (examId) => {
  const result = await query(studentExamQueries.getExamAttemptStats, [examId]);
  return result.rows[0];
};

// Get grade exam attempts stats
const getGradeExamAttemptsStats = async (gradeId) => {
  const result = await query(studentExamQueries.getGradeExamAttemptsStats, [
    gradeId,
  ]);
  return result.rows;
};

// Get group exam attempts stats
const getGroupExamAttemptsStats = async (groupId) => {
  const result = await query(studentExamQueries.getGroupExamAttemptsStats, [
    groupId,
  ]);
  return result.rows;
};

// Get exam questions for student with options
const getExamQuestionsForStudent = async (examId, studentId) => {
  const attemptCheck = await query(
    "SELECT id FROM student_exams WHERE exam_id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [examId, studentId],
  );

  if (!attemptCheck.rows[0]) {
    throw new Error("Please start the exam first");
  }

  const questionsResult = await query(
    `SELECT 
      q.id,
      q.exam_id,
      q.question_text,
      q.type,
      q.file_path,
      q."order"
     FROM questions q
     WHERE q.exam_id = $1
     ORDER BY q."order" ASC`,
    [examId],
  );

  const questions = questionsResult.rows;

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      if (question.type === "mcq" || question.type === "true_false") {
        const optionsResult = await query(
          `SELECT 
            id,
            option_text,
            "order"
           FROM options
           WHERE question_id = $1
           ORDER BY "order" ASC`,
          [question.id],
        );

        return {
          ...question,
          options: optionsResult.rows,
        };
      }

      return question;
    }),
  );

  return questionsWithOptions;
};

// Get single question for student with options
const getQuestionForStudent = async (questionId) => {
  const questionResult = await query(
    `SELECT 
      id,
      exam_id,
      question_text,
      type,
      file_path,
      "order"
     FROM questions
     WHERE id = $1`,
    [questionId],
  );

  const question = questionResult.rows[0];

  if (!question) {
    throw new Error("Question not found");
  }

  if (question.type === "mcq" || question.type === "true_false") {
    const optionsResult = await query(
      `SELECT 
        id,
        option_text,
        "order"
       FROM options
       WHERE question_id = $1
       ORDER BY "order" ASC`,
      [questionId],
    );

    question.options = optionsResult.rows;
  }

  return question;
};

// Get options for student without is_correct
const getOptionsForStudent = async (questionId) => {
  const optionsResult = await query(
    `SELECT 
      id,
      option_text,
      "order"
     FROM options
     WHERE question_id = $1
     ORDER BY "order" ASC`,
    [questionId],
  );

  return optionsResult.rows;
};

module.exports = {
  createExamAttempt,
  checkExistingAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  submitExam,
  autoSubmitExpiredExams,
  markAbsentStudents,
  getStudentExamWithQuestions,
  getExamQuestionsForStudent,
  getQuestionForStudent,
  getOptionsForStudent,
};
