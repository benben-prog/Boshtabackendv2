/* ============================================
   ATTENDANCE QUERIES (FIXED VERSION)
   ============================================ */

// ============================================
// SESSION MANAGEMENT QUERIES
// ============================================

// Check if session exists for group on a specific date
const checkSessionExistsForGroupOnDate = `
SELECT id, status, started_at, lock_at, ended_at, attendance_locked
FROM attendance_sessions
WHERE group_id = $1 
  AND DATE(started_at AT TIME ZONE 'Africa/Cairo') = DATE(NOW() AT TIME ZONE 'Africa/Cairo')
`;

// Get default lock minutes from settings
const getDefaultLockMinutes = `
SELECT default_lock_minutes FROM settings WHERE id = 1
`;

// Create new session - lock_at is calculated in application code
const startSession = `
INSERT INTO attendance_sessions 
  (group_id, grade_id, started_by, lock_at, is_makeup_enabled, attendance_locked, status)
VALUES 
  ($1, $2, $3, $4, 0, 0, 'active')
RETURNING 
  id,
  group_id,
  grade_id,
  started_by,
  started_at,
  lock_at,
  is_makeup_enabled,
  attendance_locked,
  status,
  ended_at
`;

// Get active session for group (today)
const getActiveSessionByGroup = `
SELECT 
  s.id,
  s.group_id,
  g.name AS group_name,
  s.grade_id,
  gr.name AS grade_name,
  s.started_at,
  s.lock_at,
  s.is_makeup_enabled,
  s.attendance_locked,
  s.status,
  s.ended_at,
  u.full_name AS started_by_name
FROM attendance_sessions s
LEFT JOIN groups g ON s.group_id = g.id
LEFT JOIN grades gr ON s.grade_id = gr.id
LEFT JOIN users u ON s.started_by = u.id
WHERE s.group_id = $1 
  AND s.status = 'active'
  AND DATE(s.started_at AT TIME ZONE 'Africa/Cairo') = DATE(NOW() AT TIME ZONE 'Africa/Cairo')
ORDER BY s.started_at DESC
LIMIT 1
`;

// Get session by ID
const getSessionById = `
SELECT 
  s.id,
  s.group_id,
  g.name AS group_name,
  s.grade_id,
  gr.name AS grade_name,
  s.started_at,
  s.lock_at,
  s.is_makeup_enabled,
  s.attendance_locked,
  s.status,
  s.ended_at,
  u.full_name AS started_by_name
FROM attendance_sessions s
LEFT JOIN groups g ON s.group_id = g.id
LEFT JOIN grades gr ON s.grade_id = gr.id
LEFT JOIN users u ON s.started_by = u.id
WHERE s.id = $1
`;

// Lock attendance recording (mark rest absent, keep session active)
const lockAttendanceRecording = `
UPDATE attendance_sessions
SET attendance_locked = 1
WHERE id = $1 AND status = 'active' AND attendance_locked = 0
RETURNING *
`;

// Close session (final lock)
const closeSession = `
UPDATE attendance_sessions
SET status = 'locked', ended_at = NOW() AT TIME ZONE 'Africa/Cairo', attendance_locked = 1
WHERE id = $1 AND status = 'active'
RETURNING *
`;

// Toggle makeup mode - only if session not locked
const toggleMakeupMode = `
UPDATE attendance_sessions
SET is_makeup_enabled = CASE WHEN is_makeup_enabled = 1 THEN 0 ELSE 1 END
WHERE id = $1 AND status = 'active' AND attendance_locked = 0
RETURNING *
`;

// Validate that group belongs to grade
const validateGroupBelongsToGrade = `
SELECT g.id AS group_id, g.grade_id, gr.name AS grade_name
FROM groups g
JOIN grades gr ON g.grade_id = gr.id
WHERE g.id = $1 AND g.deleted = 0 AND gr.deleted = 0
`;

// ============================================
// ATTENDANCE RECORDING QUERIES
// ============================================

// Create or update attendance record (Upsert)
const createAttendance = `
INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method, is_makeup, makeup_group_id, notes)
VALUES ($1, $2, $3, $4, $5, NOW() AT TIME ZONE 'Africa/Cairo', $6, $7, $8, $9)
ON CONFLICT (student_id, attendance_date) 
DO UPDATE SET 
  group_id = EXCLUDED.group_id,
  grade_id = EXCLUDED.grade_id,
  status = EXCLUDED.status,
  attendance_time = EXCLUDED.attendance_time,
  method = EXCLUDED.method,
  is_makeup = EXCLUDED.is_makeup,
  makeup_group_id = EXCLUDED.makeup_group_id,
  notes = EXCLUDED.notes
RETURNING *
`;

