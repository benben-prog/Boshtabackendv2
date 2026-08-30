// PART 1: CRUD & SEARCH OPERATIONS

// Create a new student
const createStudent = `
INSERT INTO students (barcode, full_name, phone, parent_phone, parent_token, grade_id, group_id, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *
`;

// Get all students with filters (search, grade, group) - 20 per page
const getAllStudents = `
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
WHERE s.deleted = 0
  AND ($1 = '' OR s.full_name ILIKE $1 OR s.barcode ILIKE $1 OR s.phone ILIKE $1)
  AND ($2::int IS NULL OR s.grade_id = $2::int)
  AND ($3::int IS NULL OR s.group_id = $3::int)
ORDER BY s.full_name ASC
LIMIT 20 OFFSET (($4::int - 1) * 20)
`;

// Get a single student by ID
const getStudentById = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.password,
  s.profile_image,
  s.notes,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.id = $1 AND s.deleted = 0
`;

// Get a student by barcode
const getStudentByBarcode = `
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
WHERE s.barcode = $1 AND s.deleted = 0
`;

// Find a student by phone number
const findStudentByPhone = `
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
WHERE s.phone = $1 AND s.deleted = 0
`;

// Find students by parent phone number
const findStudentByParentPhone = `
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
WHERE s.parent_phone = $1 AND s.deleted = 0
`;

// Get all students in a specific grade - 20 per page
const getStudentsByGradeId = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.profile_image,
  s.group_id,
  gr.name AS group_name
FROM students s
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.grade_id = $1 AND s.deleted = 0
ORDER BY s.full_name ASC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get all students in a specific group - 20 per page
const getStudentsByGroupId = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.profile_image,
  s.grade_id,
  g.name AS grade_name
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
WHERE s.group_id = $1 AND s.deleted = 0
ORDER BY s.full_name ASC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get all deleted students - 20 per page
const getDeletedStudents = `
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
  gr.name AS group_name,
  s.deleted
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id
LEFT JOIN groups gr ON s.group_id = gr.id
WHERE s.deleted = 1
ORDER BY s.full_name ASC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

// Update a student's full information
const updateStudent = `
UPDATE students 
SET 
  barcode = $1,
  full_name = $2,
  phone = $3,
  parent_phone = $4,
  grade_id = $5,
  group_id = $6,
  notes = $7,
  updated_at = NOW()
WHERE id = $8 AND deleted = 0
RETURNING *
`;

// Update student's profile image
const updateStudentProfileImage = `
UPDATE students 
SET profile_image = $1, updated_at = NOW()
WHERE id = $2 AND deleted = 0
RETURNING id, profile_image
`;

// Delete student's profile image (set to NULL)
const deleteStudentProfileImage = `
UPDATE students 
SET profile_image = NULL, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id, profile_image
`;

// Get student's profile image only
const getStudentProfileImage = `
SELECT profile_image
FROM students
WHERE id = $1 AND deleted = 0
`;

// Update student's password
const updateStudentPassword = `
UPDATE students 
SET password = $1, updated_at = NOW()
WHERE id = $2 AND deleted = 0
RETURNING id
`;

// Soft delete a student (set deleted = 1)
const softDeleteStudent = `
UPDATE students 
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id, deleted
`;

// Hard delete a student permanently
const hardDeleteStudent = `
DELETE FROM students 
WHERE id = $1
RETURNING id
`;

// Restore a soft-deleted student
const restoreStudent = `
UPDATE students 
SET deleted = 0, updated_at = NOW()
WHERE id = $1 AND deleted = 1
RETURNING id, deleted
`;

// Get students count with filters
const getStudentsCount = `
SELECT COUNT(*) AS count
FROM students s
WHERE s.deleted = 0
  AND ($1 = '' OR s.full_name ILIKE $1 OR s.barcode ILIKE $1 OR s.phone ILIKE $1)
  AND ($2::int IS NULL OR s.grade_id = $2::int)
  AND ($3::int IS NULL OR s.group_id = $3::int)
`;

// PART 2: PROFILE & STATISTICS

// Get student full profile with all details
const getStudentProfile = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.parent_token,
  s.profile_image,
  s.notes,
  s.grade_id,
  g.name AS grade_name,
  g.monthly_price,
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

