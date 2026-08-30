const { query } = require("../../config/database");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const stdQr = require("./students.queries");

// PART 1: CRUD & SEARCH OPERATIONS

const generateParentToken = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Create a new student
const createStudent = async (stdInfo) => {
  const { barcode, full_name, phone, parent_phone, grade_id, group_id, notes } =
    stdInfo;

  const parent_token = generateParentToken();

  const result = await query(stdQr.createStudent, [
    barcode,
    full_name,
    phone,
    parent_phone,
    parent_token,
    grade_id,
    group_id,
    notes,
  ]);

  return {
    ...result.rows[0],
    parent_token,
  };
};

// Get all students with filters
const getAllStudents = async (filters) => {
  const { search = "", grade_id = null, group_id = null, page = 1 } = filters;
  const result = await query(stdQr.getAllStudents, [
    search,
    grade_id,
    group_id,
    page,
  ]);
  return result.rows;
};

// Get a single student by ID
const getStudentById = async (id) => {
  const result = await query(stdQr.getStudentById, [id]);
  return result.rows[0];
};

// Get a student by barcode
const getStudentByBarcode = async (barcode) => {
  const result = await query(stdQr.getStudentByBarcode, [barcode]);
  return result.rows[0];
};

// Find a student by phone number
const findStudentByPhone = async (phone) => {
  const result = await query(stdQr.findStudentByPhone, [phone]);
  return result.rows[0];
};

// Find students by parent phone number
const findStudentByParentPhone = async (parentPhone) => {
  const result = await query(stdQr.findStudentByParentPhone, [parentPhone]);
  return result.rows;
};

// Get all students in a specific grade
const getStudentsByGradeId = async (gradeId, page = 1) => {
  const result = await query(stdQr.getStudentsByGradeId, [gradeId, page]);
  return result.rows;
};

// Get all students in a specific group
const getStudentsByGroupId = async (groupId, page = 1) => {
  const result = await query(stdQr.getStudentsByGroupId, [groupId, page]);
  return result.rows;
};

// Get all deleted students
const getDeletedStudents = async (page = 1) => {
  const result = await query(stdQr.getDeletedStudents, [page]);
  return result.rows;
};

// Update a student's full information
const updateStudent = async (id, stdInfo) => {
  const { barcode, full_name, phone, parent_phone, grade_id, group_id, notes } =
    stdInfo;
  const result = await query(stdQr.updateStudent, [
    barcode,
    full_name,
    phone,
    parent_phone,
    grade_id,
    group_id,
    notes,
    id,
  ]);
  return result.rows[0];
};

// Update student's profile image
const updateStudentProfileImage = async (id, profileImage) => {
  const result = await query(stdQr.updateStudentProfileImage, [
    profileImage,
    id,
  ]);
  return result.rows[0];
};

// Delete student's profile image
const deleteStudentProfileImage = async (id) => {
  const result = await query(stdQr.deleteStudentProfileImage, [id]);
  return result.rows[0];
};

// Get student's profile image
const getStudentProfileImage = async (id) => {
  const result = await query(stdQr.getStudentProfileImage, [id]);
  return result.rows[0];
};

// Update student's password
const updateStudentPassword = async (id, oldPassword, newPassword) => {
  const studentResult = await query(stdQr.getStudentById, [id]);
  const student = studentResult.rows[0];

  if (!student) return null;

  if (!student.password) {
    throw new Error("لا يمكن تغيير كلمة المرور - تواصل مع الإدارة");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, student.password);
  if (!isPasswordValid) {
    throw new Error("كلمة المرور القديمة غير صحيحة");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await query(stdQr.updateStudentPassword, [hashedPassword, id]);
  return result.rows[0];
};

// Soft delete a student
const softDeleteStudent = async (id) => {
  const result = await query(stdQr.softDeleteStudent, [id]);
  return result.rows[0];
};

// Hard delete a student
const hardDeleteStudent = async (id) => {
  const result = await query(stdQr.hardDeleteStudent, [id]);
  return result.rows[0];
};

// Restore a soft-deleted student
const restoreStudent = async (id) => {
  const result = await query(stdQr.restoreStudent, [id]);
  return result.rows[0];
};

// Get students count with filters
const getStudentsCount = async (filters = {}) => {
  const { search = "", grade_id = null, group_id = null } = filters;
  const result = await query(stdQr.getStudentsCount, [
    search,
    grade_id,
    group_id,
  ]);
  return result.rows[0];
};

// PART 2: PROFILE & STATISTICS

// Get student full profile
const getStudentProfile = async (id) => {
  const result = await query(stdQr.getStudentProfile, [id]);
  return result.rows[0];
};

// Get student quick stats
const getStudentQuickStats = async (id) => {
  const result = await query(stdQr.getStudentQuickStats, [id]);
  return result.rows[0];
};

// Get attendance history with month filter
const getAttendanceHistory = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getAttendanceHistory, [id, month, page]);
  return result.rows;
};

