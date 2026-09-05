/* ============================================
   ASSISTANT QUERIES
   ============================================ */

// Get assistant profile
const getAssistantProfile = `
SELECT 
  id,
  full_name,
  phone,
  role,
  permissions,
  profile_image,
  is_active,
  created_at,
  updated_at
FROM users
WHERE id = $1 AND deleted = 0
`;

// Get activity logs with filters
const getActivityLogs = `
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
WHERE ($1 = '' OR al.entity_type = $1)
  AND ($2::date IS NULL OR DATE(al.created_at AT TIME ZONE 'Africa/Cairo') = $2::date)
  AND ($3 = '' OR al.user_role = $3)
ORDER BY al.created_at DESC
LIMIT 20 OFFSET (($4::int - 1) * 20)
`;

// Get activity logs count
const getActivityLogsCount = `
SELECT COUNT(*) AS count
FROM activity_logs al
WHERE ($1 = '' OR al.entity_type = $1)
  AND ($2::date IS NULL OR DATE(al.created_at AT TIME ZONE 'Africa/Cairo') = $2::date)
  AND ($3 = '' OR al.user_role = $3)
`;

// Get activity logs for specific user (online assistant)
const getMyActivityLogs = `
SELECT 
  al.id,
  al.user_id,
  al.action,
  al.entity_type,
  al.entity_id,
  al.description,
  al.created_at
FROM activity_logs al
WHERE al.user_id = $1
ORDER BY al.created_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get my activity logs count
const getMyActivityLogsCount = `
SELECT COUNT(*) AS count
FROM activity_logs al
WHERE al.user_id = $1
`;

// Get dashboard stats for online assistant
const getOnlineAssistantDashboard = `
SELECT 
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0) AS total_online_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND end_at > NOW() AND start_at <= NOW()) AS active_online_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND start_at > NOW()) AS upcoming_online_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND end_at < NOW()) AS expired_online_exams,
  (SELECT COUNT(*) FROM questions) AS total_questions,
  (SELECT COUNT(*) FROM questions WHERE type = 'mcq') AS mcq_questions,
  (SELECT COUNT(*) FROM questions WHERE type = 'true_false') AS true_false_questions,
  (SELECT COUNT(*) FROM questions WHERE type = 'essay') AS essay_questions,
  (SELECT COUNT(*) FROM assignments WHERE deleted = 0) AS total_assignments,
  (SELECT COUNT(*) FROM assignments WHERE deleted = 0 AND deadline > NOW() AND is_closed = 0) AS active_assignments,
  (SELECT COUNT(*) FROM assignment_submissions WHERE score IS NULL) AS pending_grading,
  (SELECT COUNT(*) FROM videos) AS total_videos,
  (SELECT COUNT(*) FROM playlists) AS total_playlists
`;

// Get dashboard stats for center assistant
const getCenterAssistantDashboard = `
SELECT 
  (SELECT COUNT(*) FROM students WHERE deleted = 0) AS total_students,
  (SELECT COUNT(*) FROM grades WHERE deleted = 0) AS total_grades,
  (SELECT COUNT(*) FROM groups WHERE deleted = 0) AS total_groups,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND end_at > NOW() AND start_at <= NOW()) AS active_online_exams,
  (SELECT COUNT(*) FROM assignments WHERE deleted = 0 AND deadline > NOW() AND is_closed = 0) AS active_assignments,
  (SELECT COUNT(*) FROM assignment_submissions WHERE score IS NULL) AS pending_grading,
  (SELECT COUNT(*) FROM videos) AS total_videos,
  (SELECT COUNT(*) FROM playlists) AS total_playlists,
  (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURRENT_DATE AT TIME ZONE 'Africa/Cairo' AND status = 'present') AS present_today,
  (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURRENT_DATE AT TIME ZONE 'Africa/Cairo' AND status = 'absent') AS absent_today,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE TO_CHAR(payment_date AT TIME ZONE 'Africa/Cairo', 'YYYY-MM') = TO_CHAR(CURRENT_DATE AT TIME ZONE 'Africa/Cairo', 'YYYY-MM')) AS total_paid_month,
  (SELECT COUNT(*) FROM students WHERE deleted = 0 AND id NOT IN (
    SELECT student_id FROM subscriptions WHERE month = TO_CHAR(CURRENT_DATE AT TIME ZONE 'Africa/Cairo', 'YYYY-MM') AND deleted = 0
  )) AS unpaid_students
`;

module.exports = {
  getAssistantProfile,
  getActivityLogs,
  getActivityLogsCount,
  getMyActivityLogs,
  getMyActivityLogsCount,
  getOnlineAssistantDashboard,
  getCenterAssistantDashboard,
};
