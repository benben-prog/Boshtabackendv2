const userService = require("./users.service");
const { logActivity } = require("../../utils/activityLogger");

// Create user
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    if (!user) {
      throw new Error("فشل إنشاء المستخدم حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_user",
      entity_type: "user",
      entity_id: user.id,
      description: `إنشاء مستخدم جديد: ${user.full_name} (${user.role})`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const users = await userService.getAllUsers(page);

    return res.status(200).json({
      success: true,
      message: "تم تحميل المستخدمين بنجاح!",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new Error("فشل تحميل المستخدم حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all assistants
const getAllAssistants = async (req, res, next) => {
  try {
    const assistants = await userService.getAllAssistants();

    return res.status(200).json({
      success: true,
      message: "تم تحميل المساعدين بنجاح!",
      data: assistants,
    });
  } catch (error) {
    next(error);
  }
};

// Get all teachers
const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await userService.getAllTeachers();

    return res.status(200).json({
      success: true,
      message: "تم تحميل المدرسين بنجاح!",
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

// Find user by phone
const findUserByPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await userService.findUserByPhone(phone);

    if (!user) {
      throw new Error("فشل تحميل المستخدم حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.updateUser(userId, req.body);

    if (!user) {
      throw new Error("فشل تعديل المستخدم حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_user",
      entity_type: "user",
      entity_id: userId,
      description: `تعديل مستخدم (ID: ${userId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile image
const updateUserProfileImage = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.clientId;
    const profile_image = req.file ? req.file.path : req.body.profile_image;

    const user = await userService.updateUserProfileImage(
      userId,
      profile_image,
    );

    if (!user) {
      throw new Error("فشل تعديل الصورة الشخصية!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تعديل الصورة الشخصية بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user profile image
const deleteUserProfileImage = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.clientId;

    const user = await userService.deleteUserProfileImage(userId);

    if (!user) {
      throw new Error("فشل حذف الصورة الشخصية!");
    }

    return res.status(200).json({
      success: true,
      message: "تم حذف الصورة الشخصية بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile image
const getUserProfileImage = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.clientId;

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new Error("المستخدم غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الصورة بنجاح!",
      data: { profile_image: user.profile_image },
    });
  } catch (error) {
    next(error);
  }
};

// Update user password
const updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.clientId;
    const { oldPassword, password, newPassword } = req.body;
    const user = await userService.updateUserPassword(
      userId,
      oldPassword,
      password || newPassword,
    );

    if (user && user.error) {
      return res.status(400).json({
        success: false,
        message: user.error,
      });
    }

    if (!user) {
      throw new Error("فشل تعديل كلمة المرور حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_password",
      entity_type: "user",
      entity_id: userId,
      description: "تغيير كلمة المرور",
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل كلمة المرور بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user active
const toggleUserActive = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.toggleUserActive(userId);

    if (!user) {
      throw new Error("فشل تغيير حالة المستخدم حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "toggle_user_active",
      entity_type: "user",
      entity_id: userId,
      description: `تغيير حالة مستخدم (ID: ${userId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تغيير حالة المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete user
const softDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.softDeleteUser(userId);

    if (!user) {
      throw new Error("فشل حذف المستخدم حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "soft_delete_user",
      entity_type: "user",
      entity_id: userId,
      description: `حذف مؤقت لمستخدم (ID: ${userId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Hard delete user
const hardDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.hardDeleteUser(userId);

    if (!user) {
      throw new Error("فشل حذف المستخدم نهائيًا حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "hard_delete_user",
      entity_type: "user",
      entity_id: userId,
      description: `حذف نهائي لمستخدم (ID: ${userId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف المستخدم نهائيًا بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get deleted users
const getDeletedUsers = async (req, res, next) => {
  try {
    const users = await userService.getDeletedUsers();

    return res.status(200).json({
      success: true,
      message: "تم تحميل المستخدمين المحذوفين بنجاح!",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Reset user password
const resetUserPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new Error("كلمة المرور مطلوبة!");
    }

    const result = await userService.resetUserPassword(userId, password);

    if (!result) {
      throw new Error("المستخدم غير موجود!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "reset_user_password",
      entity_type: "user",
      entity_id: userId,
      description: `إعادة تعيين باسورد لمستخدم (ID: ${userId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم إعادة تعيين الباسورد بنجاح!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Restore user
const restoreUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.restoreUser(userId);

    if (!user) {
      throw new Error("المستخدم غير موجود!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "restore_user",
      entity_type: "user",
      entity_id: userId,
      description: `استرجاع مستخدم محذوف (ID: ${userId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم استرجاع المستخدم بنجاح!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getAllAssistants,
  getAllTeachers,
  findUserByPhone,
  updateUser,
  updateUserPassword,
  toggleUserActive,
  softDeleteUser,
  hardDeleteUser,
  updateUserProfileImage,
  deleteUserProfileImage,
  getUserProfileImage,
  getDeletedUsers,
  resetUserPassword,
  restoreUser,
};
