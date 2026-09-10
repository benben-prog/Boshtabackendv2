const { query } = require("../../config/database");
const settingsQueries = require("./settings.queries");

// ============================================
// ENSURE SETTINGS ROW EXISTS
// ============================================

const ensureSettingsRow = async () => {
  await query(settingsQueries.ensureSettingsRow);
};

// ============================================
// GETTERS
// ============================================

const getSettings = async () => {
  const result = await query(settingsQueries.getSettings);
  return result.rows[0];
};

// ============================================
// UPDATE
// ============================================

const updateSettings = async (settingsData) => {
  const {
    center_name,
    phone,
    address,
    default_lock_minutes,
    academic_year_status,
    platform_status,
  } = settingsData;

  const result = await query(settingsQueries.updateSettings, [
    center_name ?? null,
    phone ?? null,
    address ?? null,
    default_lock_minutes ?? null,
    academic_year_status ?? null,
    platform_status ?? null,
  ]);

  return result.rows[0];
};

const togglePlatformStatus = async () => {
  const result = await query(settingsQueries.togglePlatformStatus);
  return result.rows[0];
};

const updateAcademicYearStatus = async (academic_year_status) => {
  const result = await query(settingsQueries.updateAcademicYearStatus, [
    academic_year_status,
  ]);
  return result.rows[0];
};

module.exports = {
  ensureSettingsRow,
  getSettings,
  updateSettings,
  togglePlatformStatus,
  updateAcademicYearStatus,
};
