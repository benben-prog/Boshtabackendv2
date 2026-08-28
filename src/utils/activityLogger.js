const { query } = require("../config/database");

const logActivity = async (activityData) => {
  try {
    const {
      user_id,
      user_role,
      user_permissions = null,
      action,
      entity_type,
      entity_id = null,
      description,
    } = activityData;

    await query(
      `INSERT INTO activity_logs (user_id, user_role, user_permissions, action, entity_type, entity_id, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user_id,
        user_role,
        user_permissions,
        action,
        entity_type,
        entity_id,
        description,
      ],
    );

    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
};

module.exports = { logActivity };
