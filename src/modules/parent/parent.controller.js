const parentService = require("./parent.service");

// Get parent dashboard
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
  getParentDashboard,
};
