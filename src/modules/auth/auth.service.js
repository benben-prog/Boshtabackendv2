const { query } = require("../../config/database");
const bcrypt = require("bcryptjs");

// ============================================
// STUDENT AUTHENTICATION
// ============================================

const studentAuth = async (credentials) => {
  const { phone, password } = credentials;

  // Get students by phone (only student's own phone, not parent's)
  const result = await query(
    `SELECT id, barcode, full_name, phone, password, grade_id, group_id, profile_image
     FROM students
     WHERE phone = $1
       AND deleted = 0
       AND password IS NOT NULL
     LIMIT 10`,
    [phone],
  );

  const students = result.rows;

  if (students.length === 0) {
    return null;
  }

  // Check password against each student
  for (const student of students) {
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (isPasswordValid) {
      return student;
    }
  }

  return null;
};

// ============================================
// USER AUTHENTICATION (assistant/teacher/super_admin)
// ============================================

const userAuth = async (credentials) => {
  const { phone, password } = credentials;

  const result = await query(
    `SELECT id, full_name, phone, password, role, permissions, profile_image
     FROM users
     WHERE phone = $1 AND is_active = 1 AND deleted = 0`,
    [phone],
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
};

// ============================================
// PARENT ACCESS (by token)
// ============================================

const parentAccess = async (token) => {
  const result = await query(
    `SELECT id, barcode, full_name, phone, grade_id, group_id
     FROM students 
     WHERE parent_token = $1 AND deleted = 0`,
    [token],
  );

  return result.rows[0] || null;
};

module.exports = {
  studentAuth,
  userAuth,
  parentAccess,
};
