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
    throw new Error("الامتحان غير موجود");
  }

  const existingAttempt = await query(studentExamQueries.checkExistingAttempt, [
    examId,
    studentId,
  ]);

  if (existingAttempt.rows[0]) {
    throw new Error("لقد بدأت هذا الامتحان بالفعل");
  }

  const now = new Date();
  const startAt = new Date(exam.start_at);
  const endAt = new Date(exam.end_at);

  if (now < startAt) {
    throw new Error("لم يبدأ الامتحان بعد");
  }

  if (now > endAt) {
    throw new Error("انتهى وقت الامتحان");
  }

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
    throw new Error("المحاولة غير موجودة أو تم تسليمها");
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

  if (attempt.randomize_questions === 1) {
    questions = questions.sort(() => Math.random() - 0.5);
    questions = questions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));
  }

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
        file_url: question.file_path,
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

// Submit exam - with essay support
const submitExam = async (attemptId, studentId) => {
  const attemptResult = await query(
    "SELECT * FROM student_exams WHERE id = $1 AND student_id = $2 AND submitted_at IS NULL",
    [attemptId, studentId],
  );
  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("المحاولة غير موجودة أو تم تسليمها مسبقاً");
  }

  const examResult = await query(
    "SELECT id, full_mark FROM online_exams WHERE id = $1 AND deleted = 0",
    [attempt.exam_id],
  );
  const exam = examResult.rows[0];

  if (!exam) {
    throw new Error("الامتحان غير موجود");
  }

  const questionsResult = await query(
    `SELECT id, type FROM questions WHERE exam_id = $1`,
    [attempt.exam_id],
  );
  const questions = questionsResult.rows;

  if (questions.length === 0) {
    throw new Error("الامتحان لا يحتوي على أسئلة");
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

  const updatedAttempt = await query(
    `UPDATE student_exams 
     SET score = $1, submitted_at = NOW()
     WHERE id = $2 AND submitted_at IS NULL
     RETURNING *`,
    [finalScore, attemptId],
  );

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
  };
};

// Recalculate score after essay grading
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
    `SELECT id, type FROM questions WHERE exam_id = $1`,
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
      `UPDATE student_exams SET score = $1 WHERE exam_id = $2 AND student_id = $3`,
      [totalScore, examId, studentId],
    );
  }
};

// Get exam review after submission
const getExamReview = async (attemptId, studentId) => {
  const attemptResult = await query(
    `SELECT 
      se.id AS attempt_id,
      se.exam_id,
      se.score,
      se.started_at,
      se.submitted_at,
      oe.title AS exam_title,
      oe.full_mark,
      oe.duration_minutes
     FROM student_exams se
     JOIN online_exams oe ON se.exam_id = oe.id
     WHERE se.id = $1 AND se.student_id = $2 AND se.submitted_at IS NOT NULL`,
    [attemptId, studentId],
  );

  const attempt = attemptResult.rows[0];

  if (!attempt) {
    throw new Error("الامتحان غير موجود أو لم يتم تسليمه بعد");
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

  const questions = questionsResult.rows;

  const answersResult = await query(
    `SELECT 
      sa.id AS answer_id,
      sa.question_id,
      sa.selected_option_id,
      sa.file_path,
      sa.is_correct
     FROM student_answers sa
     WHERE sa.exam_id = $1 AND sa.student_id = $2`,
    [attempt.exam_id, studentId],
  );

  const answers = answersResult.rows;

  const reviewQuestions = await Promise.all(
    questions.map(async (question) => {
      const studentAnswer = answers.find(
        (a) => a.question_id === question.id,
      );

      let reviewData = {
        question_id: question.id,
        question_text: question.question_text,
        question_type: question.type,
        file_path: question.file_path,
        order: question.order,
        student_answer: null,
        is_correct: studentAnswer?.is_correct ?? null,
      };

      if (question.type === "mcq" || question.type === "true_false") {
        const optionsResult = await query(
          `SELECT 
            id,
            option_text,
            is_correct,
            "order"
           FROM options
           WHERE question_id = $1
           ORDER BY "order" ASC`,
          [question.id],
        );

        const options = optionsResult.rows;

        reviewData.options = options.map((opt) => ({
          option_id: opt.id,
          option_text: opt.option_text,
          is_correct: opt.is_correct === 1,
          is_selected: studentAnswer?.selected_option_id === opt.id,
        }));

        reviewData.student_answer =
          options.find((opt) => opt.id === studentAnswer?.selected_option_id)
            ?.option_text || null;
      } else if (question.type === "essay") {
        reviewData.student_answer = studentAnswer?.file_path || null;
      }

      return reviewData;
    }),
  );

  const totalQuestions = questions.length;
  const correctAnswers = reviewQuestions.filter(
    (q) => q.is_correct === 1,
  ).length;
  const wrongAnswers = reviewQuestions.filter(
    (q) => q.is_correct === 0,
  ).length;
  const unansweredQuestions = reviewQuestions.filter(
    (q) => q.is_correct === null,
  ).length;

  return {
    attempt_id: attempt.attempt_id,
    exam_id: attempt.exam_id,
    exam_title: attempt.exam_title,
    full_mark: attempt.full_mark,
    score: attempt.score,
    percentage:
      attempt.full_mark > 0
        ? Math.round((attempt.score / attempt.full_mark) * 100 * 100) / 100
        : 0,
    submitted_at: attempt.submitted_at,
    total_questions: totalQuestions,
    correct_answers: correctAnswers,
    wrong_answers: wrongAnswers,
    unanswered_questions: unansweredQuestions,
    questions: reviewQuestions,
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
    throw new Error("يجب بدء الامتحان أولاً");
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

      return {
        ...question,
        file_url: question.file_path,
      };
    }),
  );

  return questionsWithOptions;
};

// Get single question for student
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
    throw new Error("السؤال غير موجود");
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
  } else {
    question.file_url = question.file_path;
  }

  return question;
};

// Get options for student
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
  recalculateScoreAfterEssayGrading,
  getExamReview,
  autoSubmitExpiredExams,
  markAbsentStudents,
  getStudentExamWithQuestions,
  getExamQuestionsForStudent,
  getQuestionForStudent,
  getOptionsForStudent,
};
