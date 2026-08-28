const { query } = require("../../config/database");
const superAdminQueries = require("./super-admin.queries");

// Get dashboard
const getDashboard = async () => {
  const overview = await query(superAdminQueries.getDashboardOverview);
  const attendance = await query(superAdminQueries.getAttendanceTodayStats);
  const payments = await query(superAdminQueries.getPaymentsMonthStats);
  const exams = await query(superAdminQueries.getExamsStats);
  const settings = await query(superAdminQueries.getPlatformSettings);
  const recentActivities = await query(superAdminQueries.getRecentActivities);
  const absences = await query(superAdminQueries.getStudentsWithThreeAbsences);

  return {
    overview: overview.rows[0],
    attendance_today: attendance.rows[0],
    payments_month: payments.rows[0],
    exams: exams.rows[0],
    platform: settings.rows[0],
    students_with_3_absences: parseInt(absences.rows[0]?.count || 0),
    recent_activities: recentActivities.rows,
  };
};

// Get platform status
const getPlatformStatus = async () => {
  const result = await query(superAdminQueries.getPlatformSettings);
  return result.rows[0];
};

module.exports = {
  getDashboard,
  getPlatformStatus,
};
