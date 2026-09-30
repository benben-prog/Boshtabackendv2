const { query } = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

// ============================================
// STUDENT AUTHENTICATION
// ============================================

const studentAuth = async (credentials) => {
  const { phone, password } = credentials;

  // Get students by phone (including deleted/inactive to return descriptive error)
  const result = await query(
    `SELECT id, barcode, full_name, phone, password, grade_id, group_id, profile_image, deleted, is_active, deactivation_reason
     FROM students
     WHERE phone = $1
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
      if (student.deleted === 1 || student.is_active === false) {
        const reason = student.deactivation_reason ? ` (${student.deactivation_reason})` : "";
        const error = new Error(`الحساب غير مفعل أو تم حذفه من قِبل إدارة السنتر${reason}. يرجى مراجعة إدارة السنتر.`);
        error.statusCode = 403;
        error.code = "ACCOUNT_DEACTIVATED";
        throw error;
      }
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

// ============================================
// STUDENT FIRST-TIME ACCOUNT ACTIVATION
// ============================================

const verifyStudentActivation = async ({ barcode, parent_phone }) => {
  const result = await query(
    `SELECT s.id, s.barcode, s.full_name, s.phone, s.parent_phone, s.password, s.grade_id, s.group_id,
            s.deleted, s.is_active, s.deactivation_reason,
            g.name AS grade_name, gr.name AS group_name
     FROM students s
     LEFT JOIN grades g ON s.grade_id = g.id
     LEFT JOIN groups gr ON s.group_id = gr.id
     WHERE s.barcode = $1 AND s.parent_phone = $2
     LIMIT 1`,
    [barcode, parent_phone],
  );

  const student = result.rows[0];

  if (!student) {
    const error = new Error(
      "بيانات الاعتماد غير متطابقة. يرجى التأكد من مسح الباركود بشكل صحيح وكتابة رقم هاتف ولي الأمر المسجل في السنتر.",
    );
    error.statusCode = 404;
    error.code = "STUDENT_NOT_FOUND";
    throw error;
  }

  if (student.deleted === 1 || student.is_active === false) {
    const reason = student.deactivation_reason
      ? ` (${student.deactivation_reason})`
      : "";
    const error = new Error(
      `حساب الطالب غير مفعل${reason}. يرجى مراجعة إدارة السنتر أولاً.`,
    );
    error.statusCode = 403;
    error.code = "ACCOUNT_DEACTIVATED";
    throw error;
  }

  if (student.password !== null) {
    const error = new Error(
      "تم تفعيل هذا الحساب من قبل. يرجى تسجيل الدخول مباشرة برقم هاتفك وكلمة المرور الخاصة بك.",
    );
    error.statusCode = 409;
    error.code = "ACCOUNT_ALREADY_ACTIVATED";
    error.is_already_activated = true;
    throw error;
  }

  // Generate a temporary activation token valid for 15 minutes
  const activation_token = jwt.sign(
    {
      id: student.id,
      barcode: student.barcode,
      type: "student_activation",
    },
    env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  return {
    student: {
      id: student.id,
      barcode: student.barcode,
      full_name: student.full_name,
      phone: student.phone,
      grade_name: student.grade_name,
      group_name: student.group_name,
    },
    activation_token,
  };
};

const completeStudentActivation = async ({
  activation_token,
  barcode,
  parent_phone,
  password,
}) => {
  let studentId = null;

  if (activation_token) {
    try {
      const decoded = jwt.verify(activation_token, env.JWT_SECRET);
      if (decoded.type !== "student_activation") {
        const error = new Error("رمز التفعيل غير صالح");
        error.statusCode = 400;
        throw error;
      }
      studentId = decoded.id;
    } catch (err) {
      const error = new Error(
        "انتهت صلاحية جلسة التفعيل أو أن الرمز غير صالح. يرجى إعادة مسح الكارت.",
      );
      error.statusCode = 401;
      throw error;
    }
  }

  let student;
  if (studentId) {
    const res = await query(
      `SELECT s.id, s.barcode, s.full_name, s.phone, s.password, s.grade_id, s.group_id, s.deleted, s.is_active, s.deactivation_reason,
              g.name AS grade_name, gr.name AS group_name
       FROM students s
       LEFT JOIN grades g ON s.grade_id = g.id
       LEFT JOIN groups gr ON s.group_id = gr.id
       WHERE s.id = $1`,
      [studentId],
    );
    student = res.rows[0];
  } else if (barcode && parent_phone) {
    const res = await query(
      `SELECT s.id, s.barcode, s.full_name, s.phone, s.password, s.grade_id, s.group_id, s.deleted, s.is_active, s.deactivation_reason,
              g.name AS grade_name, gr.name AS group_name
       FROM students s
       LEFT JOIN grades g ON s.grade_id = g.id
       LEFT JOIN groups gr ON s.group_id = gr.id
       WHERE s.barcode = $1 AND s.parent_phone = $2`,
      [barcode, parent_phone],
    );
    student = res.rows[0];
  }

  if (!student) {
    const error = new Error("الطالب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  if (student.deleted === 1 || student.is_active === false) {
    const reason = student.deactivation_reason
      ? ` (${student.deactivation_reason})`
      : "";
    const error = new Error(
      `حساب الطالب غير مفعل${reason}. يرجى مراجعة إدارة السنتر.`,
    );
    error.statusCode = 403;
    throw error;
  }

  if (student.password !== null) {
    const error = new Error(
      "تم تفعيل هذا الحساب وتعيين كلمة المرور مسبقاً. يرجى تسجيل الدخول مباشرة.",
    );
    error.statusCode = 409;
    error.code = "ACCOUNT_ALREADY_ACTIVATED";
    error.is_already_activated = true;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 6);

  const updateRes = await query(
    `UPDATE students 
     SET password = $1, is_active = TRUE, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
     WHERE id = $2 AND password IS NULL
     RETURNING id, barcode, full_name, phone, grade_id, group_id, profile_image`,
    [hashedPassword, student.id],
  );

  const updatedStudent = updateRes.rows[0];
  if (!updatedStudent) {
    const error = new Error("تم تفعيل هذا الحساب مسبقاً");
    error.statusCode = 409;
    throw error;
  }

  return {
    ...updatedStudent,
    grade_name: student.grade_name,
    group_name: student.group_name,
  };
};

module.exports = {
  studentAuth,
  userAuth,
  parentAccess,
  verifyStudentActivation,
  completeStudentActivation,
};
