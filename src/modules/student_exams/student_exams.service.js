const { query } = require("../../config/database");
const studentExamQueries = require("./student_exams.queries");
const { getNowEgypt } = require("../../utils/timezone");

// ============================================
// HELPER FUNCTIONS
// ============================================

const createStableOrderValue = (value, seed) => {
  const str = `${seed}:${value}`;
  let hash = 2166136261;

  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const orderQuestionsByAttemptSeed = (questions, seed) => {
  if (!Array.isArray(questions) || questions.length < 2) {
    return questions;
  }

  return [...questions].sort((a, b) => {
    const aOrder = createStableOrderValue(a.id, seed);
    const bOrder = createStableOrderValue(b.id, seed);

    if (aOrder === bOrder) {
      return Number(a.id) - Number(b.id);
    }

    return aOrder - bOrder;
  });
};

// Calculate remaining time in seconds
function calculateRemainingSeconds(startedAt, durationMinutes, endAt) {
  const now = getNowEgypt();
  const startTime = new Date(startedAt);
  const examEnd = new Date(endAt);

  const durationMs = durationMinutes * 60 * 1000;
  const elapsedMs = now.getTime() - startTime.getTime();
  const remainingByDuration = durationMs - elapsedMs;
  const remainingByEndTime = examEnd.getTime() - now.getTime();

  const remainingMs = Math.max(
    0,
    Math.min(remainingByDuration, remainingByEndTime),
  );
  return Math.floor(remainingMs / 1000);
}

// Group options by question_id
function groupOptionsByQuestion(options) {
  const map = {};
  options.forEach((opt) => {
    if (!map[opt.question_id]) {
      map[opt.question_id] = [];
    }
    map[opt.question_id].push({
      id: opt.id,
      option_text: opt.option_text,
      order: opt.order,
    });
  });
  return map;
}

// Group review details by question_id
function groupReviewDetails(rows) {
  const questionsMap = new Map();

  rows.forEach((row) => {
    if (!questionsMap.has(row.question_id)) {
      questionsMap.set(row.question_id, {
        question_id: row.question_id,
        question_text: row.question_text,
        question_type: row.type,
        file_path: row.file_path,
        order: row.order,
        student_answer: null,
        is_correct: row.student_is_correct,
        options: [],
      });
    }

    const question = questionsMap.get(row.question_id);

    if (row.option_id) {
      question.options.push({
        option_id: row.option_id,
        option_text: row.option_text,
        is_correct: row.option_is_correct === 1,
        is_selected: row.selected_option_id === row.option_id,
      });

      if (row.selected_option_id === row.option_id) {
        question.student_answer = row.option_text;
      }
    }

    // For essay questions
    if (row.type === "essay" && row.student_file_path) {
      question.student_answer = row.student_file_path;
    }
  });

  return Array.from(questionsMap.values());
}

// ============================================
// CREATE EXAM ATTEMPT
// ============================================

const createExamAttempt = async (examId, studentId) => {
  // Get exam details
  const examCheck = await query(
    `SELECT id, start_at, end_at, full_mark, title, duration_minutes, grade_id, group_id 
     FROM online_exams WHERE id = $1 AND deleted = 0`,
    [examId],
  );
  const exam = examCheck.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  // Check existing attempt
  const existingAttempt = await query(studentExamQueries.checkExistingAttempt, [
    examId,
    studentId,
  ]);

  // If already submitted, reject
  if (existingAttempt.rows[0]?.submitted_at) {
    throw new Error("لقد قمت بحل هذا الامتحان من قبل");
  }

  // If exists and not submitted, resume it
  if (existingAttempt.rows[0]) {
    return {
      ...existingAttempt.rows[0],
      is_resumed: true,
    };
  }

  // Check exam time
  const now = getNowEgypt();
  const startAt = new Date(exam.start_at);
  const endAt = new Date(exam.end_at);

  if (now < startAt) {
    throw new Error("لم يبدأ الامتحان بعد");
  }

  if (now > endAt) {
    throw new Error("انتهى وقت الامتحان");
  }

  // Check student eligibility
  const studentCheck = await query(
    "SELECT id, grade_id, group_id FROM students WHERE id = $1 AND deleted = 0",
    [studentId],
  );
  const student = studentCheck.rows[0];

  if (!student) {
    throw new Error("الطالب غير موجود");
  }

  if (student.grade_id !== exam.grade_id) {
    throw new Error("هذا الامتحان غير متاح لصفك الدراسي");
  }

  if (exam.group_id && student.group_id !== exam.group_id) {
    throw new Error("هذا الامتحان غير متاح لمجموعتك");
  }

  try {
    const result = await query(studentExamQueries.createExamAttempt, [
      examId,
      studentId,
    ]);

    return {
      ...result.rows[0],
      is_resumed: false,
    };
  } catch (error) {
    if (error?.code === "23505") {
      throw new Error("لقد قمت بحل هذا الامتحان من قبل");
    }
    throw error;
  }
};

// ============================================
// GET EXAM WITH QUESTIONS (NO N+1)
// ============================================

const getStudentExamWithQuestions = async (attemptId, studentId) => {
  // Get exam + attempt in one query
  const attemptResult = await query(studentExamQueries.getExamWithQuestions, [
    attemptId,
    studentId,
  ]);

  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("المحاولة غير موجودة أو تم تسليمها");
  }

  // Get all questions with options in ONE query
  const questionsResult = await query(
    studentExamQueries.getQuestionsWithOptions,
    [attempt.exam_id],
  );

  // Get student's previous answers
  const answersResult = await query(
    studentExamQueries.getStudentAnswersForExam,
    [attempt.exam_id, studentId],
  );

  // Build answers map
  const previousAnswers = {};
  answersResult.rows.forEach((answer) => {
    previousAnswers[answer.question_id] = {
      selected_option_id: answer.selected_option_id,
      file_path: answer.file_path,
      is_correct: answer.is_correct,
    };
  });

  // Build questions with options
  const questionsMap = new Map();

  questionsResult.rows.forEach((row) => {
    if (!questionsMap.has(row.question_id)) {
      questionsMap.set(row.question_id, {
        id: row.question_id,
        question_text: row.question_text,
        type: row.type,
        file_path: row.file_path,
        order: row.order,
        options: [],
        previous_answer: previousAnswers[row.question_id] || null,
      });
    }

    if (row.option_id) {
      questionsMap.get(row.question_id).options.push({
        id: row.option_id,
        option_text: row.option_text,
        order: row.option_order,
      });
    }
  });

  let questions = Array.from(questionsMap.values());

  // Keep a stable order per attempt, so refresh/resume never reorders the exam.
  const attemptSeed = String(attempt.attempt_id || attempt.exam_id);
  questions = orderQuestionsByAttemptSeed(questions, attemptSeed);

  // Calculate remaining time
  const remainingSeconds = calculateRemainingSeconds(
    attempt.started_at,
    attempt.duration_minutes,
    attempt.end_at,
  );

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
    is_time_up: remainingSeconds <= 0,
    randomize_questions: attempt.randomize_questions === 1,
    questions_count: questions.length,
    answered_count: Object.keys(previousAnswers).length,
    questions,
  };
};

