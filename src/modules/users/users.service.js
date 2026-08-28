const { query } = require("../../config/database");
const bcrypt = require("bcryptjs");
const userQueries = require("./users.queries");

// Create user
const createUser = async (userData) => {
  const {
    full_name,
    phone,
    password,
    role,
    permissions,
    profile_image = null,
  } = userData;

  // تشفير الباسورد
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(userQueries.createUser, [
    full_name,
    phone,
    hashedPassword,
    role,
    permissions,
    profile_image,
  ]);
  return result.rows[0];
};

// Get all users
const getAllUsers = async (page = 1) => {
  const result = await query(userQueries.getAllUsers, [page]);
  return result.rows;
};

// Get user by ID
const getUserById = async (userId) => {
  const result = await query(userQueries.getUserById, [userId]);
  return result.rows[0];
};

// Get all assistants
const getAllAssistants = async () => {
  const result = await query(userQueries.getAllAssistants);
  return result.rows;
};

// Get all teachers
const getAllTeachers = async () => {
  const result = await query(userQueries.getAllTeachers);
  return result.rows;
};

// Find user by phone
const findUserByPhone = async (phone) => {
  const result = await query(userQueries.findUserByPhone, [phone]);
  return result.rows[0];
};

// Update user
const updateUser = async (userId, userData) => {
  const existing = await query(
    "SELECT * FROM users WHERE id = $1 AND deleted = 0",
    [userId],
  );
  if (!existing.rows[0]) return null;

  const updated = {
    full_name: userData.full_name ?? existing.rows[0].full_name,
    phone: userData.phone ?? existing.rows[0].phone,
    role: userData.role ?? existing.rows[0].role,
    permissions: userData.permissions ?? existing.rows[0].permissions,
    profile_image: userData.profile_image ?? existing.rows[0].profile_image,
  };

  const result = await query(userQueries.updateUser, [
    userId,
    updated.full_name,
    updated.phone,
    updated.role,
    updated.permissions,
    updated.profile_image,
  ]);
  return result.rows[0];
};

// Update user password
const updateUserPassword = async (userId, oldPassword, password) => {
  const existing = await query(userQueries.getUserPasswordById, [userId]);
  const user = existing.rows[0];
  if (!user) {
    return { error: "المستخدم غير موجود!" };
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return { error: "كلمة المرور القديمة غير صحيحة!" };
  }

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    return { error: "كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(userQueries.updateUserPassword, [
    userId,
    hashedPassword,
  ]);
  return result.rows[0];
};

// Update user profile image
const updateUserProfileImage = async (userId, profileImage) => {
  const result = await query(userQueries.updateUserProfileImage, [
    userId,
    profileImage,
  ]);
  return result.rows[0];
};

// Delete user profile image
const deleteUserProfileImage = async (userId) => {
  const result = await query(userQueries.deleteUserProfileImage, [userId]);
  return result.rows[0];
};

// Toggle user active status
const toggleUserActive = async (userId) => {
  const result = await query(userQueries.toggleUserActive, [userId]);
  return result.rows[0];
};

// Soft delete user
const softDeleteUser = async (userId) => {
  const result = await query(userQueries.softDeleteUser, [userId]);
  return result.rows[0];
};

// Hard delete user
const hardDeleteUser = async (userId) => {
  const result = await query(userQueries.hardDeleteUser, [userId]);
  return result.rows[0];
};

// Get users count
const getUsersCount = async () => {
  const result = await query(userQueries.getUsersCount);
  return result.rows[0];
};


// Get deleted users
const getDeletedUsers = async () => {
  const result = await query(userQueries.getDeletedUsers);
  return result.rows;
};

// Reset user password 
const resetUserPassword = async (userId, password) => {
  const user = await getUserById(userId);
  if (!user) return null;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(userQueries.resetUserPassword, [
    hashedPassword,
    userId,
  ]);

  return {
    ...result.rows[0],
    password: password,
  };
};

// Restore user
const restoreUser = async (userId) => {
  const result = await query(userQueries.restoreUser, [userId]);
  return result.rows[0];
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
  updateUserProfileImage,
  deleteUserProfileImage,
  toggleUserActive,
  softDeleteUser,
  hardDeleteUser,
  getUsersCount,
  getDeletedUsers,
  resetUserPassword,
  restoreUser,
};
