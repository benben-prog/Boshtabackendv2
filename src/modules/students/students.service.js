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