// ============================================
// CHECK EXISTING ATTEMPT
// ============================================

const checkExistingAttempt = async (examId, studentId) => {
  const result = await query(studentExamQueries.checkExistingAttempt, [
    examId,
    studentId,
  ]);
  return result.rows[0];
};

// ============================================
// SUBMIT EXAM
// ============================================

const submitExam = async (attemptId, studentId) => {
  // Get attempt
  const attemptResult = await query(
    "SELECT * FROM student_exams WHERE id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [attemptId, studentId],
  );
  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("المحاولة غير موجودة أو تم تسليمها مسبقاً");
  }

  // Check if exam time is still valid
  const examResult = await query(
    "SELECT id, full_mark, end_at FROM online_exams WHERE id = $1 AND deleted = 0",
    [attempt.exam_id],
  );
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  // Auto-submit if time is up
  const now = getNowEgypt();
  const endAt = new Date(exam.end_at);
  const isTimeUp = now > endAt;

  // Get questions
  const questionsResult = await query(
    "SELECT id, type FROM questions WHERE exam_id = $1",
    [attempt.exam_id],
  );
  const questions = questionsResult.rows;

  if (questions.length === 0) {
    throw new Error("الامتحان لا يحتوي على أسئلة");
  }

  // Get answers
  const answersResult = await query(
    `SELECT question_id, selected_option_id, is_correct, file_path 
     FROM student_answers 
     WHERE exam_id = $1 AND student_id = $2`,
    [attempt.exam_id, studentId],
  );
  const answers = answersResult.rows;

  // Calculate score
  const autoGradedQuestions = questions.filter(
    (q) => q.type === "mcq" || q.type === "true_false",
  );
  const essayQuestions = questions.filter((q) => q.type === "essay");

  let autoScore = 0;
  let answeredCount = 0;
  const questionScore = exam.full_mark / questions.length;

  autoGradedQuestions.forEach((question) => {
    const answer = answers.find((a) => a.question_id === question.id);
    if (answer) {
      answeredCount++;
      if (answer.is_correct === 1) {
        autoScore += questionScore;
      }
    }
  });

  const hasEssayQuestions = essayQuestions.length > 0;
  const finalScore = hasEssayQuestions ? null : autoScore;
  const isFullyGraded = !hasEssayQuestions;

  // Submit
  const updatedAttempt = await query(studentExamQueries.submitExam, [
    attemptId,
    studentId,
    finalScore,
  ]);

  if (!updatedAttempt.rows[0]) {
    throw new Error("فشل تسليم الامتحان");
  }

  return {
    ...updatedAttempt.rows[0],
    is_fully_graded: isFullyGraded,
    pending_essay_questions: essayQuestions.length,
    auto_graded_score: autoScore,
    total_questions: questions.length,
    answered_questions: answeredCount,
    is_time_up: isTimeUp,
  };
};