// Get student quick stats (attendance, exams, payments)
const getStudentQuickStats = `
SELECT 
  (SELECT COUNT(*) FROM attendance WHERE student_id = $1) AS total_attendance_days,
  (SELECT COUNT(*) FROM attendance WHERE student_id = $1 AND status = 'present') AS present_days,
  (SELECT COUNT(*) FROM attendance WHERE student_id = $1 AND status = 'absent') AS absent_days,
  ROUND(
    (SELECT COUNT(*) FROM attendance WHERE student_id = $1 AND status = 'present')::numeric / 
    NULLIF((SELECT COUNT(*) FROM attendance WHERE student_id = $1), 0) * 100, 2
  ) AS attendance_percentage,
  (SELECT COUNT(*) FROM exams e WHERE e.grade_id = (SELECT grade_id FROM students WHERE id = $1) AND e.deleted = 0) AS total_paper_exams,
  (SELECT COUNT(*) FROM exam_results er WHERE er.student_id = $1) AS attended_paper_exams,
  (SELECT ROUND(AVG(er.degree)::numeric, 2) FROM exam_results er WHERE er.student_id = $1) AS avg_paper_degree,
  (SELECT MAX(er.degree) FROM exam_results er WHERE er.student_id = $1) AS highest_paper_degree,
  (SELECT MIN(er.degree) FROM exam_results er WHERE er.student_id = $1) AS lowest_paper_degree,
  (SELECT COUNT(*) FROM student_exams se WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL) AS total_online_exams,
  (SELECT ROUND(AVG(se.score)::numeric, 2) FROM student_exams se WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL) AS avg_online_score,
  (SELECT COALESCE(SUM(sub.required_amount), 0) FROM subscriptions sub WHERE sub.student_id = $1 AND sub.deleted = 0) AS total_required,
  (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.student_id = $1) AS total_paid,
  (SELECT COALESCE(SUM(sub.required_amount), 0) FROM subscriptions sub WHERE sub.student_id = $1 AND sub.deleted = 0) - 
  (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.student_id = $1) AS remaining_balance
`;

// Get student attendance history with month filter - 20 per page
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
  a.notes,
  gr.name AS group_name
FROM attendance a
LEFT JOIN groups gr ON a.group_id = gr.id
WHERE a.student_id = $1
  AND ($2 = '' OR TO_CHAR(a.attendance_date, 'YYYY-MM') = $2)
ORDER BY a.attendance_date DESC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// Get monthly attendance statistics
const getMonthlyAttendanceStats = `
SELECT 
  TO_CHAR(a.attendance_date, 'YYYY-MM') AS month,
  COUNT(a.id) AS total_days,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage
FROM attendance a
WHERE a.student_id = $1
GROUP BY TO_CHAR(a.attendance_date, 'YYYY-MM')
ORDER BY month DESC
`;

// Get total attendance for a specific month
const getStudentTotalAttendance = `
SELECT 
  TO_CHAR(a.attendance_date, 'YYYY-MM') AS month,
  COUNT(a.id) AS total_days,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage
FROM attendance a
WHERE a.student_id = $1
  AND TO_CHAR(a.attendance_date, 'YYYY-MM') = $2
GROUP BY TO_CHAR(a.attendance_date, 'YYYY-MM')
`;

// Get consecutive absences (3 or more in a row)
const getConsecutiveAbsences = `
WITH ranked_attendance AS (
  SELECT 
    a.attendance_date,
    a.status,
    SUM(CASE WHEN a.status != 'absent' THEN 1 ELSE 0 END) 
      OVER (ORDER BY a.attendance_date DESC) AS group_id
  FROM attendance a
  WHERE a.student_id = $1
)
SELECT 
  COUNT(*) AS consecutive_absences,
  MIN(attendance_date) AS from_date,
  MAX(attendance_date) AS to_date
FROM ranked_attendance
WHERE status = 'absent' AND group_id = 0
`;

// Get student payment history with month filter - 20 per page
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
  AND ($2 = '' OR TO_CHAR(p.payment_date, 'YYYY-MM') = $2)
ORDER BY p.payment_date DESC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// Get remaining balance for a student
const getRemainingBalance = `
SELECT 
  (SELECT COALESCE(SUM(sub.required_amount), 0) FROM subscriptions sub WHERE sub.student_id = $1 AND sub.deleted = 0) AS total_required,
  (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.student_id = $1) AS total_paid,
  (SELECT COALESCE(SUM(sub.required_amount), 0) FROM subscriptions sub WHERE sub.student_id = $1 AND sub.deleted = 0) - 
  (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.student_id = $1) AS remaining_balance
`;

// Get current month subscription
const getCurrentSubscription = `
SELECT 
  sub.id,
  sub.month,
  sub.required_amount,
  sub.status,
  (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.subscription_id = sub.id) AS paid_amount,
  sub.required_amount - (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.subscription_id = sub.id) AS remaining_amount
FROM subscriptions sub
WHERE sub.student_id = $1 
  AND sub.deleted = 0
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
`;

