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
  s.parent_token,
  s.profile_image,
  s.is_active,
  s.deactivation_reason,
  CASE WHEN s.is_active = FALSE THEN 'غير مفعل' ELSE 'مفعل' END AS status_text,
  CASE WHEN s.is_active = FALSE THEN 'inactive' ELSE 'active' END AS status,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name,
  g.monthly_price AS required_amount
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.parent_token = $1::text
`;

// Get all students associated with a parent phone number
const getStudentsByParentPhone = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.parent_token,
  s.profile_image,
  s.is_active,
  s.deactivation_reason,
  CASE WHEN s.is_active = FALSE THEN 'غير مفعل' ELSE 'مفعل' END AS status_text,
  CASE WHEN s.is_active = FALSE THEN 'inactive' ELSE 'active' END AS status,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name,
  g.monthly_price AS required_amount
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.parent_phone = $1::text
ORDER BY s.id ASC
`;

// Get attendance summary
const getParentDashboardAttendance = `
SELECT 
  COUNT(a.id) AS total_days,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
  COUNT(CASE WHEN a.is_makeup::text IN ('1', 'true') THEN 1 END) AS makeup_days,
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage
FROM attendance a
WHERE a.student_id = $1::int
`;

// Get attendance history (up to 500 records)
const getAttendanceHistory = `
SELECT 
  a.id,
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
WHERE a.student_id = $1::int
ORDER BY a.attendance_date DESC
LIMIT COALESCE($2::int, 500)
`;

// Get payments summary (current month details)
const getParentDashboardPayments = `
SELECT 
  sub.id AS subscription_id,
  sub.month AS current_month,
  COALESCE(sub.required_amount, g.monthly_price, 0) AS required_amount,
  COALESCE((
    SELECT SUM(p.amount) 
    FROM payments p 
    WHERE p.student_id = $1::int 
      AND (p.subscription_id = sub.id OR TO_CHAR(p.payment_date, 'YYYY-MM') = TO_CHAR(NOW() AT TIME ZONE 'Africa/Cairo', 'YYYY-MM'))
  ), 0) AS paid_amount,
  CASE 
    WHEN sub.status = 'paid' THEN true
    ELSE false
  END AS is_fully_paid,
  COALESCE(sub.status, 'unpaid') AS status
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id
LEFT JOIN subscriptions sub ON sub.student_id = s.id 
  AND sub.month = TO_CHAR(NOW() AT TIME ZONE 'Africa/Cairo', 'YYYY-MM')
  AND sub.deleted = 0
WHERE s.id = $1::int
`;

// Get payment history (up to 500 records)
const getPaymentHistory = `
SELECT 
  p.id,
  p.amount,
  p.payment_date,
  p.payment_mode,
  p.notes,
  sub.month AS subscription_month,
  COALESCE(sub.required_amount, 0) AS required_amount
FROM payments p
LEFT JOIN subscriptions sub ON p.subscription_id = sub.id
WHERE p.student_id = $1::int
ORDER BY p.payment_date DESC
LIMIT COALESCE($2::int, 500)
`;

// Get all exams (paper + online) combined - includes absent exams
const getParentAllExams = `
SELECT 
  'paper' AS exam_type,
  e.id AS exam_id,
  e.title,
  e.total_degree AS full_mark,
  e.exam_date,
  er.degree AS score,
  CASE 
    WHEN er.degree IS NOT NULL THEN ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 1)
    ELSE NULL
  END AS percentage,
  CASE 
    WHEN er.degree IS NULL THEN 'غائب'
    WHEN ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 1) >= 50 THEN 'ناجح'
    ELSE 'راسب'
  END AS status,
  e.exam_date AS sort_date
FROM exams e
LEFT JOIN exam_results er ON e.id = er.exam_id AND er.student_id = $1::int
WHERE e.grade_id = (SELECT grade_id FROM students WHERE id = $1::int)
  AND e.deleted = 0

UNION ALL

SELECT 
  'online' AS exam_type,
  oe.id AS exam_id,
  oe.title,
  oe.full_mark AS full_mark,
  se.submitted_at AS exam_date,
  se.score AS score,
  CASE 
    WHEN se.score IS NOT NULL THEN ROUND((se.score::numeric / NULLIF(oe.full_mark::numeric, 0)) * 100, 1)
    ELSE NULL
  END AS percentage,
  CASE 
    WHEN se.score IS NULL THEN 'قيد التصحيح'
    WHEN se.score >= (oe.full_mark * 0.5) THEN 'ناجح'
    ELSE 'راسب'
  END AS status,
  se.submitted_at AS sort_date
FROM student_exams se
JOIN online_exams oe ON se.exam_id = oe.id AND oe.deleted = 0
WHERE se.student_id = $1::int
  AND se.submitted_at IS NOT NULL

ORDER BY sort_date DESC
`;

// Get assignments (filtered by grade and group)
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
    WHEN asub.score IS NOT NULL THEN 'تم التصحيح'
    WHEN asub.id IS NOT NULL THEN 'تم التسليم'
    WHEN a.deadline < NOW() AT TIME ZONE 'Africa/Cairo' THEN 'متأخر'
    ELSE 'معلق'
  END AS status
FROM assignments a
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = $1::int
WHERE a.grade_id = (SELECT grade_id FROM students WHERE id = $1::int)
  AND (a.group_id IS NULL OR a.group_id = (SELECT group_id FROM students WHERE id = $1::int))
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
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
WHERE gr.id = (SELECT group_id FROM students WHERE id = $1::int)
  AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.days, gr.start_time, gr.end_time, gr.room
`;

// Get overall stats (accurate percentages)
const getStudentOverallStats = `
SELECT 
  (SELECT ROUND(AVG((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100), 1) 
   FROM exam_results er 
   JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
   WHERE er.student_id = $1::int) AS avg_paper_score,
  (SELECT ROUND(AVG((se.score::numeric / NULLIF(oe.full_mark::numeric, 0)) * 100), 1) 
   FROM student_exams se 
   JOIN online_exams oe ON se.exam_id = oe.id AND oe.deleted = 0
   WHERE se.student_id = $1::int AND se.submitted_at IS NOT NULL) AS avg_online_score,
  (SELECT COUNT(*) FROM exam_results er WHERE er.student_id = $1::int) AS total_paper_exams,
  (SELECT COUNT(*) FROM student_exams se 
   WHERE se.student_id = $1::int AND se.submitted_at IS NOT NULL) AS total_online_exams
`;

module.exports = {
  getStudentByParentToken,
  getStudentsByParentPhone,
  getParentDashboardAttendance,
  getAttendanceHistory,
  getParentDashboardPayments,
  getPaymentHistory,
  getParentAllExams,
  getParentDashboardAssignments,
  getGroupInfo,
  getStudentOverallStats,
};
