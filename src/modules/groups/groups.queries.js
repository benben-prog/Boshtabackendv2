/* ============================================
   GROUPS QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createGroup = `
INSERT INTO groups (name, grade_id, days, start_time, end_time, room)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

// Get all groups (with optional filters)
const getAllGroups = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  gr.created_at,
  gr.updated_at,
  COUNT(s.id) AS students_count
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
WHERE gr.deleted = 0
  AND ($1::int IS NULL OR gr.grade_id = $1::int)
  AND ($2 = '' OR gr.name ILIKE $2)
GROUP BY gr.id, gr.name, gr.grade_id, g.name, gr.days, gr.start_time, gr.end_time, gr.room, gr.created_at, gr.updated_at
ORDER BY gr.name ASC
`;

// Get a single group by its ID
const getGroupById = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  gr.created_at,
  gr.updated_at
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
WHERE gr.id = $1 AND gr.deleted = 0
`;

// Find groups by name within a specific grade
const findGroupByName = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  gr.created_at,
  gr.updated_at
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
WHERE gr.name = $1 AND gr.grade_id = $2 AND gr.deleted = 0
`;

// Get all groups that belong to a specific grade
const getGroupsByGradeId = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  gr.created_at,
  gr.updated_at,
  COUNT(s.id) AS students_count
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
WHERE gr.grade_id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.grade_id, g.name, gr.days, gr.start_time, gr.end_time, gr.room, gr.created_at, gr.updated_at
ORDER BY gr.name ASC
`;

// ============================================
// UPDATE
// ============================================

const updateGroup = `
UPDATE groups 
SET 
  name = COALESCE($1, name), 
  days = COALESCE($2, days), 
  start_time = COALESCE($3, start_time), 
  end_time = COALESCE($4, end_time), 
  room = COALESCE($5, room), 
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $6 AND deleted = 0
RETURNING *
`;

// ============================================
// DELETE
// ============================================

const softDeleteGroup = `
UPDATE groups 
SET deleted = 1, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

const hardDeleteGroup = `
DELETE FROM groups 
WHERE id = $1
RETURNING *
`;

// ============================================
// STATISTICS
// ============================================

const getGroupStats = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 0 THEN s.id END) AS active_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id
WHERE gr.id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.grade_id, g.name
`;

const getAllGroupsStats = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 0 THEN s.id END) AS active_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id
WHERE gr.deleted = 0
GROUP BY gr.id, gr.name, gr.grade_id, g.name
ORDER BY gr.name ASC
`;

const getGroupsWithStudentsCount = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  COUNT(s.id) AS students_count
FROM groups gr
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
WHERE gr.deleted = 0
GROUP BY gr.id, gr.name, gr.grade_id
ORDER BY gr.name ASC
`;

const getGroupsWithGradeName = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
WHERE gr.deleted = 0
ORDER BY gr.name ASC
`;

// ============================================
// FULL STATS (OPTIMIZED - PARALLEL QUERIES)
// ============================================

const getGroupBasicStats = `
SELECT 
  gr.id,
  gr.name,
  gr.grade_id,
  g.name AS grade_name,
  gr.days,
  gr.start_time,
  gr.end_time,
  gr.room,
  gr.created_at,
  gr.updated_at,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 0 THEN s.id END) AS active_students,
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id
WHERE gr.id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.grade_id, g.name, gr.days, gr.start_time, gr.end_time, gr.room, gr.created_at, gr.updated_at
`;

const getGroupAttendanceStats = `
SELECT 
  ROUND(
    (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
    NULLIF(COUNT(a.id), 0)) * 100, 2
  ) AS attendance_percentage,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE s.group_id = $1 
  AND s.deleted = 0
  AND TO_CHAR(a.attendance_date, 'YYYY-MM') = TO_CHAR(NOW() AT TIME ZONE 'Africa/Cairo', 'YYYY-MM')
`;

const getGroupPaymentStats = `
SELECT 
  COALESCE(SUM(sub.required_amount), 0) AS total_required,
  COALESCE(SUM(paid.total_paid), 0) AS total_paid,
  COALESCE(SUM(sub.required_amount), 0) - COALESCE(SUM(paid.total_paid), 0) AS total_remaining,
  ROUND(
    (COALESCE(SUM(paid.total_paid), 0)::numeric / 
    NULLIF(COALESCE(SUM(sub.required_amount), 0), 0)) * 100, 2
  ) AS paid_percentage,
  COUNT(DISTINCT CASE WHEN COALESCE(paid.total_paid, 0) >= sub.required_amount THEN s.id END) AS fully_paid_students,
  COUNT(DISTINCT CASE WHEN COALESCE(paid.total_paid, 0) = 0 OR paid.total_paid IS NULL THEN s.id END) AS unpaid_students
FROM students s
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(NOW() AT TIME ZONE 'Africa/Cairo', 'YYYY-MM')
  AND sub.deleted = 0
LEFT JOIN LATERAL (
  SELECT COALESCE(SUM(p.amount), 0) AS total_paid
  FROM payments p
  WHERE p.student_id = s.id AND p.subscription_id = sub.id
) paid ON true
WHERE s.group_id = $1 AND s.deleted = 0
`;

const getGroupExamStats = `
SELECT 
  ROUND(AVG(er.degree)::numeric, 2) AS avg_exam_score,
  MAX(er.degree) AS highest_score,
  MIN(er.degree) AS lowest_score
FROM exam_results er
WHERE er.student_id IN (
  SELECT id FROM students WHERE group_id = $1 AND deleted = 0
)
`;

const getGroupStudentsList = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.phone,
  s.parent_phone,
  s.profile_image,
  s.grade_id,
  s.group_id,
  s.created_at,
  COALESCE(
    (SELECT sub.status FROM subscriptions sub 
     WHERE sub.student_id = s.id 
       AND sub.month = TO_CHAR(NOW() AT TIME ZONE 'Africa/Cairo', 'YYYY-MM')
       AND sub.deleted = 0
     LIMIT 1), 'unpaid'
  ) AS payment_status
FROM students s
WHERE s.group_id = $1 AND s.deleted = 0
ORDER BY s.full_name ASC
`;

// ============================================
// BULK OPERATIONS
// ============================================

const checkExistingGroups = `
SELECT name, grade_id FROM groups 
WHERE name = ANY($1) AND grade_id = ANY($2) AND deleted = 0
`;

const getGradesByNames = `
SELECT id, name FROM grades WHERE name = ANY($1) AND deleted = 0
`;

const bulkInsertGroups = `
INSERT INTO groups (name, grade_id, days, start_time, end_time, room)
SELECT unnest($1::text[]), unnest($2::int[]), unnest($3::text[]), 
       unnest($4::time[]), unnest($5::time[]), unnest($6::text[])
RETURNING id, name, grade_id
`;

module.exports = {
  // CRUD
  createGroup,
  getAllGroups,
  getGroupById,
  findGroupByName,
  getGroupsByGradeId,
  updateGroup,
  softDeleteGroup,
  hardDeleteGroup,
  // Statistics
  getGroupStats,
  getAllGroupsStats,
  getGroupsWithStudentsCount,
  getGroupsWithGradeName,
  // Full stats
  getGroupBasicStats,
  getGroupAttendanceStats,
  getGroupPaymentStats,
  getGroupExamStats,
  getGroupStudentsList,
  // Bulk operations
  checkExistingGroups,
  getGradesByNames,
  bulkInsertGroups,
};
