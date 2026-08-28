/* ============================================
   ASSIGNMENT SUBMISSIONS QUERIES
   ============================================ */

// Submit a new assignment (student)
const submitAssignment = `
INSERT INTO assignment_submissions (assignment_id, student_id, file_path)
VALUES ($1, $2, $3)
RETURNING *
`;

// Update submission file before deadline (student)
const updateSubmission = `
UPDATE assignment_submissions asub
SET file_path = $1, updated_at = NOW(), score = NULL, feedback = NULL
FROM assignments a
WHERE asub.assignment_id = a.id
  AND asub.assignment_id = $2 
  AND asub.student_id = $3 
  AND asub.score IS NULL
  AND a.deadline > NOW()
  AND a.is_closed = 0
RETURNING asub.*
`;

// Grade a submission (teacher/assistant - once only)
const gradeSubmission = `
UPDATE assignment_submissions
SET score = $1, feedback = $2, reviewed_by = $3, reviewed_at = NOW()
WHERE id = $4 AND score IS NULL
RETURNING *
`;

// Get all submissions for a specific assignment - 20 per page
const getSubmissionsByAssignmentId = `
SELECT 
  asub.id,
  asub.student_id,
  s.full_name,
  s.barcode,
  asub.file_path,
  asub.score,
  asub.feedback,
  asub.submitted_at,
  asub.updated_at,
  asub.reviewed_at,
  asub.reviewed_by
FROM assignment_submissions asub
JOIN students s ON asub.student_id = s.id AND s.deleted = 0
WHERE asub.assignment_id = $1
ORDER BY asub.submitted_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get a specific student's submission for an assignment
const getStudentSubmission = `
SELECT 
  asub.id,
  asub.student_id,
  s.full_name,
  asub.file_path,
  asub.score,
  asub.feedback,
  asub.submitted_at,
  asub.updated_at,
  asub.reviewed_at,
  asub.reviewed_by
FROM assignment_submissions asub
JOIN students s ON asub.student_id = s.id AND s.deleted = 0
WHERE asub.assignment_id = $1 AND asub.student_id = $2
`;

// Get students who submitted an assignment
const getSubmittedStudents = `
SELECT 
  s.id,
  s.full_name,
  s.barcode,
  asub.id AS submission_id,
  asub.file_path,
  asub.score,
  asub.submitted_at,
  asub.reviewed_at
FROM assignment_submissions asub
JOIN students s ON asub.student_id = s.id AND s.deleted = 0
WHERE asub.assignment_id = $1
ORDER BY asub.submitted_at ASC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get students who have not submitted an assignment
const getNotSubmittedStudents = `
SELECT 
  s.id,
  s.full_name,
  s.barcode
FROM students s
WHERE s.grade_id = (SELECT grade_id FROM assignments WHERE id = $1)
  AND s.deleted = 0
  AND s.id NOT IN (
    SELECT student_id FROM assignment_submissions WHERE assignment_id = $1
  )
ORDER BY s.full_name ASC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Get assignment submission statistics
const getAssignmentSubmissionStats = `
SELECT 
  a.id,
  a.title,
  a.full_mark,
  a.deadline,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(asub.id) AS submitted_count,
  COUNT(DISTINCT s.id) - COUNT(asub.id) AS not_submitted_count,
  ROUND(AVG(asub.score)::numeric, 2) AS average_score,
  MAX(asub.score) AS highest_score,
  MIN(asub.score) AS lowest_score
FROM assignments a
JOIN students s ON a.grade_id = s.grade_id AND s.deleted = 0
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.id
WHERE a.id = $1 AND a.deleted = 0
GROUP BY a.id, a.title, a.full_mark, a.deadline
`;

// Get grade assignment submissions statistics
const getGradeAssignmentSubmissionStats = `
SELECT 
  a.id,
  a.title,
  a.full_mark,
  a.deadline,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(asub.id) AS submitted_count,
  COUNT(DISTINCT s.id) - COUNT(asub.id) AS not_submitted_count,
  ROUND(AVG(asub.score)::numeric, 2) AS average_score
FROM assignments a
LEFT JOIN students s ON a.grade_id = s.grade_id AND s.deleted = 0
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.id
WHERE a.grade_id = $1 AND a.deleted = 0
GROUP BY a.id, a.title, a.full_mark, a.deadline
ORDER BY a.deadline DESC
`;

// Get group assignment submissions statistics
const getGroupAssignmentSubmissionStats = `
SELECT 
  a.id,
  a.title,
  a.full_mark,
  a.deadline,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(asub.id) AS submitted_count,
  COUNT(DISTINCT s.id) - COUNT(asub.id) AS not_submitted_count,
  ROUND(AVG(asub.score)::numeric, 2) AS average_score
FROM assignments a
LEFT JOIN students s ON a.group_id = s.group_id AND s.deleted = 0
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.id
WHERE a.group_id = $1 AND a.deleted = 0
GROUP BY a.id, a.title, a.full_mark, a.deadline
ORDER BY a.deadline DESC
`;

module.exports = {
  submitAssignment,
  updateSubmission,
  gradeSubmission,
  getSubmissionsByAssignmentId,
  getStudentSubmission,
  getSubmittedStudents,
  getNotSubmittedStudents,
  getAssignmentSubmissionStats,
  getGradeAssignmentSubmissionStats,
  getGroupAssignmentSubmissionStats,
};
