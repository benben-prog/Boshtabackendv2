const { query } = require("../../config/database");
const assignmentSubmissionQueries = require("./assignment_submissions.queries");

const submitAssignment = async (assignmentId, studentId, filePath) => {
  const result = await query(assignmentSubmissionQueries.submitAssignment, [
    assignmentId,
    studentId,
    filePath,
  ]);
  
  // لو مفيش نتيجة - يعني الواجب مغلق أو منتهي أو مكرر
  if (!result.rows[0]) {
    return null;
  }
  
  return result.rows[0];
};

const updateSubmission = async (assignmentId, studentId, filePath) => {
  const result = await query(assignmentSubmissionQueries.updateSubmission, [
    filePath,
    assignmentId,
    studentId,
  ]);
  
  // لو مفيش نتيجة - يعني الواجب مغلق أو مصحح
  if (!result.rows[0]) {
    return null;
  }
  
  return result.rows[0];
};

const gradeSubmission = async (submissionId, score, feedback, reviewedBy) => {
  const result = await query(assignmentSubmissionQueries.gradeSubmission, [
    score,
    feedback,
    reviewedBy,
    submissionId,
  ]);
  return result.rows[0];
};

const getSubmissionsByAssignmentId = async (assignmentId, page = 1) => {
  const result = await query(
    assignmentSubmissionQueries.getSubmissionsByAssignmentId,
    [assignmentId, page],
  );
  return result.rows;
};

const getStudentSubmission = async (assignmentId, studentId) => {
  const result = await query(assignmentSubmissionQueries.getStudentSubmission, [
    assignmentId,
    studentId,
  ]);
  return result.rows[0];
};

const getSubmittedStudents = async (assignmentId, page = 1) => {
  const result = await query(assignmentSubmissionQueries.getSubmittedStudents, [
    assignmentId,
    page,
  ]);
  return result.rows;
};

const getNotSubmittedStudents = async (assignmentId, page = 1) => {
  const result = await query(
    assignmentSubmissionQueries.getNotSubmittedStudents,
    [assignmentId, page],
  );
  return result.rows;
};

const getAssignmentSubmissionStats = async (assignmentId) => {
  const result = await query(
    assignmentSubmissionQueries.getAssignmentSubmissionStats,
    [assignmentId],
  );
  return result.rows[0];
};

const getGradeAssignmentSubmissionStats = async (gradeId) => {
  const result = await query(
    assignmentSubmissionQueries.getGradeAssignmentSubmissionStats,
    [gradeId],
  );
  return result.rows;
};

const getGroupAssignmentSubmissionStats = async (groupId) => {
  const result = await query(
    assignmentSubmissionQueries.getGroupAssignmentSubmissionStats,
    [groupId],
  );
  return result.rows;
};

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