// ============================================
// RECALCULATE SCORE AFTER ESSAY GRADING
// ============================================

const recalculateScoreAfterEssayGrading = async (examId, studentId) => {
  const examResult = await query(
    "SELECT id, full_mark FROM online_exams WHERE id = $1 AND deleted = 0",
    [examId],
  );
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  const questionsResult = await query(
    "SELECT id, type FROM questions WHERE exam_id = $1",
    [examId],
  );
  const questions = questionsResult.rows;

  if (questions.length === 0) {
    return;
  }

  const answersResult = await query(
    `SELECT question_id, selected_option_id, is_correct, file_path 
     FROM student_answers 
     WHERE exam_id = $1 AND student_id = $2`,
    [examId, studentId],
  );
  const answers = answersResult.rows;

  const questionScore = exam.full_mark / questions.length;
  let totalScore = 0;
  let allGraded = true;

  questions.forEach((question) => {
    const answer = answers.find((a) => a.question_id === question.id);

    if (question.type === "mcq" || question.type === "true_false") {
      if (answer && answer.is_correct === 1) {
        totalScore += questionScore;
      }
    } else if (question.type === "essay") {
      if (answer && answer.is_correct === 1) {
        totalScore += questionScore;
      } else if (answer && answer.is_correct === null) {
        allGraded = false;
      }
    }
  });

  if (allGraded) {
    await query(
      `UPDATE student_exams 
       SET score = $1 
       WHERE exam_id = $2 AND student_id = $3`,
      [totalScore, examId, studentId],
    );
  }
};

// ============================================
// GET EXAM REVIEW (NO N+1)
// ============================================

const getExamReview = async (attemptId, studentId) => {
  // Get attempt + exam info
  const attemptResult = await query(studentExamQueries.getExamReviewData, [
    attemptId,
    studentId,
  ]);

  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("الامتحان غير موجود أو لم يتم تسليمه بعد");
  }

  // Get all questions + options + answers in ONE query
  const detailsResult = await query(studentExamQueries.getExamReviewDetails, [
    attempt.exam_id,
    studentId,
  ]);

  const reviewQuestions = groupReviewDetails(detailsResult.rows);

  const totalQuestions = reviewQuestions.length;
  const correctAnswers = reviewQuestions.filter(
    (q) => q.is_correct === 1,
  ).length;
  const wrongAnswers = reviewQuestions.filter((q) => q.is_correct === 0).length;
  const unansweredQuestions = reviewQuestions.filter(
    (q) => q.is_correct === null,
  ).length;

  const percentage =
    attempt.full_mark > 0
      ? Math.round((attempt.score / attempt.full_mark) * 100 * 100) / 100
      : 0;

  return {
    attempt_id: attempt.attempt_id,
    exam_id: attempt.exam_id,
    exam_title: attempt.exam_title,
    full_mark: attempt.full_mark,
    score: attempt.score,
    percentage,
    submitted_at: attempt.submitted_at,
    total_questions: totalQuestions,
    correct_answers: correctAnswers,
    wrong_answers: wrongAnswers,
    unanswered_questions: unansweredQuestions,
    questions: reviewQuestions,
  };
};