// Get attendance by group and date
const getAttendanceByGroupAndDate = `
SELECT 
  a.id,
  a.student_id,
  s.full_name,
  s.barcode,
  a.status,
  a.attendance_time,
  a.method,
  a.is_makeup,
  a.makeup_group_id,
  a.notes
FROM attendance a
JOIN students s ON a.student_id = s.id AND s.deleted = 0
WHERE a.group_id = $1 AND a.attendance_date = $2
ORDER BY s.full_name ASC
`;

// Get attendance by group and month - 20 per page
const getAttendanceByGroupAndMonth = `
SELECT 
  a.id,
  a.student_id,
  s.full_name,
  a.attendance_date,
  a.status,
  a.attendance_time,
  a.method,
  a.is_makeup
FROM attendance a
JOIN students s ON a.student_id = s.id AND s.deleted = 0
WHERE a.group_id = $1 
  AND TO_CHAR(a.attendance_date, 'YYYY-MM') = $2
ORDER BY a.attendance_date DESC, s.full_name ASC
LIMIT 20 OFFSET (($3::int - 1) * 20)
`;

// Get attendance summary for a group on a date
const getAttendanceSummary = `
SELECT 
  (SELECT COUNT(*) FROM students WHERE group_id = $1 AND deleted = 0) AS total_students,
  (SELECT COUNT(*) FROM attendance WHERE group_id = $1 AND attendance_date = $2 AND status = 'present') AS present_count,
  (SELECT COUNT(*) FROM attendance WHERE group_id = $1 AND attendance_date = $2 AND status = 'absent') AS absent_count,
  (SELECT COUNT(*) FROM students s 
   WHERE s.group_id = $1 AND s.deleted = 0 
     AND NOT EXISTS (
       SELECT 1 FROM attendance a 
       WHERE a.student_id = s.id AND a.attendance_date = $2
     )) AS not_marked_count,
  $2::date AS attendance_date
`;

// Mark all unmarked students as absent for a group on a date
const markRestAbsent = `
INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method)
SELECT 
  s.id,
  s.group_id,
  s.grade_id,
  $2::date,
  'absent',
  NOW() AT TIME ZONE 'Africa/Cairo',
  'manual'
FROM students s
WHERE s.group_id = $1 
  AND s.deleted = 0
  AND NOT EXISTS (
    SELECT 1 FROM attendance a
    WHERE a.student_id = s.id AND a.attendance_date = $2::date
  )
RETURNING *
`;

// ============================================
// ATTENDANCE RECORD QUERIES (CRUD)
// ============================================

// Get attendance by ID
const getAttendanceById = `
SELECT 
  a.id,
  a.student_id,
  s.full_name,
  a.group_id,
  gr.name AS group_name,
  a.grade_id,
  a.attendance_date,
  a.status,
  a.attendance_time,
  a.method,
  a.is_makeup,
  a.makeup_group_id,
  a.notes
FROM attendance a
JOIN students s ON a.student_id = s.id
LEFT JOIN groups gr ON a.group_id = gr.id
WHERE a.id = $1
`;

// Update attendance record - attendance_time uses NOW() if not provided
const updateAttendance = `
UPDATE attendance
SET 
  status = $1,
  attendance_time = COALESCE($2, NOW() AT TIME ZONE 'Africa/Cairo'),
  method = $3,
  is_makeup = $4,
  makeup_group_id = $5,
  notes = $6
WHERE id = $7
RETURNING *
`;

// Delete attendance record
const deleteAttendance = `
DELETE FROM attendance
WHERE id = $1
RETURNING *
`;

// ============================================
// BARCODE SCAN QUERIES
// ============================================

// Check student by barcode
const checkStudentByBarcode = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name,
  s.profile_image
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.barcode = $1 AND s.deleted = 0
`;

// Check if student already attended today
const checkExistingAttendance = `
SELECT id, status, is_makeup
FROM attendance
WHERE student_id = $1 
  AND attendance_date = DATE(NOW() AT TIME ZONE 'Africa/Cairo')
