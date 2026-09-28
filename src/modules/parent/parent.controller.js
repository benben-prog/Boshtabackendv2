const parentService = require("./parent.service");

function formatStudentWithStatus(student) {
  if (!student) return null;
  const isInactive =
    student.is_active === false ||
    student.is_active === 0 ||
    student.is_active === "false";
  const reason = isInactive
    ? student.deactivation_reason || "غياب متكرر"
    : null;
  const statusInfo = {
    is_active: !isInactive,
    status: isInactive ? "inactive" : "active",
    status_text: isInactive ? "غير مفعل" : "مفعل",
    deactivation_reason: reason,
    alert_message: isInactive
      ? `الحساب غير مفعل حالياً بسبب: ${reason}. برجاء التواصل مع إدارة السنتر.`
      : null,
    contact_center_required: isInactive,
  };

  return {
    ...student,
    is_active: !isInactive,
    status: statusInfo.status,
    status_text: statusInfo.status_text,
    deactivation_reason: reason,
    alert_message: statusInfo.alert_message,
    contact_center_required: isInactive,
    status_info: statusInfo,
  };
}

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

    const formattedStudent = formatStudentWithStatus(student);
    const formattedStudents = students.map(formatStudentWithStatus);
    const isInactive = formattedStudent.is_active === false;

    return res.status(200).json({
      success: true,
      message: isInactive
        ? `تنبيه: حساب الطالب غير مفعل (${formattedStudent.deactivation_reason || "غير مفعل"}). برجاء التواصل مع السنتر.`
        : "تم تحميل البيانات بنجاح",
      data: {
        student: formattedStudent,
        deactivation_notice: formattedStudent.status_info,
        students: formattedStudents,
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

    const formattedStudent = formatStudentWithStatus(student);
    const formattedStudents = students.map(formatStudentWithStatus);
    const isInactive = formattedStudent.is_active === false;

    return res.status(200).json({
      success: true,
      message: isInactive
        ? `تنبيه: حساب الطالب غير مفعل (${formattedStudent.deactivation_reason || "غير مفعل"}). برجاء التواصل مع السنتر.`
        : "تم تحميل البيانات بنجاح",
      data: {
        student: formattedStudent,
        deactivation_notice: formattedStudent.status_info,
        students: formattedStudents,
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
