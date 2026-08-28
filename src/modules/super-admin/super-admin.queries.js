/* ============================================
   SUPER ADMIN QUERIES
   ============================================ */

// Get dashboard overview
const getDashboardOverview = `
SELECT 
  (SELECT COUNT(*) FROM students WHERE deleted = 0) AS total_students,
  (SELECT COUNT(*) FROM students WHERE deleted = 0 AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS new_students_this_month,
  (SELECT COUNT(*) FROM users WHERE role = 'assistant' AND deleted = 0 AND is_active = 1) AS total_assistants,
  (SELECT COUNT(*) FROM users WHERE role = 'teacher' AND deleted = 0 AND is_active = 1) AS total_teachers,
  (SELECT COUNT(*) FROM grades WHERE deleted = 0) AS total_grades,
  (SELECT COUNT(*) FROM groups WHERE deleted = 0) AS total_groups
`;

// Get attendance today stats
const getAttendanceTodayStats = `
SELECT 
  (SELECT COUNT(*) FROM students WHERE deleted = 0) AS total_students,
  (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURRENT_DATE AND status = 'present') AS present_count,
  (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURRENT_DATE AND status = 'absent') AS absent_count,
  (SELECT COUNT(*) FROM students s 
   WHERE s.deleted = 0 
     AND NOT EXISTS (
       SELECT 1 FROM attendance a 
       WHERE a.student_id = s.id AND a.attendance_date = CURRENT_DATE
     )) AS not_marked_count
`;

// Get payments month stats
const getPaymentsMonthStats = `
SELECT 
  COALESCE(SUM(sub.required_amount), 0) AS total_required,
  COALESCE(SUM(paid.total_paid), 0) AS total_paid,
  COALESCE(SUM(sub.required_amount), 0) - COALESCE(SUM(paid.total_paid), 0) AS total_remaining,
  COUNT(DISTINCT CASE WHEN COALESCE(paid.total_paid, 0) >= sub.required_amount THEN s.id END) AS fully_paid_students,
  COUNT(DISTINCT CASE WHEN COALESCE(paid.total_paid, 0) < sub.required_amount OR paid.total_paid IS NULL THEN s.id END) AS unpaid_students
FROM students s
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
LEFT JOIN LATERAL (
  SELECT COALESCE(SUM(p.amount), 0) AS total_paid
  FROM payments p
  WHERE p.student_id = s.id 
    AND p.subscription_id = sub.id
) paid ON true
WHERE s.deleted = 0
`;

// Get exams stats
const getExamsStats = `
SELECT 
  (SELECT COUNT(*) FROM exams WHERE deleted = 0 AND exam_date >= CURRENT_DATE) AS upcoming_paper_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND end_at > NOW() AND start_at <= NOW()) AS active_online_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND start_at > NOW()) AS upcoming_online_exams,
  (SELECT COUNT(*) FROM assignments WHERE deleted = 0 AND deadline >= CURRENT_DATE AND is_closed = 0) AS active_assignments,
  (SELECT COUNT(*) FROM assignment_submissions WHERE score IS NULL) AS pending_grading
`;

// Get students with 3 consecutive absences
const getStudentsWithThreeAbsences = `
WITH ranked_attendance AS (
  SELECT 
    a.student_id,
    a.attendance_date,
    a.status,
    SUM(CASE WHEN a.status != 'absent' THEN 1 ELSE 0 END) 
      OVER (PARTITION BY a.student_id ORDER BY a.attendance_date DESC) AS group_id
  FROM attendance a
),
absent_streaks AS (
  SELECT 
    student_id,
    COUNT(*) AS consecutive_absences
  FROM ranked_attendance
  WHERE status = 'absent' AND group_id = 0
  GROUP BY student_id
)
SELECT COUNT(*) AS count
FROM absent_streaks
WHERE consecutive_absences >= 3
`;

// Get platform settings
const getPlatformSettings = `
SELECT 
  center_name,
  phone,
  address,
  default_lock_minutes,
  academic_year_status,
  platform_status
FROM settings
WHERE id = 1
`;

// Get recent activities from activity_logs (آخر 10 عمليات)
const getRecentActivities = `
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
ORDER BY al.created_at DESC
LIMIT 10
`;

module.exports = {
  getDashboardOverview,
  getAttendanceTodayStats,
  getPaymentsMonthStats,
  getExamsStats,
  getStudentsWithThreeAbsences,
  getPlatformSettings,
  getRecentActivities,
};
