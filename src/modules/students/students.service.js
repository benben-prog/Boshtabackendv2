const { query } = require("../../config/database");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const stdQr = require("./students.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");

// ============================================
// CONSTANTS
// ============================================

const BCRYPT_ROUNDS = 10;
const PASSWORD_SUFFIX = "@boshta.benb3n";
const PARENT_TOKEN_LENGTH = 10;
const PARENT_TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// ============================================
// HELPER: Generate unique parent token
// ============================================

const generateParentToken = () => {
  let token = "";
  for (let i = 0; i < PARENT_TOKEN_LENGTH; i++) {
    token += PARENT_TOKEN_CHARS.charAt(
      Math.floor(Math.random() * PARENT_TOKEN_CHARS.length),
    );
  }
  return token;
};

// ============================================
// PART 1: CRUD & SEARCH
// ============================================

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

  const student = result.rows[0];

  if (student) {
    try {
      const studentForWhatsapp = {
        id: student.id,
        full_name: student.full_name,
        barcode: student.barcode,
        phone: student.phone,
        parent_phone: student.parent_phone,
        parent_token: parent_token,
      };

      const welcomeMessage =
        whatsappDispatcher.generateWelcomeMessage(studentForWhatsapp);

      await whatsappDispatcher.enqueueForStudentAndParent(
        studentForWhatsapp,
        "welcome",
        { message: welcomeMessage },
      );
    } catch (error) {
      console.error("Error enqueueing welcome message:", error.message);
    }
  }

  return {
    ...student,
    parent_token,
  };
};

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

const getStudentsCount = async (filters = {}) => {
  const { search = "", grade_id = null, group_id = null } = filters;
  const result = await query(stdQr.getStudentsCount, [
    search,
    grade_id,
    group_id,
  ]);
  return result.rows[0];
};

const getStudentById = async (id) => {
  const result = await query(stdQr.getStudentById, [id]);
  return result.rows[0];
};

const getStudentByBarcode = async (barcode) => {
  const result = await query(stdQr.getStudentByBarcode, [barcode]);
  return result.rows[0];
};

const findStudentByPhone = async (phone) => {
  const result = await query(stdQr.findStudentByPhone, [phone]);
  return result.rows[0];
};

const findStudentByParentPhone = async (parentPhone) => {
  const result = await query(stdQr.findStudentByParentPhone, [parentPhone]);
  return result.rows;
};

const getStudentsByGradeId = async (gradeId, page = 1) => {
  const result = await query(stdQr.getStudentsByGradeId, [gradeId, page]);
  return result.rows;
};

const getStudentsByGroupId = async (groupId, page = 1) => {
  const result = await query(stdQr.getStudentsByGroupId, [groupId, page]);
  return result.rows;
};

const getDeletedStudents = async (page = 1) => {
  const result = await query(stdQr.getDeletedStudents, [page]);
  return result.rows;
};

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

const updateStudentProfileImage = async (id, profileImage) => {
  const result = await query(stdQr.updateStudentProfileImage, [
    profileImage,
    id,
  ]);
  return result.rows[0];
};

const deleteStudentProfileImage = async (id) => {
  const result = await query(stdQr.deleteStudentProfileImage, [id]);
  return result.rows[0];
};

const getStudentProfileImage = async (id) => {
  const result = await query(stdQr.getStudentProfileImage, [id]);
  return result.rows[0];
};

// ============================================
// UPDATE PASSWORD
// ============================================

const updateStudentPassword = async (id, oldPassword, newPassword) => {
  const studentResult = await query(stdQr.getStudentById, [id]);
  const student = studentResult.rows[0];

  if (!student) return null;

  // Check if student has a password
  if (!student.password) {
    throw new Error("لا يمكن تغيير كلمة المرور - تواصل مع الإدارة");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, student.password);
  if (!isPasswordValid) {
    throw new Error("كلمة المرور القديمة غير صحيحة");
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  const result = await query(stdQr.updateStudentPassword, [hashedPassword, id]);
  return result.rows[0];
};

// ============================================
// SOFT/HARD DELETE
// ============================================

const softDeleteStudent = async (id) => {
  const result = await query(stdQr.softDeleteStudent, [id]);
  return result.rows[0];
};

const hardDeleteStudent = async (id) => {
  const result = await query(stdQr.hardDeleteStudent, [id]);
  return result.rows[0];
};

const restoreStudent = async (id) => {
  const result = await query(stdQr.restoreStudent, [id]);
  return result.rows[0];
};

// ============================================
// PART 2: PROFILE & STATISTICS
// ============================================

const getStudentProfile = async (id) => {
  const result = await query(stdQr.getStudentProfile, [id]);
  return result.rows[0];
};

const getStudentQuickStats = async (id) => {
  const result = await query(stdQr.getStudentQuickStats, [id]);
  return result.rows[0];
};

const getAttendanceHistory = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getAttendanceHistory, [id, month, page]);
  return result.rows;
};

const getMonthlyAttendanceStats = async (id) => {
  const result = await query(stdQr.getMonthlyAttendanceStats, [id]);
  return result.rows;
};

const getStudentTotalAttendance = async (id, month) => {
  const result = await query(stdQr.getStudentTotalAttendance, [id, month]);
  return result.rows[0];
};

const getConsecutiveAbsences = async (id) => {
  const result = await query(stdQr.getConsecutiveAbsences, [id]);
  return result.rows[0];
};

const getPaymentHistory = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getPaymentHistory, [id, month, page]);
  return result.rows;
};

const getRemainingBalance = async (id) => {
  const result = await query(stdQr.getRemainingBalance, [id]);
  return result.rows[0];
};