`;

// Record attendance with session - uses ON CONFLICT to prevent race condition
const recordAttendanceWithSession = `
INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method, is_makeup, makeup_group_id)
VALUES ($1, $2, $3, DATE(NOW() AT TIME ZONE 'Africa/Cairo'), 'present', NOW() AT TIME ZONE 'Africa/Cairo', 'barcode', $4, $5)
ON CONFLICT (student_id, attendance_date) DO NOTHING
RETURNING *
`;

// ============================================
// STATISTICS QUERIES
// ============================================

// Get grade attendance stats
const getGradeAttendanceStats = `
SELECT 
  TO_CHAR(a.attendance_date, 'YYYY-MM') AS month,
  COUNT(DISTINCT a.attendance_date) AS total_days,
  COUNT(a.id) AS total_records,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count,
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage
FROM attendance a
JOIN students s ON a.student_id = s.id AND s.deleted = 0
WHERE s.grade_id = $1
GROUP BY TO_CHAR(a.attendance_date, 'YYYY-MM')
ORDER BY month DESC
`;

// Get overall attendance stats
const getOverallAttendanceStats = `
SELECT 
  TO_CHAR(a.attendance_date, 'YYYY-MM') AS month,
  COUNT(DISTINCT a.attendance_date) AS total_days,
  COUNT(a.id) AS total_records,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count,
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage
FROM attendance a
GROUP BY TO_CHAR(a.attendance_date, 'YYYY-MM')
ORDER BY month DESC
`;

// ============================================
// CONSECUTIVE ABSENCES QUERIES
// ============================================

// Get students with 3+ consecutive absences (last 3 records within same group)
const getStudentsWithThreeConsecutiveAbsences = `
WITH ranked_attendance AS (
  SELECT 
    a.student_id,
    a.group_id,
    a.attendance_date,
    a.status,
    ROW_NUMBER() OVER (
      PARTITION BY a.student_id 
      ORDER BY a.attendance_date DESC
    ) AS rn
  FROM attendance a
),
last_three AS (
  SELECT 
    student_id,
    group_id,
    COUNT(*) AS total_days,
    COUNT(CASE WHEN status = 'absent' THEN 1 END) AS absent_count
  FROM ranked_attendance
  WHERE rn <= 3
  GROUP BY student_id, group_id
)
SELECT 
  s.id,
  s.full_name,
  s.barcode,
  s.parent_phone,
  s.grade_id,
  g.name AS grade_name,
  s.group_id,
  gr.name AS group_name,
  lt.absent_count AS consecutive_absences
FROM last_three lt
JOIN students s ON lt.student_id = s.id AND s.deleted = 0
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE lt.total_days = 3 
  AND lt.absent_count = 3
  AND s.group_id = lt.group_id
`;

// ============================================
// DASHBOARD - takes group_id parameter
// ============================================

const getDashboard = `
SELECT 
  (SELECT COUNT(*) FROM students WHERE group_id = $1 AND deleted = 0) AS total_students,
  (SELECT COUNT(*) FROM attendance 
   WHERE group_id = $1 
     AND attendance_date = DATE(NOW() AT TIME ZONE 'Africa/Cairo') 
     AND status = 'present') AS present_today,
  (SELECT COUNT(*) FROM attendance 
   WHERE group_id = $1 
     AND attendance_date = DATE(NOW() AT TIME ZONE 'Africa/Cairo') 
     AND status = 'absent') AS absent_today,
  (SELECT COUNT(*) FROM students s 
   WHERE s.group_id = $1 
     AND s.deleted = 0 
     AND NOT EXISTS (
       SELECT 1 FROM attendance a 
       WHERE a.student_id = s.id 
         AND a.attendance_date = DATE(NOW() AT TIME ZONE 'Africa/Cairo')
     )) AS not_marked_today
`;

// ============================================
// SOFT DELETE QUERIES
// ============================================

// Soft delete student
const softDeleteStudent = `
UPDATE students 
SET deleted = 1, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = ANY($1) AND deleted = 0
RETURNING id, barcode, full_name
`;

module.exports = {
  // Session management
  checkSessionExistsForGroupOnDate,
  getDefaultLockMinutes,
  startSession,
  getActiveSessionByGroup,
  getSessionById,
  lockAttendanceRecording,
  closeSession,
  toggleMakeupMode,
  validateGroupBelongsToGrade,
  // Attendance recording
  createAttendance,
  getAttendanceByGroupAndDate,
  getAttendanceByGroupAndMonth,
  getAttendanceSummary,
  markRestAbsent,
  // CRUD
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  // Barcode
  checkStudentByBarcode,
  checkExistingAttendance,
  recordAttendanceWithSession,
  // Statistics
  getGradeAttendanceStats,
  getOverallAttendanceStats,
  getStudentsWithThreeConsecutiveAbsences,
  getDashboard,
  // Soft delete
  softDeleteStudent,
};
