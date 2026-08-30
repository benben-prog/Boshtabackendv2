/* ============================================
   PARENT QUERIES
   ============================================ */

// Get student by parent token
const getStudentByParentToken = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.profile_image,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.parent_token = $1 AND s.deleted = 0
`;

// Get attendance summary
const getParentDashboardAttendance = `
SELECT 
  COUNT(a.id) AS total_days,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage
FROM attendance a
WHERE a.student_id = $1
`;

// Get attendance history - 20 per page
const getAttendanceHistory = `
SELECT 
  a.attendance_date,
  CASE 
    WHEN EXTRACT(DOW FROM a.attendance_date) = 0 THEN 'الأحد'
    WHEN EXTRACT(DOW FROM a.attendance_date) = 1 THEN 'الاثنين'
    WHEN EXTRACT(DOW FROM a.attendance_date) = 2 THEN 'الثلاثاء'
    WHEN EXTRACT(DOW FROM a.attendance_date) = 3 THEN 'الأربعاء'
    WHEN EXTRACT(DOW FROM a.attendance_date) = 4 THEN 'الخميس'
    WHEN EXTRACT(DOW FROM a.attendance_date) = 5 THEN 'الجمعة'
    WHEN EXTRACT(DOW FROM a.attendance_date) = 6 THEN 'السبت'
  END AS day_name,
  a.status,
  a.attendance_time,
  a.method,
  a.is_makeup,
  a.notes
FROM attendance a
WHERE a.student_id = $1
ORDER BY a.attendance_date DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get payments summary
const getParentDashboardPayments = `
SELECT 
  COALESCE(SUM(sub.required_amount), 0) AS total_required,
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.student_id = $1), 0
  ) AS total_paid,
  COALESCE(SUM(sub.required_amount), 0) - 
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.student_id = $1), 0
  ) AS remaining
FROM subscriptions sub
WHERE sub.student_id = $1 AND sub.deleted = 0
`;

// Get payment history - 20 per page
const getPaymentHistory = `
SELECT 
  p.id,
  p.amount,
  p.payment_date,
  p.notes,
  sub.month AS subscription_month,
  sub.required_amount
FROM payments p
LEFT JOIN subscriptions sub ON p.subscription_id = sub.id
WHERE p.student_id = $1
ORDER BY p.payment_date DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// ✅ Get all exams (paper + online) combined
const getParentAllExams = `
SELECT 
  'paper' AS exam_type,
  e.id AS exam_id,
  e.title,
  e.total_degree AS full_mark,
  e.exam_date,
  er.degree AS score,
  ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2) AS percentage,
  CASE 
    WHEN ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2) >= 50 THEN 'passed'
    ELSE 'failed'
  END AS status,
  e.exam_date AS sort_date
FROM exam_results er
JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
WHERE er.student_id = $1

UNION ALL

SELECT 
  'online' AS exam_type,
  oe.id AS exam_id,
  oe.title,
  oe.full_mark AS full_mark,
  se.submitted_at AS exam_date,
  se.score AS score,
  ROUND((se.score::numeric / NULLIF(oe.full_mark::numeric, 0)) * 100, 2) AS percentage,
  CASE 
    WHEN se.score IS NULL THEN 'pending'
    WHEN se.score >= (oe.full_mark * 0.5) THEN 'passed'
    ELSE 'failed'
  END AS status,
  se.submitted_at AS sort_date
FROM student_exams se
JOIN online_exams oe ON se.exam_id = oe.id AND oe.deleted = 0
WHERE se.student_id = $1
  AND se.submitted_at IS NOT NULL

ORDER BY sort_date DESC
`;

// Get assignments
const getParentDashboardAssignments = `
SELECT 
  a.id,
  a.title,
  a.description,
  a.full_mark,
  a.deadline,
  a.is_closed,
  asub.submitted_at,
  asub.score,
  asub.feedback,
  CASE 
    WHEN asub.score IS NOT NULL THEN 'graded'
    WHEN asub.id IS NOT NULL THEN 'submitted'
    WHEN a.deadline < NOW() THEN 'overdue'
    ELSE 'pending'
  END AS status
FROM assignments a
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = $1
WHERE a.grade_id = (SELECT grade_id FROM students WHERE id = $1 AND deleted = 0)
  AND a.deleted = 0
ORDER BY a.deadline DESC
`;

// Get group info
const getGroupInfo = `
SELECT 
  gr.name AS group_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  COUNT(DISTINCT s.id) AS students_count
FROM groups gr
JOIN students s ON gr.id = s.group_id AND s.deleted = 0
WHERE gr.id = (SELECT group_id FROM students WHERE id = $1 AND deleted = 0)
  AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.days, gr.start_time, gr.end_time, gr.room
`;

// Get overall stats
const getStudentOverallStats = `
SELECT 
  ROUND(AVG(er.degree)::numeric, 2) AS avg_paper_score,
  ROUND(AVG(se.score)::numeric, 2) AS avg_online_score,
  COUNT(DISTINCT er.id) AS total_paper_exams,
  COUNT(DISTINCT se.id) AS total_online_exams
FROM students s
LEFT JOIN exam_results er ON s.id = er.student_id
LEFT JOIN student_exams se ON s.id = se.student_id AND se.submitted_at IS NOT NULL
WHERE s.id = $1
GROUP BY s.id
`;

module.exports = {
  getStudentByParentToken,
  getParentDashboardAttendance,
  getAttendanceHistory,
  getParentDashboardPayments,
  getPaymentHistory,
  getParentAllExams,
  getParentDashboardAssignments,
  getGroupInfo,
  getStudentOverallStats,
};
