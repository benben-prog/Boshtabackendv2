const studentExamService = require("./student_exams.service");

// Check active attempt
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

// Resume exam
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

// Start exam
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
    if (
      error.message === "You have already completed this exam" ||
      error.message === "Exam time has ended" ||
      error.message === "Exam has not started yet" ||
      error.message === "This exam is not available for your grade" ||
      error.message === "This exam is not available for your group"
    ) {
      let arabicMessage = error.message;

      if (error.message === "You have already completed this exam") {
        arabicMessage = "لقد قمت بحل هذا الامتحان من قبل";
      } else if (error.message === "Exam time has ended") {
        arabicMessage = "انتهى وقت الامتحان";
      } else if (error.message === "Exam has not started yet") {
        arabicMessage = "لم يبدأ الامتحان بعد";
      } else if (
        error.message === "This exam is not available for your grade"
      ) {
        arabicMessage = "هذا الامتحان غير متاح لصفك الدراسي";
      } else if (
        error.message === "This exam is not available for your group"
      ) {
        arabicMessage = "هذا الامتحان غير متاح لمجموعتك";
      }

      return res.status(400).json({
        success: false,
        message: arabicMessage,
      });
    }
    next(error);
  }
};

// Submit exam
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

// Get exam questions for student
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

// Get single question
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

// Get options for student
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

// Get students by exam
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

// Get exam stats
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

// Get grade stats
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

// Get group stats
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
  getExamQuestionsForStudent,
  getQuestionForStudent,
  getOptionsForStudent,
};
