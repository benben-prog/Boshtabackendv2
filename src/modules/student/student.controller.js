const studentService = require("./student.service");
const studentsService = require("../students/students.service");
const studentExamService = require("../student_exams/student_exams.service");
const { query } = require("../../config/database");

// Get student dashboard
const getDashboard = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const dashboard = await studentService.getDashboard(studentId);

    if (!dashboard) {
      throw new Error("Student not found");
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard loaded successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get student profile
const getProfile = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const profile = await studentsService.getStudentProfile(studentId);

    if (!profile) {
      throw new Error("Student not found");
    }

    return res.status(200).json({
      success: true,
      message: "Profile loaded successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get student quick stats
const getQuickStats = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const stats = await studentsService.getStudentQuickStats(studentId);

    if (!stats) {
      throw new Error("Student not found");
    }

    return res.status(200).json({
      success: true,
      message: "Stats loaded successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile image
const updateProfileImage = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const profile_image = req.file ? req.file.path : req.body.profile_image;

    const student = await studentsService.updateStudentProfileImage(
      studentId,
      profile_image,
    );

    if (!student) {
      throw new Error("Failed to update profile image");
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Delete profile image
const deleteProfileImage = async (req, res, next) => {
  try {
    const studentId = req.clientId;

    const student = await studentsService.deleteStudentProfileImage(studentId);

    return res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Update password
const updatePassword = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { oldPassword, password } = req.body;

    const result = await studentsService.updateStudentPassword(
      studentId,
      oldPassword,
      password,
    );

    if (!result) {
      throw new Error("Failed to update password");
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance history
const getAttendanceHistory = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const attendance = await studentsService.getAttendanceHistory(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Attendance loaded successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly attendance stats
const getMonthlyAttendanceStats = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const stats = await studentsService.getMonthlyAttendanceStats(studentId);

    return res.status(200).json({
      success: true,
      message: "Stats loaded successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get consecutive absences
const getConsecutiveAbsences = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const absences = await studentsService.getConsecutiveAbsences(studentId);

    return res.status(200).json({
      success: true,
      message: "Data loaded successfully",
      data: absences,
    });
  } catch (error) {
    next(error);
  }
};

// Get paper exams
const getPaperExams = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const exams = await studentsService.getStudentPaperExams(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Exams loaded successfully",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get paper exam details
const getPaperExamById = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { examId } = req.params;

    const exam = await studentsService.getStudentPaperExamById(
      studentId,
      examId,
    );

    if (!exam) {
      throw new Error("Exam not found");
    }

    return res.status(200).json({
      success: true,
      message: "Exam loaded successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// Get exam results
const getExamResults = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const results = await studentsService.getStudentExamResults(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Results loaded successfully",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// Get available online exams
const getAvailableOnlineExams = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const page = parseInt(req.query.page) || 1;

    const exams = await studentsService.getAvailableOnlineExams(
      studentId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Available exams loaded successfully",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get online exams history
const getOnlineExamsHistory = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const exams = await studentsService.getStudentOnlineExams(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Exam history loaded successfully",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

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
        message: "No previous attempt",
        data: {
          has_active_attempt: false,
          submitted: false,
        },
      });
    }

    if (attempt.submitted_at === null) {
      return res.status(200).json({
        success: true,
        message: "Active attempt found",
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
      message: "Exam already submitted",
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
        message: "No active attempt found for this exam",
      });
    }

    const examWithQuestions =
      await studentExamService.getStudentExamWithQuestions(
        attempt.id,
        studentId,
      );

    return res.status(200).json({
      success: true,
      message: "Exam resumed successfully",
      data: {
        ...examWithQuestions,
        is_resumed: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Start online exam
const startOnlineExam = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { examId } = req.params;

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
        ? "Exam resumed successfully"
        : "Exam started successfully",
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
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Submit online exam - no score
const submitOnlineExam = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { attemptId } = req.params;

    const result = await studentExamService.submitExam(attemptId, studentId);

    return res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get online exam details
const getOnlineExamById = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { attemptId } = req.params;

    const exam = await studentsService.getStudentOnlineExamById(
      studentId,
      attemptId,
    );

    if (!exam) {
      throw new Error("Exam not found");
    }

    return res.status(200).json({
      success: true,
      message: "Exam loaded successfully",
      data: exam,
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
      message: "Questions loaded successfully",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// Get single question for student
const getQuestionForStudent = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await studentExamService.getQuestionForStudent(questionId);

    return res.status(200).json({
      success: true,
      message: "Question loaded successfully",
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
      message: "Options loaded successfully",
      data: options,
    });
  } catch (error) {
    next(error);
  }
};

// Get assignments
const getAssignments = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const assignments = await studentsService.getStudentAssignments(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Assignments loaded successfully",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Get assignment details
const getAssignmentById = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { assignmentId } = req.params;

    const assignment = await studentsService.getStudentAssignmentById(
      studentId,
      assignmentId,
    );

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    return res.status(200).json({
      success: true,
      message: "Assignment loaded successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Get submissions
const getSubmissions = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const submissions = await studentsService.getStudentSubmissions(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Submissions loaded successfully",
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// Get playlists
const getPlaylists = async (req, res, next) => {
  try {
    const studentId = req.clientId;

    const playlists = await studentsService.getStudentPlaylists(studentId);

    return res.status(200).json({
      success: true,
      message: "Playlists loaded successfully",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

// Get playlist videos
const getPlaylistVideos = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    const videos = await studentsService.getPlaylistVideos(playlistId);

    return res.status(200).json({
      success: true,
      message: "Videos loaded successfully",
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment history
const getPaymentHistory = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;

    const payments = await studentsService.getPaymentHistory(
      studentId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "Payments loaded successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// Get remaining balance
const getRemainingBalance = async (req, res, next) => {
  try {
    const studentId = req.clientId;

    const balance = await studentsService.getRemainingBalance(studentId);

    return res.status(200).json({
      success: true,
      message: "Balance loaded successfully",
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

// Get current subscription
const getCurrentSubscription = async (req, res, next) => {
  try {
    const studentId = req.clientId;

    const subscription =
      await studentsService.getCurrentSubscription(studentId);

    return res.status(200).json({
      success: true,
      message: "Subscription loaded successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProfile,
  getQuickStats,
  updateProfileImage,
  deleteProfileImage,
  updatePassword,
  getAttendanceHistory,
  getMonthlyAttendanceStats,
  getConsecutiveAbsences,
  getPaperExams,
  getPaperExamById,
  getExamResults,
  getAvailableOnlineExams,
  getOnlineExamsHistory,
  checkActiveAttempt,
  resumeExam,
  startOnlineExam,
  submitOnlineExam,
  getOnlineExamById,
  getExamQuestionsForStudent,
  getQuestionForStudent,
  getOptionsForStudent,
  getAssignments,
  getAssignmentById,
  getSubmissions,
  getPlaylists,
  getPlaylistVideos,
  getPaymentHistory,
  getRemainingBalance,
  getCurrentSubscription,
};
