/* ============================================
   SETTINGS QUERIES
   ============================================ */

// ============================================
// GETTERS
// ============================================

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
  whatsapp_daily_limit,
  whatsapp_delay_seconds,
  created_at,
  updated_at
FROM settings
WHERE id = 1
`;

// ============================================
// UPDATE
// ============================================

// Update settings
const updateSettings = `
UPDATE settings
SET 
  center_name = COALESCE($1, center_name),
  phone = COALESCE($2, phone),
  address = COALESCE($3, address),
  default_lock_minutes = COALESCE($4, default_lock_minutes),
  academic_year_status = COALESCE($5, academic_year_status),
  platform_status = COALESCE($6, platform_status),
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
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
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = 1
RETURNING *
`;

// Update academic year status
const updateAcademicYearStatus = `
UPDATE settings
SET 
  academic_year_status = $1,
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = 1
RETURNING *
`;

// Ensure settings row exists
const ensureSettingsRow = `
INSERT INTO settings (id, center_name, phone, address, default_lock_minutes, academic_year_status, platform_status)
VALUES (1, '', '', '', 30, 'active', 'active')
ON CONFLICT (id) DO NOTHING
RETURNING id
`;

module.exports = {
  getSettings,
  updateSettings,
  togglePlatformStatus,
  updateAcademicYearStatus,
  ensureSettingsRow,
};
