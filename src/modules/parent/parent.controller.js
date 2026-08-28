const parentService = require("./parent.service");

// Get parent dashboard
const getParentDashboard = async (req, res, next) => {
  try {
    const { token } = req.params;

    const student = await parentService.getStudentByParentToken(token);

    if (!student) {
      throw new Error("رابط غير صالح أو منتهي الصلاحية!");
    }

    const studentId = student.id;

    const attendance =
      await parentService.getParentDashboardAttendance(studentId);
    const attendanceHistory = await parentService.getAttendanceHistory(
      studentId,
      1,
    );
    const payments = await parentService.getParentDashboardPayments(studentId);
    const paymentHistory = await parentService.getPaymentHistory(studentId, 1);
    const paperExams = await parentService.getPaperExams(studentId);
    const onlineExams = await parentService.getOnlineExams(studentId);
    const assignments =
      await parentService.getParentDashboardAssignments(studentId);
    const groupInfo = await parentService.getGroupInfo(studentId);
    const overallStats = await parentService.getStudentOverallStats(studentId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح!",
      data: {
        student,
        attendance,
        attendanceHistory,
        payments,
        paymentHistory,
        paperExams,
        onlineExams,
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
