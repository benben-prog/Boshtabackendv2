const parentService = require("./parent.service");

// ============================================
// GET PARENT DASHBOARD BY PHONE
// ============================================

const getPerentTokenByParentPhone = async (req, res, next) => {
  try {
    const { parent_phone, student_id } = req.body;
    const cleanPhone = String(parent_phone || "").trim();

    if (!cleanPhone) {
      return res.status(400).json({
        success: false,
        message: "برجاء إدخال رقم الهاتف!",
      });
    }

    const students = await parentService.getStudentsByParentPhone(cleanPhone);

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "رقم الهاتف غير مسجل في السنتر، يرجى مراجعة إدارة السنتر!",
      });
    }

    // If specific student_id is requested, find it, else use the first student
    let student = null;
    if (student_id) {
      student = students.find((s) => String(s.id) === String(student_id));
    }
    if (!student) {
      student = students[0];
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
      parentService.getAttendanceHistory(studentId, 500),
      parentService.getParentDashboardPayments(studentId),
      parentService.getPaymentHistory(studentId, 500),
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
        students,
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

// ============================================
// GET PARENT DASHBOARD BY TOKEN
// ============================================

const getParentDashboard = async (req, res, next) => {
  try {
    const { token } = req.params;
    const cleanToken = String(token || "").trim();

    const student = await parentService.getStudentByParentToken(cleanToken);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "رابط غير صالح أو منتهي الصلاحية",
      });
    }

    const studentId = student.id;

    // Also get all sibling students registered under the same parent phone if available
    let students = [student];
    if (student.parent_phone) {
      const allSiblings = await parentService.getStudentsByParentPhone(
        student.parent_phone,
      );
      if (allSiblings && allSiblings.length > 0) {
        students = allSiblings;
      }
    }

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
      parentService.getAttendanceHistory(studentId, 500),
      parentService.getParentDashboardPayments(studentId),
      parentService.getPaymentHistory(studentId, 500),
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
        students,
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
