/* ============================================
   USERS QUERIES
   ============================================ */

// Create user (assistant/teacher)
const createUser = `
INSERT INTO users (full_name, phone, password, role, permissions, profile_image)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

// Get all users - 20 per page
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

// Get user password by ID
const getUserPasswordById = `
SELECT id, password
FROM users
WHERE id = $1 AND deleted = 0
`;

// Get user by ID
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

// Get all assistants
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

// Get all teachers
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

// Find user by phone
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

// Update user
const updateUser = `
UPDATE users
SET 
  full_name = $2,
  phone = $3,
  role = $4,
  permissions = $5,
  profile_image = $6,
  updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Update user password
const updateUserPassword = `
UPDATE users
SET password = $2, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id
`;

// Update user profile image
const updateUserProfileImage = `
UPDATE users
SET profile_image = $2, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id, profile_image
`;

// Delete user profile image
const deleteUserProfileImage = `
UPDATE users
SET profile_image = NULL, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id, profile_image
`;

// Toggle user active status
const toggleUserActive = `
UPDATE users
SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
    updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id, is_active
`;

// Soft delete user
const softDeleteUser = `
UPDATE users
SET deleted = 1, updated_at = NOW()
WHERE id = $1 AND deleted = 0
RETURNING id
`;

// Hard delete user
const hardDeleteUser = `
DELETE FROM users
WHERE id = $1
RETURNING id
`;

// Get users count
const getUsersCount = `
SELECT COUNT(*) AS count
FROM users
WHERE deleted = 0
`;


// Get deleted users
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

// Reset user password
const resetUserPassword = `
UPDATE users
SET password = $1, updated_at = NOW()
WHERE id = $2 AND deleted = 0
RETURNING id, full_name, phone, role
`;

// Restore user
const restoreUser = `
UPDATE users
SET deleted = 0, updated_at = NOW()
WHERE id = $1 AND deleted = 1
RETURNING id, full_name, phone, role
`;


module.exports = {
  createUser,
  getAllUsers,
  getUserPasswordById,
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
