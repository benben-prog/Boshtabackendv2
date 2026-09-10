const studentExamService = require("./student_exams.service");

// ============================================
// HELPER: Map error messages to Arabic
// ============================================

const ERROR_MESSAGES = {
  "You have already completed this exam": "لقد قمت بحل هذا الامتحان من قبل",
  "Exam time has ended": "انتهى وقت الامتحان",
  "Exam has not started yet": "لم يبدأ الامتحان بعد",
  "This exam is not available for your grade":
    "هذا الامتحان غير متاح لصفك الدراسي",
  "This exam is not available for your group": "هذا الامتحان غير متاح لمجموعتك",
};

const getArabicMessage = (englishMessage) => {
  return ERROR_MESSAGES[englishMessage] || englishMessage;
};

// ============================================
// CHECK ACTIVE ATTEMPT
// ============================================

const checkActiveAttempt = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.clientId;

    const attempt = await studentExamService.checkExistingAttempt(
      examId,
      studentId,
    );

    if (!attempt) {
      return res.status(200).json({
        success: true,
        message: "لا توجد محاولة سابقة",
        data: {
          has_active_attempt: false,
          submitted: false,
        },
      });
    }

    if (attempt.submitted_at === null) {
      return res.status(200).json({
        success: true,
        message: "توجد محاولة نشطة",
        data: {
          has_active_attempt: true,
          submitted: false,
          attempt_id: attempt.id,
          started_at: attempt.started_at,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم تسليم هذا الامتحان مسبقاً",
      data: {
        has_active_attempt: false,
        submitted: true,
        submitted_at: attempt.submitted_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// RESUME EXAM
// ============================================

const resumeExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.clientId;

    const attempt = await studentExamService.checkExistingAttempt(
      examId,
      studentId,
    );

    if (!attempt || attempt.submitted_at !== null) {
      return res.status(400).json({
        success: false,
        message: "لا توجد محاولة نشطة لهذا الامتحان",
      });
    }

    const examWithQuestions =
      await studentExamService.getStudentExamWithQuestions(
        attempt.id,
        studentId,
      );

    return res.status(200).json({
      success: true,
      message: "تم استئناف الامتحان بنجاح",
      data: {
        ...examWithQuestions,
        is_resumed: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// START EXAM
// ============================================

const createExamAttempt = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.clientId;

    const attempt = await studentExamService.createExamAttempt(
      examId,
      studentId,
    );

    const examWithQuestions =
      await studentExamService.getStudentExamWithQuestions(
        attempt.id,
        studentId,
      );

    return res.status(200).json({
      success: true,
      message: attempt.is_resumed
        ? "تم استئناف الامتحان بنجاح"
        : "تم بدء الامتحان بنجاح",
      data: {
        ...examWithQuestions,
        is_resumed: attempt.is_resumed || false,
      },
    });
  } catch (error) {
    // Check if error message needs translation
    const arabicMessage = getArabicMessage(error.message);

    if (Object.values(ERROR_MESSAGES).includes(arabicMessage)) {
      return res.status(400).json({
        success: false,
        message: arabicMessage,
      });
    }

    next(error);
  }
};

// ============================================
// SUBMIT EXAM
// ============================================

const submitExam = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.clientId;

    const result = await studentExamService.submitExam(attemptId, studentId);

    return res.status(200).json({
      success: true,
      message: "تم تسليم الامتحان بنجاح",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET EXAM REVIEW
// ============================================

const getExamReview = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.clientId;

    const review = await studentExamService.getExamReview(attemptId, studentId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل مراجعة الامتحان بنجاح",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET EXAM QUESTIONS FOR STUDENT
// ============================================

const getExamQuestionsForStudent = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.clientId;

    const questions = await studentExamService.getExamQuestionsForStudent(
      examId,
      studentId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الأسئلة بنجاح",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET SINGLE QUESTION
// ============================================

const getQuestionForStudent = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await studentExamService.getQuestionForStudent(questionId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل السؤال بنجاح",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET OPTIONS FOR STUDENT
// ============================================

const getOptionsForStudent = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const options = await studentExamService.getOptionsForStudent(questionId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاختيارات بنجاح",
      data: options,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GETTERS FOR ASSISTANT/TEACHER
// ============================================

const getStudentExamsByExamId = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const attempts = await studentExamService.getStudentExamsByExamId(
      examId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل المحاولات بنجاح",
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

const getExamAttemptStats = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const stats = await studentExamService.getExamAttemptStats(examId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getGradeExamAttemptsStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await studentExamService.getGradeExamAttemptsStats(gradeId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupExamAttemptsStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const stats = await studentExamService.getGroupExamAttemptsStats(groupId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkActiveAttempt,
  resumeExam,
  createExamAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  submitExam,
  getExamReview,
  getExamQuestionsForStudent,
  getQuestionForStudent,
  getOptionsForStudent,
};