// Get monthly attendance stats
const getMonthlyAttendanceStats = async (id) => {
  const result = await query(stdQr.getMonthlyAttendanceStats, [id]);
  return result.rows;
};

// Get total attendance for a specific month
const getStudentTotalAttendance = async (id, month) => {
  const result = await query(stdQr.getStudentTotalAttendance, [id, month]);
  return result.rows[0];
};

// Get consecutive absences
const getConsecutiveAbsences = async (id) => {
  const result = await query(stdQr.getConsecutiveAbsences, [id]);
  return result.rows[0];
};

// Get payment history with month filter
const getPaymentHistory = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getPaymentHistory, [id, month, page]);
  return result.rows;
};

// Get remaining balance
const getRemainingBalance = async (id) => {
  const result = await query(stdQr.getRemainingBalance, [id]);
  return result.rows[0];
};

// Get current month subscription
const getCurrentSubscription = async (id) => {
  const result = await query(stdQr.getCurrentSubscription, [id]);
  return result.rows[0];
};

// PART 3: EXAMS, ASSIGNMENTS & CONTENT

// Get all paper exams with student status
const getStudentPaperExams = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentPaperExams, [id, month, page]);
  return result.rows;
};

// ✅ Get student exam results - combined (paper + online)
const getStudentExamResults = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentExamResults, [id, page]);
  return result.rows;
};

// Get available online exams
const getAvailableOnlineExams = async (id, page = 1) => {
  const result = await query(stdQr.getAvailableOnlineExams, [id, page]);
  return result.rows;
};

// Get student's submitted online exams
const getStudentOnlineExams = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentOnlineExams, [id, month, page]);
  return result.rows;
};

// Get student answers for a specific exam
const getStudentExamAnswers = async (examId, studentId) => {
  const result = await query(stdQr.getStudentExamAnswers, [examId, studentId]);
  return result.rows;
};

// Get student assignments
const getStudentAssignments = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentAssignments, [id, month, page]);
  return result.rows;
};

// Get student submissions
const getStudentSubmissions = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentSubmissions, [id, month, page]);
  return result.rows;
};

// ✅ Get student playlists - with correct thumbnail
const getStudentPlaylists = async (id) => {
  const result = await query(stdQr.getStudentPlaylists, [id]);
  return result.rows;
};

// Get videos in a playlist
const getPlaylistVideos = async (playlistId) => {
  const result = await query(stdQr.getPlaylistVideos, [playlistId]);
  return result.rows;
};

// Get specific paper exam details
const getStudentPaperExamById = async (studentId, examId) => {
  const result = await query(stdQr.getStudentPaperExamById, [
    studentId,
    examId,
  ]);
  return result.rows[0];
};

// Get specific online exam details
const getStudentOnlineExamById = async (studentId, attemptId) => {
  const result = await query(stdQr.getStudentOnlineExamById, [
    studentId,
    attemptId,
  ]);
  return result.rows[0];
};

// Get specific assignment details
const getStudentAssignmentById = async (studentId, assignmentId) => {
  const result = await query(stdQr.getStudentAssignmentById, [
    studentId,
    assignmentId,
  ]);
  return result.rows[0];
};

// Get specific submission details
const getStudentSubmissionById = async (submissionId, studentId) => {
  const result = await query(stdQr.getStudentSubmissionById, [
    submissionId,
    studentId,
  ]);
  return result.rows[0];
};

// Get students without password
const getStudentsWithoutPassword = async () => {
  const result = await query(stdQr.getStudentsWithoutPassword);
  return result.rows;
};

// Reset student password
const resetStudentPassword = async (studentId, password) => {
  const student = await getStudentById(studentId);
  if (!student) return null;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(stdQr.resetStudentPassword, [
    hashedPassword,
    studentId,
  ]);

  return {
    ...result.rows[0],
    password: password,
  };
};

// Generate passwords for all students without password
const generatePasswordsForAllStudents = async () => {
  const studentsWithoutPassword = await getStudentsWithoutPassword();

  if (studentsWithoutPassword.length === 0) {
    return { generated_count: 0, passwords: [] };
  }

  const generatedPasswords = [];

  for (const student of studentsWithoutPassword) {
    const password = `${student.barcode}${student.grade_id}${student.group_id}@boshta.benb3n`;

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(stdQr.resetStudentPassword, [hashedPassword, student.id]);

    generatedPasswords.push({
      student_id: student.id,
      barcode: student.barcode,
      full_name: student.full_name,
      password: password,
    });
  }

  return {
    generated_count: generatedPasswords.length,
    passwords: generatedPasswords,
  };
};

module.exports = {
  // Part 1: CRUD & Search
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
  // Part 2: Profile & Statistics
  getStudentProfile,
  getStudentQuickStats,
  getAttendanceHistory,
  getMonthlyAttendanceStats,
  getStudentTotalAttendance,
  getConsecutiveAbsences,
  getPaymentHistory,
  getRemainingBalance,
  getCurrentSubscription,
  // Part 3: Exams, Assignments & Content
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
