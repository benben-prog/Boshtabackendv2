const studentExamService = require("./student_exams.service");

// Create exam attempt (student starts exam)
const createExamAttempt = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.clientId;

    // التحقق من وجود محاولة سابقة
    const existing = await studentExamService.checkExistingAttempt(
      examId,
      studentId,
    );
    if (existing) {
      throw new Error("لقد قمت بمحاولة هذا الامتحان من قبل!");
    }

    const attempt = await studentExamService.createExamAttempt(
      examId,
      studentId,
    );

    return res.status(201).json({
      success: true,
      message: "تم بدء الامتحان بنجاح!",
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

// Get student exams by exam ID
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
      message: "تم تحميل المحاولات بنجاح!",
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// Get exam attempt stats
const getExamAttemptStats = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const stats = await studentExamService.getExamAttemptStats(examId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get grade exam attempts stats
const getGradeExamAttemptsStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await studentExamService.getGradeExamAttemptsStats(gradeId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get group exam attempts stats
const getGroupExamAttemptsStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const stats = await studentExamService.getGroupExamAttemptsStats(groupId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Submit exam
const submitExam = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { score } = req.body;
    const studentId = req.clientId;

    const result = await studentExamService.submitExam(
      attemptId,
      studentId,
      score,
    );

    if (!result) {
      throw new Error("فشل تسليم الامتحان حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تسليم الامتحان بنجاح!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExamAttempt,
  getStudentExamsByExamId,
  getExamAttemptStats,
  getGradeExamAttemptsStats,
  getGroupExamAttemptsStats,
  submitExam,
};
