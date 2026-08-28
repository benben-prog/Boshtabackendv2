// Create a new group
const createGroup = `
INSERT INTO groups (name, grade_id, days, start_time, end_time, room)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

// Get all groups that are not deleted
const getAllGroups = `
SELECT 
  id,
  name,
  grade_id,
  days,
  start_time,
  end_time,
  room,
  created_at,
  updated_at
FROM groups
WHERE deleted = 0
ORDER BY name ASC
`;

// Get a single group by its ID
const getGroupById = `
SELECT 
  id,
  name,
  grade_id,
  days,
  start_time,
  end_time,
  room,
  created_at,
  updated_at
FROM groups
WHERE id = $1 AND deleted = 0
`;

// Find groups by name within a specific grade
const findGroupByName = `
SELECT 
  id,
  name,
  grade_id,
  days,
  start_time,
  end_time,
  room,
  created_at,
  updated_at
FROM groups
WHERE name = $1 AND grade_id = $2 AND deleted = 0
`;

// Get all groups that belong to a specific grade
const getGroupsByGradeId = `
SELECT 
  id,
  name,
  grade_id,
  days,
  start_time,
  end_time,
  room,
  created_at,
  updated_at
FROM groups
WHERE grade_id = $1 AND deleted = 0
ORDER BY name ASC
`;

// Update a group's information
const updateGroup = `
UPDATE groups 
SET name = $1, days = $2, start_time = $3, end_time = $4, room = $5, updated_at = NOW()
WHERE id = $6 AND deleted = 0
RETURNING *
`;

// Soft delete a group (set deleted = 1)
const softDeleteGroup = `
UPDATE groups 
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Hard delete a group permanently
const hardDeleteGroup = `
DELETE FROM groups 
WHERE id = $1
RETURNING *
`;

// Get statistics for a single group (total, active, deleted students)
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

// Get statistics for all groups (total, active, deleted students)
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

// Get all groups with their students count
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

// Get all groups with their grade name
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

// Get group full stats
const getGroupFullStats = `
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
  COUNT(DISTINCT CASE WHEN s.deleted = 1 THEN s.id END) AS deleted_students,
  COALESCE(att.attendance_percentage, 0) AS attendance_percentage,
  COALESCE(att.present_days, 0) AS present_days,
  COALESCE(att.absent_days, 0) AS absent_days,
  COALESCE(pay.total_required, 0) AS total_required,
  COALESCE(pay.total_paid, 0) AS total_paid,
  COALESCE(pay.total_remaining, 0) AS total_remaining,
  COALESCE(pay.paid_percentage, 0) AS paid_percentage,
  COALESCE(pay.fully_paid_students, 0) AS fully_paid_students,
  COALESCE(pay.unpaid_students, 0) AS unpaid_students,
  COALESCE(exam.avg_score, 0) AS avg_exam_score,
  COALESCE(exam.highest_score, 0) AS highest_score,
  COALESCE(exam.lowest_score, 0) AS lowest_score
FROM groups gr
LEFT JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id
LEFT JOIN LATERAL (
  SELECT 
    ROUND(
      (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / 
      NULLIF(COUNT(a.id), 0)) * 100, 2
    ) AS attendance_percentage,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days
  FROM attendance a
  WHERE a.student_id IN (
    SELECT id FROM students WHERE group_id = gr.id AND deleted = 0
  )
  AND TO_CHAR(a.attendance_date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
) att ON true
LEFT JOIN LATERAL (
  SELECT 
    COALESCE(SUM(sub.required_amount), 0) AS total_required,
    COALESCE(SUM(paid.total_paid), 0) AS total_paid,
    COALESCE(SUM(sub.required_amount), 0) - COALESCE(SUM(paid.total_paid), 0) AS total_remaining,
    ROUND(
      (COALESCE(SUM(paid.total_paid), 0)::numeric / 
      NULLIF(COALESCE(SUM(sub.required_amount), 0), 0)) * 100, 2
    ) AS paid_percentage,
    COUNT(DISTINCT CASE WHEN COALESCE(paid.total_paid, 0) >= sub.required_amount THEN s2.id END) AS fully_paid_students,
    COUNT(DISTINCT CASE WHEN COALESCE(paid.total_paid, 0) = 0 OR paid.total_paid IS NULL THEN s2.id END) AS unpaid_students
  FROM students s2
  LEFT JOIN subscriptions sub ON s2.id = sub.student_id 
    AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    AND sub.deleted = 0
  LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(p.amount), 0) AS total_paid
    FROM payments p
    WHERE p.student_id = s2.id 
      AND p.subscription_id = sub.id
  ) paid ON true
  WHERE s2.group_id = gr.id AND s2.deleted = 0
) pay ON true
LEFT JOIN LATERAL (
  SELECT 
    ROUND(AVG(er.degree)::numeric, 2) AS avg_score,
    MAX(er.degree) AS highest_score,
    MIN(er.degree) AS lowest_score
  FROM exam_results er
  WHERE er.student_id IN (
    SELECT id FROM students WHERE group_id = gr.id AND deleted = 0
  )
) exam ON true
WHERE gr.id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, gr.grade_id, g.name, gr.days, gr.start_time, gr.end_time, gr.room, gr.created_at, gr.updated_at,
  att.attendance_percentage, att.present_days, att.absent_days,
  pay.total_required, pay.total_paid, pay.total_remaining, pay.paid_percentage, pay.fully_paid_students, pay.unpaid_students,
  exam.avg_score, exam.highest_score, exam.lowest_score
`;

// Get group students list
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
       AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
       AND sub.deleted = 0
     LIMIT 1), 'unpaid'
  ) AS payment_status
FROM students s
WHERE s.group_id = $1 AND s.deleted = 0
ORDER BY s.full_name ASC
`;


module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  findGroupByName,
  getGroupsByGradeId,
  updateGroup,
  softDeleteGroup,
  hardDeleteGroup,
  getGroupStats,
  getAllGroupsStats,
  getGroupsWithStudentsCount,
  getGroupsWithGradeName,
  getGroupFullStats,
  getGroupStudentsList,
};
