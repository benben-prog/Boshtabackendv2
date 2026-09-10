/* ============================================
   USERS QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createUser = `
INSERT INTO users (full_name, phone, password, role, permissions, profile_image)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

const getAllUsers = `
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
WHERE deleted = 0
ORDER BY full_name ASC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

const getUserById = `
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
WHERE id = $1 AND deleted = 0
`;

const getUserPasswordById = `
SELECT id, password
FROM users
WHERE id = $1 AND deleted = 0
`;

const getAllAssistants = `
SELECT 
  id,
  full_name,
  phone,
  permissions,
  profile_image,
  is_active,
  created_at
FROM users
WHERE role = 'assistant' AND deleted = 0
ORDER BY full_name ASC
`;

const getAllTeachers = `
SELECT 
  id,
  full_name,
  phone,
  permissions,
  profile_image,
  is_active,
  created_at
FROM users
WHERE role = 'teacher' AND deleted = 0
ORDER BY full_name ASC
`;

const findUserByPhone = `
SELECT 
  id,
  full_name,
  phone,
  role,
  permissions,
  profile_image,
  is_active
FROM users
WHERE phone = $1 AND deleted = 0
`;

const getDeletedUsers = `
SELECT 
  id,
  full_name,
  phone,
  role,
  permissions,
  profile_image,
  is_active,
  created_at,
  updated_at,
  deleted
FROM users
WHERE deleted = 1
ORDER BY full_name ASC
`;

const getUsersCount = `
SELECT COUNT(*) AS count
FROM users
WHERE deleted = 0
`;

// ============================================
// UPDATE
// ============================================

const updateUser = `
UPDATE users
SET 
  full_name = $2,
  phone = $3,
  role = $4,
  permissions = $5,
  profile_image = $6,
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

const updateUserPassword = `
UPDATE users
SET password = $2, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING id
`;

const updateUserProfileImage = `
UPDATE users
SET profile_image = $2, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING id, profile_image
`;

const deleteUserProfileImage = `
UPDATE users
SET profile_image = NULL, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING id, profile_image
`;

const toggleUserActive = `
UPDATE users
SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
    updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING id, is_active
`;

// ============================================
// PASSWORD MANAGEMENT
// ============================================

const resetUserPassword = `
UPDATE users
SET password = $1, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $2 AND deleted = 0
RETURNING id, full_name, phone, role
`;

// ============================================
// DELETE & RESTORE
// ============================================

const softDeleteUser = `
UPDATE users
SET deleted = 1, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 0
RETURNING id
`;

const hardDeleteUser = `
DELETE FROM users
WHERE id = $1
RETURNING id
`;

const restoreUser = `
UPDATE users
SET deleted = 0, updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1 AND deleted = 1
RETURNING id, full_name, phone, role
`;

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserPasswordById,
  getAllAssistants,
  getAllTeachers,
  findUserByPhone,
  getDeletedUsers,
  getUsersCount,
  updateUser,
  updateUserPassword,
  updateUserProfileImage,
  deleteUserProfileImage,
  toggleUserActive,
  resetUserPassword,
  softDeleteUser,
  hardDeleteUser,
  restoreUser,
};
