const studentService = require("./student.service");
const studentsService = require("../students/students.service");
const studentExamService = require("../student_exams/student_exams.service");

// Get student dashboard
const getDashboard = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const dashboard = await studentService.getDashboard(studentId);

    if (!dashboard) {
      throw new Error("الطالب غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل لوحة التحكم بنجاح!",
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
      throw new Error("الطالب غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الملف الشخصي بنجاح!",
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
      throw new Error("الطالب غير موجود!");
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
      throw new Error("فشل تعديل الصورة الشخصية!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تعديل الصورة الشخصية بنجاح!",
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
      throw new Error("فشل تعديل كلمة المرور!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تعديل كلمة المرور بنجاح!",
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
      message: "تم تحميل الحضور بنجاح!",
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
      message: "تم تحميل الإحصائيات بنجاح!",
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
      message: "تم تحميل البيانات بنجاح!",
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
      message: "تم تحميل الامتحانات بنجاح!",
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

    const exam = await studentsService.getStudentPaperExamById(studentId, examId);

    if (!exam) {
      throw new Error("الامتحان غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحان بنجاح!",
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
      message: "تم تحميل النتائج بنجاح!",
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

    const exams = await studentsService.getAvailableOnlineExams(studentId, page);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحانات المتاحة بنجاح!",
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
      message: "تم تحميل سجل الامتحانات بنجاح!",
      data: exams,
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

    const attempt = await studentExamService.createExamAttempt(examId, studentId);

    return res.status(201).json({
      success: true,
      message: "تم بدء الامتحان بنجاح!",
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

// Submit online exam
const submitOnlineExam = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { attemptId } = req.params;
    const { score } = req.body;

    const result = await studentExamService.submitExam(attemptId, studentId, score);

    if (!result) {
      throw new Error("فشل تسليم الامتحان!");
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

// Get online exam details
const getOnlineExamById = async (req, res, next) => {
  try {
    const studentId = req.clientId;
    const { attemptId } = req.params;

    const exam = await studentsService.getStudentOnlineExamById(studentId, attemptId);

    if (!exam) {
      throw new Error("الامتحان غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الامتحان بنجاح!",
      data: exam,
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
      message: "تم تحميل الواجبات بنجاح!",
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
      throw new Error("الواجب غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الواجب بنجاح!",
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
      message: "تم تحميل التسليمات بنجاح!",
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
      message: "تم تحميل قوائم التشغيل بنجاح!",
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
      message: "تم تحميل الفيديوهات بنجاح!",
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
      message: "تم تحميل المدفوعات بنجاح!",
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
      message: "تم تحميل الرصيد بنجاح!",
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

    const subscription = await studentsService.getCurrentSubscription(studentId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاشتراك بنجاح!",
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
  updatePassword,
  getAttendanceHistory,
  getMonthlyAttendanceStats,
  getConsecutiveAbsences,
  getPaperExams,
  getPaperExamById,
  getExamResults,
  getAvailableOnlineExams,
  getOnlineExamsHistory,
  startOnlineExam,
  submitOnlineExam,
  getOnlineExamById,
  getAssignments,
  getAssignmentById,
  getSubmissions,
  getPlaylists,
  getPlaylistVideos,
  getPaymentHistory,
  getRemainingBalance,
  getCurrentSubscription,
};