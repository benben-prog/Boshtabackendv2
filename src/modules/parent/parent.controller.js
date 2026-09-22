const parentService = require("./parent.service");

// ============================================
// GET PARENT DASHBOARD
// ============================================

const getPerentTokenByParentPhone = async (req, res, next) => {
  try {
    const { parent_phone } = req.body;
    if (!parent_phone) {
      return res.status(403).json({
        success: false,
        message: "برجاء إدخال رقم الهاتف!",
      });
    }
    const parent_token =
      await parentService.getPerentTokenByParentPhone(parent_phone);
    if (!parent_token) {
      return res.status(404).json({
        success: false,
        message: "رقم الهاتف غير موجود برجاء متابعة السنتر!",
      });
    }

    const student = await parentService.getStudentByParentToken(parent_token);
    const id = student.id;

    // Fetch all data in parallel
    const [
      attendance,
      attendanceHistory,
      payments,
      paymentHistory,
      allExams,
      assignments,
      groupInfo,
      overallStats,
    ] = await Promise.all([
      parentService.getParentDashboardAttendance(id),
      parentService.getAttendanceHistory(id, 1),
      parentService.getParentDashboardPayments(id),
      parentService.getPaymentHistory(id, 1),
      parentService.getAllExams(id),
      parentService.getParentDashboardAssignments(id),
      parentService.getGroupInfo(id),
      parentService.getStudentOverallStats(id),
    ]);

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: {
        student,
        attendance,
        attendanceHistory,
        payments,
        paymentHistory,
        allExams,
        assignments,
        groupInfo,
        overallStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getParentDashboard = async (req, res, next) => {
  try {
    const { token } = req.params;

    const student = await parentService.getStudentByParentToken(token);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "رابط غير صالح أو منتهي الصلاحية",
      });
    }

    const studentId = student.id;

    // Fetch all data in parallel
    const [
      attendance,
      attendanceHistory,
      payments,
      paymentHistory,
      allExams,
      assignments,
      groupInfo,
      overallStats,
    ] = await Promise.all([
      parentService.getParentDashboardAttendance(studentId),
      parentService.getAttendanceHistory(studentId, 1),
      parentService.getParentDashboardPayments(studentId),
      parentService.getPaymentHistory(studentId, 1),
      parentService.getAllExams(studentId),
      parentService.getParentDashboardAssignments(studentId),
      parentService.getGroupInfo(studentId),
      parentService.getStudentOverallStats(studentId),
    ]);

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: {
        student,
        attendance,
        attendanceHistory,
        payments,
        paymentHistory,
        allExams,
        assignments,
        groupInfo,
        overallStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerentTokenByParentPhone,
  getParentDashboard,
};
