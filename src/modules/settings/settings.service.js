const { query } = require("../../config/database");
const settingsQueries = require("./settings.queries");

// Get settings
const getSettings = async () => {
  const result = await query(settingsQueries.getSettings);
  return result.rows[0];
};

// Update settings
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
    center_name,
    phone,
    address,
    default_lock_minutes,
    academic_year_status,
    platform_status,
  ]);
  return result.rows[0];
};

// Toggle platform status
const togglePlatformStatus = async () => {
  const result = await query(settingsQueries.togglePlatformStatus);
  return result.rows[0];
};

// Update academic year status
const updateAcademicYearStatus = async (academic_year_status) => {
  const result = await query(settingsQueries.updateAcademicYearStatus, [
    academic_year_status,
  ]);
  return result.rows[0];
};

module.exports = {
  getSettings,
  updateSettings,
  togglePlatformStatus,
  updateAcademicYearStatus,
};
