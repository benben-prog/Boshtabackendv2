const { query } = require("../../config/database");
const bcrypt = require("bcryptjs");
const userQueries = require("./users.queries");

// ============================================
// CREATE
// ============================================

const createUser = async (userData) => {
  const {
    full_name,
    phone,
    password,
    role,
    permissions,
    profile_image = null,
  } = userData;

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

// ============================================
// GETTERS
// ============================================

const getAllUsers = async (filtersOrPage = {}) => {
  const filters =
    typeof filtersOrPage === "number"
      ? { page: filtersOrPage }
      : filtersOrPage || {};

  const {
    search = "",
    role = null,
    is_active = null,
    status = null,
    permissions = null,
    deleted = 0,
    page = 1,
    limit = 20,
    all = false,
    sortBy = "created_at",
    order = "DESC",
  } = filters;

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  // Deleted condition
  conditions.push(`deleted = $${paramIndex++}`);
  params.push(Number(deleted) === 1 ? 1 : 0);

  // Search condition (full_name or phone)
  if (search && String(search).trim() !== "") {
    conditions.push(
      `(full_name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`,
    );
    params.push(`%${String(search).trim()}%`);
    paramIndex++;
  }

  // Role condition
  if (role && role !== "all") {
    if (Array.isArray(role)) {
      conditions.push(`role = ANY($${paramIndex++})`);
      params.push(role);
    } else {
      conditions.push(`role = $${paramIndex++}`);
      params.push(role);
    }
  }

  // Status / is_active condition
  let activeFilter = null;
  if (status !== null && status !== undefined && status !== "") {
    if (status === "active") activeFilter = 1;
    else if (status === "inactive") activeFilter = 0;
  }
  if (is_active !== null && is_active !== undefined && is_active !== "") {
    if (
      is_active === 1 ||
      is_active === "1" ||
      is_active === true ||
      is_active === "true"
    ) {
      activeFilter = 1;
    } else if (
      is_active === 0 ||
      is_active === "0" ||
      is_active === false ||
      is_active === "false"
    ) {
      activeFilter = 0;
    }
  }
  if (activeFilter !== null) {
    conditions.push(`is_active = $${paramIndex++}`);
    params.push(activeFilter);
  }

  // Permissions condition
  if (permissions && permissions !== "all" && permissions !== "") {
    conditions.push(`permissions = $${paramIndex++}`);
    params.push(permissions);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count query
  const countSql = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0]?.total || 0, 10);

  // Safe sorting
  const allowedSortCols = {
    id: "id",
    full_name: "full_name",
    phone: "phone",
    role: "role",
    permissions: "permissions",
    is_active: "is_active",
    created_at: "created_at",
  };
  const sortCol = allowedSortCols[sortBy] || "created_at";
  const sortDir = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

  // Data query
  let dataSql = `
    SELECT 
      id,
      full_name,
      phone,
      role,
      permissions,
      profile_image,
      is_active,
      created_at,
      updated_at
    FROM users
    ${whereClause}
    ORDER BY ${sortCol} ${sortDir}
  `;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const isAll = all === true || all === "true" || limit === "all";

  if (!isAll) {
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);
    const offset = (parsedPage - 1) * parsedLimit;
    dataSql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parsedLimit, offset);
  }

  const dataResult = await query(dataSql, params);
  const parsedLimit = isAll ? total : Math.max(1, parseInt(limit, 10) || 20);
  const totalPages = isAll ? 1 : Math.ceil(total / (parsedLimit || 1)) || 1;

  return {
    users: dataResult.rows,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages,
      is_all: isAll,
    },
  };
};

const getUserById = async (userId) => {
  const result = await query(userQueries.getUserById, [userId]);
  return result.rows[0];
};

const getAllAssistants = async () => {
  const result = await query(userQueries.getAllAssistants);
  return result.rows;
};

const getAllTeachers = async () => {
  const result = await query(userQueries.getAllTeachers);
  return result.rows;
};

const findUserByPhone = async (phone) => {
  const result = await query(userQueries.findUserByPhone, [phone]);
  return result.rows[0];
};

const getDeletedUsers = async () => {
  const result = await query(userQueries.getDeletedUsers);
  return result.rows;
};

// ============================================
// UPDATE
// ============================================

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

const updateUserPassword = async (
  userId,
  oldPassword,
  newPassword,
  bypassOldPassword = false,
) => {
  const existing = await query(userQueries.getUserPasswordById, [userId]);
  const user = existing.rows[0];

  if (!user) {
    throw new Error("المستخدم غير موجود");
  }

  if (!bypassOldPassword) {
    if (!oldPassword) {
      throw new Error("كلمة المرور القديمة مطلوبة");
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error("كلمة المرور القديمة غير صحيحة");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة");
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await query(userQueries.updateUserPassword, [
    userId,
    hashedPassword,
  ]);

  const updatedUser = await getUserById(userId);
  return updatedUser || { id: userId, full_name: user.full_name, role: user.role };
};

const updateUserProfileImage = async (userId, profileImage) => {
  const result = await query(userQueries.updateUserProfileImage, [
    userId,
    profileImage,
  ]);
  return result.rows[0];
};

const deleteUserProfileImage = async (userId) => {
  const result = await query(userQueries.deleteUserProfileImage, [userId]);
  return result.rows[0];
};

const toggleUserActive = async (userId) => {
  const result = await query(userQueries.toggleUserActive, [userId]);
  return result.rows[0];
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================

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

// ============================================
// DELETE & RESTORE
// ============================================

const softDeleteUser = async (userId) => {
  const result = await query(userQueries.softDeleteUser, [userId]);
  return result.rows[0];
};

const hardDeleteUser = async (userId) => {
  const result = await query(userQueries.hardDeleteUser, [userId]);
  return result.rows[0];
};

const restoreUser = async (userId) => {
  const result = await query(userQueries.restoreUser, [userId]);
  return result.rows[0];
};

// ============================================
// STATS
// ============================================

const getUsersCount = async () => {
  const result = await query(userQueries.getUsersCount);
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