const getCurrentSubscription = async (id) => {
  const result = await query(stdQr.getCurrentSubscription, [id]);
  return result.rows[0];
};

// ============================================
// PART 3: EXAMS, ASSIGNMENTS & CONTENT
// ============================================

const getStudentPaperExams = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentPaperExams, [id, month, page]);
  return result.rows;
};

const getStudentExamResults = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentExamResults, [id, page]);
  return result.rows;
};

const getAvailableOnlineExams = async (id, page = 1) => {
  const result = await query(stdQr.getAvailableOnlineExams, [id, page]);
  return result.rows;
};

const getStudentOnlineExams = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentOnlineExams, [id, month, page]);
  return result.rows;
};

const getStudentExamAnswers = async (examId, studentId) => {
  const result = await query(stdQr.getStudentExamAnswers, [examId, studentId]);
  return result.rows;
};

const getStudentAssignments = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentAssignments, [id, month, page]);
  return result.rows;
};

const getStudentSubmissions = async (id, month = "", page = 1) => {
  const result = await query(stdQr.getStudentSubmissions, [id, month, page]);
  return result.rows;
};

const getStudentPlaylists = async (id) => {
  const result = await query(stdQr.getStudentPlaylists, [id]);
  return result.rows;
};

const getPlaylistVideos = async (playlistId) => {
  const result = await query(stdQr.getPlaylistVideos, [playlistId]);
  return result.rows;
};

const getStudentPaperExamById = async (studentId, examId) => {
  const result = await query(stdQr.getStudentPaperExamById, [
    studentId,
    examId,
  ]);
  return result.rows[0];
};

const getStudentOnlineExamById = async (studentId, attemptId) => {
  const result = await query(stdQr.getStudentOnlineExamById, [
    studentId,
    attemptId,
  ]);
  return result.rows[0];
};

const getStudentAssignmentById = async (studentId, assignmentId) => {
  const result = await query(stdQr.getStudentAssignmentById, [
    studentId,
    assignmentId,
  ]);
  return result.rows[0];
};

const getStudentSubmissionById = async (submissionId, studentId) => {
  const result = await query(stdQr.getStudentSubmissionById, [
    submissionId,
    studentId,
  ]);
  return result.rows[0];
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================

const getStudentsWithoutPassword = async () => {
  const result = await query(stdQr.getStudentsWithoutPassword);
  return result.rows;
};

const resetStudentPassword = async (studentId, password) => {
  const student = await getStudentById(studentId);
  if (!student) return null;

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const result = await query(stdQr.resetStudentPassword, [
    hashedPassword,
    studentId,
  ]);

  return {
    ...result.rows[0],
    password: password, // Return plain password for admin to share
  };
};

// ============================================
// GENERATE PASSWORDS (OPTIMIZED - BATCH)
// ============================================

// Generate password for a student based on barcode, grade, group
const generatePasswordForStudent = (student) => {
  return `${student.barcode}${student.grade_id}${student.group_id}${PASSWORD_SUFFIX}`;
};

const generatePasswordsForAllStudents = async () => {
  const studentsResult = await query(stdQr.getStudentsWithoutPassword);
  const studentsWithoutPassword = studentsResult.rows;

  if (studentsWithoutPassword.length === 0) {
    return { generated_count: 0, passwords: [] };
  }

  // Hash all passwords in parallel
  const passwordData = await Promise.all(
    studentsWithoutPassword.map(async (student) => {
      const plainPassword = generatePasswordForStudent(student);
      const hashedPassword = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
      return {
        id: student.id,
        barcode: student.barcode,
        full_name: student.full_name,
        plain_password: plainPassword,
        hashed_password: hashedPassword,
      };
    }),
  );

  // Bulk update in one query
  const ids = passwordData.map((p) => p.id);
  const hashedPasswords = passwordData.map((p) => p.hashed_password);

  await query(stdQr.bulkUpdatePasswords, [ids, hashedPasswords]);

  return {
    generated_count: passwordData.length,
    passwords: passwordData.map((p) => ({
      student_id: p.id,
      barcode: p.barcode,
      full_name: p.full_name,
      password: p.plain_password,
    })),
  };
};

const generatePasswordsForGrade = async (gradeId) => {
  const studentsResult = await query(stdQr.getStudentsWithoutPasswordByGrade, [
    gradeId,
  ]);
  const studentsWithoutPassword = studentsResult.rows;

  if (studentsWithoutPassword.length === 0) {
    return { generated_count: 0, passwords: [] };
  }

  // Hash all passwords in parallel
  const passwordData = await Promise.all(
    studentsWithoutPassword.map(async (student) => {
      const plainPassword = generatePasswordForStudent(student);
      const hashedPassword = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
      return {
        id: student.id,
        barcode: student.barcode,
        full_name: student.full_name,
        plain_password: plainPassword,
        hashed_password: hashedPassword,
      };
    }),
  );

  // Bulk update in one query
  const ids = passwordData.map((p) => p.id);
  const hashedPasswords = passwordData.map((p) => p.hashed_password);

  await query(stdQr.bulkUpdatePasswords, [ids, hashedPasswords]);

  return {
    generated_count: passwordData.length,
    passwords: passwordData.map((p) => ({
      student_id: p.id,
      barcode: p.barcode,
      full_name: p.full_name,
      password: p.plain_password,
    })),
  };
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Part 1: CRUD & Search
  createStudent,
  getAllStudents,
  getStudentsCount,
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
  // Password Management
  getStudentsWithoutPassword,
  resetStudentPassword,
  generatePasswordsForAllStudents,
  generatePasswordsForGrade,
};
