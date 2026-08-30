const { query } = require("../../config/database");
const studentQueries = require("./student.queries");

// Get dashboard
const getDashboard = async (studentId) => {
  const studentInfo = await query(studentQueries.getStudentDashboard, [
    studentId,
  ]);
  const student = studentInfo.rows[0];

  if (!student) return null;

  const attendance = await query(studentQueries.getAttendanceSummary, [
    studentId,
  ]);

  const upcomingOnline = await query(studentQueries.getUpcomingOnlineExams, [
    student.grade_id,
    student.group_id,
  ]);

  const upcomingPaper = await query(studentQueries.getUpcomingPaperExams, [
    student.grade_id,
    student.group_id,
  ]);

  const upcomingAssignments = await query(
    studentQueries.getUpcomingAssignments,
    [studentId],
  );

  const examsSummary = await query(studentQueries.getExamsSummary, [studentId]);

  const pendingAssignments = await query(
    studentQueries.getPendingAssignmentsCount,
    [studentId],
  );

  return {
    student_info: {
      id: student.id,
      barcode: student.barcode,
      full_name: student.full_name,
      phone: student.phone,
      profile_image: student.profile_image,
      grade_name: student.grade_name,
      group_name: student.group_name,
    },
    group_info: {
      days: student.days,
      start_time: student.start_time,
      end_time: student.end_time,
      room: student.room,
    },
    attendance_summary: attendance.rows[0],
    upcoming_exams: [...upcomingOnline.rows, ...upcomingPaper.rows].sort(
      (a, b) => {
        const dateA = a.start_at || a.exam_date;
        const dateB = b.start_at || b.exam_date;
        return new Date(dateA) - new Date(dateB);
      },
    ),
    upcoming_assignments: upcomingAssignments.rows,
    exams_summary: examsSummary.rows[0],
    pending_assignments_count: parseInt(pendingAssignments.rows[0]?.count || 0),
  };
};

module.exports = {
  getDashboard,
};
