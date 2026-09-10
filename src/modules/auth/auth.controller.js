const authService = require("./auth.service");
const { createToken } = require("../../utils/jwt");
const { logActivity } = require("../../utils/activityLogger");
const ROLES = require("../../constants/roles");

// ============================================
// STUDENT LOGIN
// ============================================

const StudentLogin = async (req, res, next) => {
  try {
    const student = await authService.studentAuth(req.body);

    if (!student) {
      throw new Error("رقم الهاتف أو كلمة المرور غير صحيحة");
    }

    const payload = {
      id: student.id,
      barcode: student.barcode,
      role: ROLES.STUDENT,
    };

    const token = createToken(payload);

    await logActivity({
      user_id: student.id,
      user_role: ROLES.STUDENT,
      user_permissions: null,
      action: "student_login",
      entity_type: "student",
      entity_id: student.id,
      description: `تسجيل دخول الطالب: ${student.full_name}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      student: {
        ...payload,
        full_name: student.full_name,
        phone: student.phone,
        grade_id: student.grade_id,
        group_id: student.group_id,
        profile_image: student.profile_image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// USER LOGIN (assistant/teacher/super_admin)
// ============================================

const userLogin = async (req, res, next) => {
  try {
    const user = await authService.userAuth(req.body);

    if (!user) {
      throw new Error("رقم الهاتف أو كلمة المرور غير صحيحة");
    }

    const payload = {
      id: user.id,
      role: user.role,
      permissions: user.permissions,
    };

    const token = createToken(payload);

    await logActivity({
      user_id: user.id,
      user_role: user.role,
      user_permissions: user.permissions,
      action: "user_login",
      entity_type: "user",
      entity_id: user.id,
      description: `تسجيل دخول: ${user.full_name} (${user.role})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        ...payload,
        full_name: user.full_name,
        phone: user.phone,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PARENT ACCESS (by token)
// ============================================

const parentAccess = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new Error("التوكن مطلوب");
    }

    const student = await authService.parentAccess(token);

    if (!student) {
      throw new Error("رابط غير صالح أو منتهي الصلاحية");
    }

    const payload = {
      id: student.id,
      barcode: student.barcode,
      role: ROLES.PARENT,
    };

    const newToken = createToken(payload);

    await logActivity({
      user_id: student.id,
      user_role: ROLES.PARENT,
      user_permissions: null,
      action: "parent_access",
      entity_type: "student",
      entity_id: student.id,
      description: `دخول ولي الأمر للطالب: ${student.full_name}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token: newToken,
      student: {
        ...payload,
        full_name: student.full_name,
        phone: student.phone,
        grade_id: student.grade_id,
        group_id: student.group_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  StudentLogin,
  userLogin,
  parentAccess,
};
