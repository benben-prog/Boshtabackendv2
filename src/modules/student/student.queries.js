/* ============================================
   STUDENT QUERIES (Personal Dashboard)
   ============================================ */

// ============================================
// DASHBOARD QUERIES
// ============================================

// Get student dashboard data
const getStudentDashboard = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.profile_image,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.id = $1 AND s.deleted = 0
`;

// Get attendance summary for dashboard
const getAttendanceSummary = `
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

// Get upcoming and active online exams
const getUpcomingOnlineExams = `
SELECT 
  oe.id,
  oe.title,
  oe.duration_minutes,
  oe.start_at,
  oe.end_at,
  oe.full_mark,
  'online' AS exam_type,
  CASE
    WHEN oe.start_at <= NOW() AT TIME ZONE 'Africa/Cairo' THEN 'available'
    ELSE 'upcoming'
  END AS status
FROM online_exams oe
WHERE oe.grade_id = $1
  AND oe.deleted = 0
  AND oe.end_at >= NOW() AT TIME ZONE 'Africa/Cairo'
  AND (oe.group_id IS NULL OR oe.group_id = $2)
  AND NOT EXISTS (
    SELECT 1 FROM student_exams se 
    WHERE se.exam_id = oe.id AND se.student_id = $3 AND (se.submitted_at IS NOT NULL OR se.is_absent = true)
  )
ORDER BY 
  CASE WHEN oe.start_at <= NOW() AT TIME ZONE 'Africa/Cairo' THEN 0 ELSE 1 END ASC,
  oe.start_at ASC
LIMIT 5
`;

// Get upcoming paper exams
const getUpcomingPaperExams = `
SELECT 
  e.id,
  e.title,
  e.exam_date,
  e.total_degree,
  'paper' AS exam_type,
  'upcoming' AS status
FROM exams e
WHERE e.grade_id = $1
  AND e.deleted = 0
  AND e.exam_date >= CURRENT_DATE
  AND (e.group_id IS NULL OR e.group_id = $2)
  AND NOT EXISTS (
    SELECT 1 FROM exam_results er
    WHERE er.exam_id = e.id AND er.student_id = $3 AND (er.degree IS NOT NULL OR er.is_absent = true)
  )
ORDER BY e.exam_date ASC
LIMIT 5
`;

// Get upcoming assignments
const getUpcomingAssignments = `
SELECT 
  a.id,
  a.title,
  a.full_mark,
  a.deadline,
  CASE 
    WHEN asub.id IS NOT NULL THEN 'submitted'
    WHEN a.deadline IS NOT NULL AND a.deadline < NOW() AT TIME ZONE 'Africa/Cairo' THEN 'overdue'
    ELSE 'pending'
  END AS status
FROM assignments a
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = $1
WHERE a.grade_id = (SELECT grade_id FROM students WHERE id = $1)
  AND a.deleted = 0
  AND (a.deadline IS NULL OR a.deadline > NOW() AT TIME ZONE 'Africa/Cairo')
  AND a.is_closed = 0
ORDER BY a.deadline ASC NULLS LAST
LIMIT 5
`;

// Get exams summary
const getExamsSummary = `
SELECT 
  (SELECT COUNT(*) FROM exam_results er WHERE er.student_id = $1) AS paper_exams_taken,
  (SELECT ROUND(AVG(er.degree)::numeric, 2) FROM exam_results er WHERE er.student_id = $1) AS paper_exams_avg,
  (SELECT COUNT(*) FROM student_exams se WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL) AS online_exams_taken,
  (SELECT ROUND(AVG(se.score)::numeric, 2) FROM student_exams se WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL) AS online_exams_avg,
  (SELECT COUNT(*) FROM assignment_submissions asub WHERE asub.student_id = $1 AND asub.score IS NOT NULL) AS assignments_graded,
  (SELECT COUNT(*) FROM assignment_submissions asub WHERE asub.student_id = $1) AS assignments_submitted
`;

// Get pending assignments count
const getPendingAssignmentsCount = `
SELECT COUNT(*) AS count
FROM assignments a
WHERE a.grade_id = (SELECT grade_id FROM students WHERE id = $1)
  AND a.deleted = 0
  AND (a.deadline IS NULL OR a.deadline > NOW() AT TIME ZONE 'Africa/Cairo')
  AND a.is_closed = 0
  AND NOT EXISTS (
    SELECT 1 FROM assignment_submissions asub 
    WHERE asub.assignment_id = a.id AND asub.student_id = $1
  )
`;

module.exports = {
  getStudentDashboard,
  getAttendanceSummary,
  getUpcomingOnlineExams,
  getUpcomingPaperExams,
  getUpcomingAssignments,
  getExamsSummary,
  getPendingAssignmentsCount,
};
