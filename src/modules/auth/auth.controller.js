const authService = require("./auth.service");
const { creatToken } = require("../../utils/jwt");
const ROLES = require("../../constants/roles");

// Student login
const StudentLogin = async (req, res, next) => {
  try {
    const student = await authService.studentAuth(req.body);

    if (!student) {
      throw new Error("فشل تسجيل الدخول - تأكد من البيانات!");
    }

    const payload = {
      id: student.id,
      barcode: student.barcode,
      role: ROLES.STUDENT,
    };

    const token = creatToken(payload);

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح!",
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

// User login (assistant/teacher/super_admin)
const userLogin = async (req, res, next) => {
  try {
    const user = await authService.userAuth(req.body);

    if (!user) {
      throw new Error("فشل تسجيل الدخول - تأكد من البيانات!");
    }

    const payload = {
      id: user.id,
      role: user.role,
      permissions: user.permissions,
    };

    const token = creatToken(payload);

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح!",
      token,
      user: {
        ...payload,
        full_name: user.full_name,
        phone: user.phone,
        permissions: user.permissions,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Parent access by token
const parentAccess = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new Error("التوكن مطلوب!");
    }

    const student = await authService.parentAccess(token);

    if (!student) {
      throw new Error("رابط غير صالح أو منتهي الصلاحية!");
    }

    const payload = {
      id: student.id,
      barcode: student.barcode,
      role: ROLES.PARENT,
    };

    const newToken = creatToken(payload);

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح!",
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
