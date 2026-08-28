const { query } = require("../../config/database");
const teacherQueries = require("./teacher.queries");

// Get teacher profile
const getTeacherProfile = async (teacherId) => {
  const result = await query(teacherQueries.getTeacherProfile, [teacherId]);
  return result.rows[0];
};

// Get dashboard
const getDashboard = async () => {
  const overview = await query(teacherQueries.getDashboardOverview);
  const attendance = await query(teacherQueries.getAttendanceTodayStats);
  const exams = await query(teacherQueries.getExamsStats);
  const assignments = await query(teacherQueries.getAssignmentsStats);
  const payments = await query(teacherQueries.getPaymentsMonthStats);
  const lastPayment = await query(teacherQueries.getLastPayment);
  const recentActivities = await query(teacherQueries.getRecentActivities);

  return {
    overview: overview.rows[0],
    attendance_today: attendance.rows[0],
    exams: exams.rows[0],
    assignments: assignments.rows[0],
    payments_month: payments.rows[0],
    last_payment: lastPayment.rows[0] || null,
    recent_activities: recentActivities.rows,
  };
};

// Get activity log (assistants only - excluding super_admin)
const getActivityLogs = async (filters, teacherId) => {
  const { entity_type = "", date = null, page = 1 } = filters;

  // Custom query for teacher - only see assistant activities
  const logsQuery = `
    SELECT 
      al.id,
      al.user_id,
      u.full_name AS user_name,
      al.user_role,
      al.user_permissions,
      al.action,
      al.entity_type,
      al.entity_id,
      al.description,
      al.created_at
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.user_role = 'assistant'
      AND ($1 = '' OR al.entity_type = $1)
      AND ($2::date IS NULL OR DATE(al.created_at) = $2::date)
    ORDER BY al.created_at DESC
    LIMIT 20 OFFSET (($3::int - 1) * 20)
  `;

  const countQuery = `
    SELECT COUNT(*) AS count
    FROM activity_logs al
    WHERE al.user_role = 'assistant'
      AND ($1 = '' OR al.entity_type = $1)
      AND ($2::date IS NULL OR DATE(al.created_at) = $2::date)
  `;

  const logsResult = await query(logsQuery, [entity_type, date, page]);
  const countResult = await query(countQuery, [entity_type, date]);

  return {
    logs: logsResult.rows,
    total: parseInt(countResult.rows[0]?.count || 0),
  };
};

module.exports = {
  getTeacherProfile,
  getDashboard,
  getActivityLogs,
};