// PART 3: EXAMS, ASSIGNMENTS & CONTENT

// Get all paper exams with student status - month filter - 20 per page
const getStudentPaperExams = `
SELECT 
  e.id AS exam_id,
  e.title AS exam_title,
  e.exam_date,
  e.total_degree,
  er.degree AS student_degree,
  CASE 
    WHEN er.degree IS NOT NULL THEN 'attended'
    ELSE 'absent'
  END AS exam_status,
  CASE 
    WHEN er.degree IS NOT NULL THEN ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2)
    ELSE NULL
  END AS percentage
FROM exams e
LEFT JOIN exam_results er ON e.id = er.exam_id AND er.student_id = $1
WHERE e.grade_id = (SELECT grade_id FROM students WHERE id = $1)
  AND e.deleted = 0
  AND ($2 = '' OR TO_CHAR(e.exam_date, 'YYYY-MM') = $2)
ORDER BY e.exam_date DESC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// ✅ Get student exam results - paper + online combined
const getStudentExamResults = `
SELECT 
  'paper' AS exam_type,
  er.id AS result_id,
  er.degree AS score,
  e.title AS exam_title,
  e.total_degree AS full_mark,
  e.exam_date AS exam_date,
  ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2) AS percentage,
  NULL AS result_status
FROM exam_results er
JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
WHERE er.student_id = $1

UNION ALL

SELECT 
  'online' AS exam_type,
  se.id AS result_id,
  se.score AS score,
  oe.title AS exam_title,
  oe.full_mark AS full_mark,
  se.submitted_at AS exam_date,
  ROUND((se.score::numeric / NULLIF(oe.full_mark::numeric, 0)) * 100, 2) AS percentage,
  CASE 
    WHEN se.score IS NULL THEN 'pending'
    WHEN se.score >= (oe.full_mark * 0.5) THEN 'passed'
    ELSE 'failed'
  END AS result_status
FROM student_exams se
JOIN online_exams oe ON se.exam_id = oe.id AND oe.deleted = 0
WHERE se.student_id = $1
  AND se.submitted_at IS NOT NULL

ORDER BY exam_date DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get available online exams for student - 20 per page
const getAvailableOnlineExams = `
SELECT 
  oe.id AS exam_id,
  oe.title AS exam_title,
  oe.description,
  oe.duration_minutes,
  oe.full_mark,
  oe.start_at,
  oe.end_at,
  oe.randomize_questions,
  (SELECT COUNT(*) FROM questions q WHERE q.exam_id = oe.id) AS questions_count,
  CASE 
    WHEN oe.start_at > NOW() THEN 'upcoming'
    WHEN oe.end_at < NOW() THEN 'expired'
    ELSE 'available'
  END AS exam_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM student_exams se WHERE se.exam_id = oe.id AND se.student_id = $1 AND se.submitted_at IS NOT NULL) THEN true
    ELSE false
  END AS attempted
FROM online_exams oe
WHERE oe.grade_id = (SELECT grade_id FROM students WHERE id = $1)
  AND oe.deleted = 0
  AND (oe.group_id IS NULL OR oe.group_id = (SELECT group_id FROM students WHERE id = $1))
ORDER BY oe.start_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get student's submitted online exams - month filter - 20 per page
const getStudentOnlineExams = `
SELECT 
  se.id AS attempt_id,
  oe.title AS exam_title,
  oe.full_mark,
  se.score,
  ROUND((se.score::numeric / NULLIF(oe.full_mark::numeric, 0)) * 100, 2) AS percentage,
  se.started_at,
  se.submitted_at,
  CASE 
    WHEN se.score IS NULL THEN 'pending'
    WHEN se.score >= (oe.full_mark * 0.5) THEN 'passed'
    ELSE 'failed'
  END AS result_status
FROM student_exams se
JOIN online_exams oe ON se.exam_id = oe.id
WHERE se.student_id = $1
  AND se.submitted_at IS NOT NULL
  AND ($2 = '' OR TO_CHAR(se.submitted_at, 'YYYY-MM') = $2)
ORDER BY se.submitted_at DESC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// Get student answers for a specific exam
const getStudentExamAnswers = `
SELECT 
  sa.id AS answer_id,
  q.question_text,
  q.type AS question_type,
  o.option_text AS selected_option,
  correct_o.option_text AS correct_option,
  sa.is_correct,
  sa.file_path
FROM student_answers sa
JOIN questions q ON sa.question_id = q.id
LEFT JOIN options o ON sa.selected_option_id = o.id
LEFT JOIN options correct_o ON q.id = correct_o.question_id AND correct_o.is_correct = 1
WHERE sa.exam_id = $1 AND sa.student_id = $2
ORDER BY q."order"
`;

