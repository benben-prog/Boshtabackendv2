/* ============================================
   TEACHER QUERIES (Dashboard)
   ============================================ */

// Get teacher dashboard overview
const getDashboardOverview = `
SELECT 
  (SELECT COUNT(*) FROM students WHERE deleted = 0) AS total_students,
  (SELECT COUNT(*) FROM grades WHERE deleted = 0) AS total_grades,
  (SELECT COUNT(*) FROM groups WHERE deleted = 0) AS total_groups,
  (SELECT COUNT(*) FROM users WHERE role = 'assistant' AND deleted = 0 AND is_active = 1) AS total_assistants,
  (SELECT COUNT(*) FROM users WHERE role = 'teacher' AND deleted = 0 AND is_active = 1) AS total_teachers,
  (SELECT COUNT(*) FROM videos) AS total_videos,
  (SELECT COUNT(*) FROM playlists) AS total_playlists
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

// Get exams stats
const getExamsStats = `
SELECT 
  (SELECT COUNT(*) FROM exams WHERE deleted = 0 AND exam_date >= CURRENT_DATE) AS upcoming_paper_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND start_at > NOW()) AS upcoming_online_exams,
  (SELECT COUNT(*) FROM online_exams WHERE deleted = 0 AND end_at > NOW() AND start_at <= NOW()) AS active_online_exams,
  (SELECT ROUND(AVG(er.degree)::numeric, 2) FROM exam_results er) AS avg_paper_score,
  (SELECT ROUND(AVG(se.score)::numeric, 2) FROM student_exams se WHERE se.submitted_at IS NOT NULL) AS avg_online_score
`;

// Get assignments stats
const getAssignmentsStats = `
SELECT 
  (SELECT COUNT(*) FROM assignments WHERE deleted = 0 AND deadline > NOW() AND is_closed = 0) AS active_assignments,
  (SELECT COUNT(*) FROM assignment_submissions WHERE score IS NULL) AS pending_grading,
  (SELECT COUNT(*) FROM assignments WHERE deleted = 0 AND deadline >= CURRENT_DATE AND deadline <= CURRENT_DATE + INTERVAL '3 days') AS due_soon
`;

// Get payments month stats
const getPaymentsMonthStats = `
SELECT 
  COALESCE(SUM(sub.required_amount), 0) AS total_required,
  COALESCE(SUM(paid.total_paid), 0) AS total_paid,
  COALESCE(SUM(sub.required_amount), 0) - COALESCE(SUM(paid.total_paid), 0) AS total_remaining,
  ROUND(
    (COALESCE(SUM(paid.total_paid), 0)::numeric / 
    NULLIF(COALESCE(SUM(sub.required_amount), 0), 0)) * 100, 2
  ) AS paid_percentage
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

// Get last payment
const getLastPayment = `
SELECT 
  p.id,
  p.amount,
  p.payment_date,
  s.full_name AS student_name,
  s.barcode
FROM payments p
JOIN students s ON p.student_id = s.id
ORDER BY p.payment_date DESC
LIMIT 1
`;

// Get recent activities (assistants only - excluding super_admin)
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
WHERE al.user_role = 'assistant'
ORDER BY al.created_at DESC
LIMIT 10
`;

// Get teacher profile
const getTeacherProfile = `
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

module.exports = {
  getDashboardOverview,
  getAttendanceTodayStats,
  getExamsStats,
  getAssignmentsStats,
  getPaymentsMonthStats,
  getLastPayment,
  getRecentActivities,
  getTeacherProfile,
};