// ============================================
// AUTO SUBMIT EXPIRED EXAMS
// ============================================

const autoSubmitExpiredExams = async () => {
  const result = await query(studentExamQueries.autoSubmitExpiredExams);
  return result.rows;
};

// ============================================
// MARK ABSENT STUDENTS
// ============================================

const markAbsentStudents = async () => {
  const result = await query(studentExamQueries.markAbsentStudents);
  return result.rows;
};

// ============================================
// GETTERS
// ============================================

const getStudentExamsByExamId = async (examId, page = 1) => {
  const result = await query(studentExamQueries.getStudentExamsByExamId, [
    examId,
    page,
  ]);
  return result.rows;
};

const getExamAttemptStats = async (examId) => {
  const result = await query(studentExamQueries.getExamAttemptStats, [examId]);
  return result.rows[0];
};

const getGradeExamAttemptsStats = async (gradeId) => {
  const result = await query(studentExamQueries.getGradeExamAttemptsStats, [
    gradeId,
  ]);
  return result.rows;
};

const getGroupExamAttemptsStats = async (groupId) => {
  const result = await query(studentExamQueries.getGroupExamAttemptsStats, [
    groupId,
  ]);
  return result.rows;
};

// ============================================
// GET EXAM QUESTIONS FOR STUDENT (NO N+1)
// ============================================

const getExamQuestionsForStudent = async (examId, studentId) => {
  // Verify active attempt exists
  const attemptCheck = await query(
    "SELECT id FROM student_exams WHERE exam_id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [examId, studentId],
  );

  if (!attemptCheck.rows[0]) {
    throw new Error("يجب بدء الامتحان أولاً");
  }

  // Get questions
  const questionsResult = await query(
    studentExamQueries.getExamQuestionsForStudent,
    [examId],
  );
  const questions = questionsResult.rows;

  if (questions.length === 0) {
    return [];
  }

  // Get all options for all questions in ONE query
  const questionIds = questions.map((q) => q.id);
  const optionsResult = await query(studentExamQueries.getOptionsForQuestions, [
    questionIds,
  ]);

  const optionsMap = groupOptionsByQuestion(optionsResult.rows);
  const orderedQuestions = orderQuestionsByAttemptSeed(
    questions,
    String(attemptCheck.rows[0].id),
  );

  // Attach options to questions
  return orderedQuestions.map((question) => {
    if (question.type === "mcq" || question.type === "true_false") {
      return {
        ...question,
        options: optionsMap[question.id] || [],
      };
    }
    return {
      ...question,
      file_url: question.file_path,
    };
  });
};

// ============================================
// GET SINGLE QUESTION FOR STUDENT
// ============================================

const getQuestionForStudent = async (questionId) => {
  const questionResult = await query(studentExamQueries.getQuestionById, [
    questionId,
  ]);
  const question = questionResult.rows[0];

  if (!question) {
    throw new Error("السؤال غير موجود");
  }

  if (question.type === "mcq" || question.type === "true_false") {
    const optionsResult = await query(
      studentExamQueries.getOptionsByQuestionId,
      [questionId],
    );
    question.options = optionsResult.rows;
  } else {
    question.file_url = question.file_path;
  }

  return question;
};

// ============================================
// GET OPTIONS FOR STUDENT
// ============================================

const getOptionsForStudent = async (questionId) => {
  const result = await query(studentExamQueries.getOptionsByQuestionId, [
    questionId,
  ]);
  return result.rows;
};

module.exports = {
  createExamAttempt,
  checkExistingAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  submitExam,
  recalculateScoreAfterEssayGrading,
  getExamReview,
  autoSubmitExpiredExams,
  markAbsentStudents,
  getStudentExamWithQuestions,
  getExamQuestionsForStudent,
  getQuestionForStudent,
  getOptionsForStudent,
};