// Get student assignments - month filter - 20 per page
const getStudentAssignments = `
SELECT 
  a.id AS assignment_id,
  a.title,
  a.description,
  a.file_path,
  a.full_mark,
  a.deadline,
  a.is_closed,
  asub.id AS submission_id,
  asub.submitted_at,
  asub.score AS submission_score,
  asub.feedback,
  CASE 
    WHEN asub.score IS NOT NULL THEN 'graded'
    WHEN asub.id IS NOT NULL THEN 'submitted'
    WHEN a.deadline < NOW() THEN 'overdue'
    ELSE 'pending'
  END AS assignment_status
FROM assignments a
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = $1
WHERE a.grade_id = (SELECT grade_id FROM students WHERE id = $1)
  AND a.deleted = 0
  AND ($2 = '' OR TO_CHAR(a.deadline, 'YYYY-MM') = $2)
ORDER BY a.deadline DESC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// Get student submissions - month filter - 20 per page
const getStudentSubmissions = `
SELECT 
  asub.id AS submission_id,
  asub.file_path,
  asub.score,
  asub.feedback,
  asub.submitted_at,
  asub.reviewed_at,
  a.title AS assignment_title,
  a.full_mark,
  a.deadline,
  CASE 
    WHEN asub.submitted_at <= a.deadline THEN 'on_time'
    ELSE 'late'
  END AS submission_timing
FROM assignment_submissions asub
JOIN assignments a ON asub.assignment_id = a.id
WHERE asub.student_id = $1
  AND ($2 = '' OR TO_CHAR(asub.submitted_at, 'YYYY-MM') = $2)
ORDER BY asub.submitted_at DESC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// ✅ Get student playlists - with correct thumbnail
const getStudentPlaylists = `
SELECT 
  p.id AS playlist_id,
  p.title,
  p.description,
  p.thumbnail_url,
  p.created_at,
  p.updated_at,
  (SELECT COUNT(*) FROM playlist_videos pv WHERE pv.playlist_id = p.id) AS videos_count
FROM playlists p
WHERE p.grade_id = (SELECT grade_id FROM students WHERE id = $1)
ORDER BY p.created_at DESC
`;

// Get videos in a specific playlist
const getPlaylistVideos = `
SELECT 
  v.id AS video_id,
  v.title,
  v.description,
  v.video_url,
  v.file_url,
  v.thumbnail_url,
  pv.added_at
FROM videos v
JOIN playlist_videos pv ON v.id = pv.video_id
WHERE pv.playlist_id = $1
ORDER BY pv.added_at ASC
`;

// Get specific paper exam details with rank
const getStudentPaperExamById = `
SELECT 
  e.id AS exam_id,
  e.title AS exam_title,
  e.exam_date,
  e.total_degree,
  er.degree AS student_degree,
  ROUND((er.degree::numeric / NULLIF(e.total_degree::numeric, 0)) * 100, 2) AS percentage,
  CASE 
    WHEN er.degree IS NOT NULL THEN 'attended'
    ELSE 'absent'
  END AS exam_status,
  (SELECT COUNT(*) FROM exam_results er2 WHERE er2.exam_id = e.id AND er2.degree >= er.degree) AS student_rank,
  (SELECT COUNT(*) FROM exam_results er3 WHERE er3.exam_id = e.id) AS total_students,
  (SELECT MAX(er4.degree) FROM exam_results er4 WHERE er4.exam_id = e.id) AS highest_degree
FROM exams e
LEFT JOIN exam_results er ON e.id = er.exam_id AND er.student_id = $1
WHERE e.id = $2 AND e.deleted = 0
`;

