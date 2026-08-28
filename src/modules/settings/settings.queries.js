/* ============================================
   SETTINGS QUERIES
   ============================================ */

// Get settings (single row - id = 1)
const getSettings = `
SELECT 
  id,
  center_name,
  phone,
  address,
  default_lock_minutes,
  academic_year_status,
  platform_status,
  created_at,
  updated_at
FROM settings
WHERE id = 1
`;

// Update settings
const updateSettings = `
UPDATE settings
SET 
  center_name = $1,
  phone = $2,
  address = $3,
  default_lock_minutes = $4,
  academic_year_status = $5,
  platform_status = $6,
  updated_at = NOW()
WHERE id = 1
RETURNING *
`;

// Toggle platform status (active <-> paused)
const togglePlatformStatus = `
UPDATE settings
SET 
  platform_status = CASE 
    WHEN platform_status = 'active' THEN 'paused'
    ELSE 'active'
  END,
  updated_at = NOW()
WHERE id = 1
RETURNING *
`;

// Update academic year status
const updateAcademicYearStatus = `
UPDATE settings
SET 
  academic_year_status = $1,
  updated_at = NOW()
WHERE id = 1
RETURNING *
`;

module.exports = {
  getSettings,
  updateSettings,
  togglePlatformStatus,
  updateAcademicYearStatus,
};