// Get specific online exam details with rank
const getStudentOnlineExamById = `
SELECT 
  se.id AS attempt_id,
  oe.title AS exam_title,
  oe.full_mark,
  se.score,
  ROUND((se.score::numeric / NULLIF(oe.full_mark::numeric, 0)) * 100, 2) AS percentage,
  se.started_at,
  se.submitted_at,
  ROUND(EXTRACT(EPOCH FROM (se.submitted_at - se.started_at)) / 60) AS duration_minutes,
  CASE 
    WHEN se.score IS NULL THEN 'pending'
    WHEN se.score >= (oe.full_mark * 0.5) THEN 'passed'
    ELSE 'failed'
  END AS result_status,
  (SELECT COUNT(*) FROM student_answers sa WHERE sa.exam_id = oe.id AND sa.student_id = $1) AS total_questions,
  (SELECT COUNT(*) FROM student_answers sa WHERE sa.exam_id = oe.id AND sa.student_id = $1 AND sa.is_correct = 1) AS correct_answers,
  (SELECT COUNT(*) FROM student_answers sa WHERE sa.exam_id = oe.id AND sa.student_id = $1 AND sa.is_correct = 0) AS wrong_answers,
  (SELECT COUNT(*) FROM student_exams se2 WHERE se2.exam_id = oe.id AND se2.score >= se.score) AS student_rank,
  (SELECT COUNT(*) FROM student_exams se3 WHERE se3.exam_id = oe.id AND se3.submitted_at IS NOT NULL) AS total_students,
  (SELECT MAX(se4.score) FROM student_exams se4 WHERE se4.exam_id = oe.id AND se4.submitted_at IS NOT NULL) AS highest_score
FROM student_exams se
JOIN online_exams oe ON se.exam_id = oe.id
WHERE se.student_id = $1 AND se.id = $2 AND se.submitted_at IS NOT NULL
`;

// Get specific assignment details
const getStudentAssignmentById = `
SELECT 
  a.id AS assignment_id,
  a.title,
  a.description,
  a.file_path,
  a.full_mark,
  a.deadline,
  a.is_closed,
  g.name AS grade_name,
  asub.id AS submission_id,
  asub.file_path AS submission_file,
  asub.score,
  asub.feedback,
  asub.submitted_at,
  asub.reviewed_at,
  CASE 
    WHEN asub.submitted_at <= a.deadline THEN 'on_time'
    ELSE 'late'
  END AS submission_timing,
  ROUND((asub.score::numeric / NULLIF(a.full_mark::numeric, 0)) * 100, 2) AS percentage
FROM assignments a
LEFT JOIN grades g ON a.grade_id = g.id
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = $1
WHERE a.id = $2 AND a.deleted = 0
`;

// Get specific submission details
const getStudentSubmissionById = `
SELECT 
  asub.id AS submission_id,
  asub.file_path,
  asub.score,
  asub.feedback,
  asub.submitted_at,
  asub.reviewed_at,
  a.title AS assignment_title,
  a.full_mark,
  a.deadline,
  g.name AS grade_name,
  CASE 
    WHEN asub.submitted_at <= a.deadline THEN 'on_time'
    ELSE 'late'
  END AS submission_timing,
  ROUND((asub.score::numeric / NULLIF(a.full_mark::numeric, 0)) * 100, 2) AS percentage
FROM assignment_submissions asub
JOIN assignments a ON asub.assignment_id = a.id
JOIN grades g ON a.grade_id = g.id
WHERE asub.id = $1 AND asub.student_id = $2
`;

// Get students without password
const getStudentsWithoutPassword = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.deleted = 0 AND s.password IS NULL
ORDER BY s.full_name ASC
`;

// Reset student password
const resetStudentPassword = `
UPDATE students 
SET password = $1, updated_at = NOW()
WHERE id = $2 AND deleted = 0
RETURNING id, barcode, full_name
`;

// Generate passwords for all students without password
const generatePasswordsForAllStudents = `
UPDATE students 
SET password = $1, updated_at = NOW()
WHERE id = $2 AND deleted = 0 AND password IS NULL
RETURNING id, barcode, full_name
`;

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByBarcode,
  findStudentByPhone,
  findStudentByParentPhone,
  getStudentsByGradeId,
  getStudentsByGroupId,
  getDeletedStudents,
  updateStudent,
  updateStudentProfileImage,
  deleteStudentProfileImage,
  getStudentProfileImage,
  updateStudentPassword,
  softDeleteStudent,
  hardDeleteStudent,
  restoreStudent,
  getStudentsCount,
  getStudentProfile,
  getStudentQuickStats,
  getAttendanceHistory,
  getMonthlyAttendanceStats,
  getStudentTotalAttendance,
  getConsecutiveAbsences,
  getPaymentHistory,
  getRemainingBalance,
  getCurrentSubscription,
  getStudentPaperExams,
  getStudentExamResults,
  getAvailableOnlineExams,
  getStudentOnlineExams,
  getStudentExamAnswers,
  getStudentAssignments,
  getStudentSubmissions,
  getStudentPlaylists,
  getPlaylistVideos,
  getStudentPaperExamById,
  getStudentOnlineExamById,
  getStudentAssignmentById,
  getStudentSubmissionById,
  getStudentsWithoutPassword,
  resetStudentPassword,
  generatePasswordsForAllStudents,
};
