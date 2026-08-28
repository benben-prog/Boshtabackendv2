const { query } = require("../../config/database");
const assistantQueries = require("./assistant.queries");

// Get assistant profile
const getAssistantProfile = async (assistantId) => {
  const result = await query(assistantQueries.getAssistantProfile, [
    assistantId,
  ]);
  return result.rows[0];
};

// Get activity logs
const getActivityLogs = async (filters, userRole, userPermissions, userId) => {
  const { entity_type = "", date = null, page = 1 } = filters;

  let logsResult;
  let countResult;

  if (userRole === "super_admin" || userRole === "teacher") {
    // Super admin and teacher see all logs
    logsResult = await query(assistantQueries.getActivityLogs, [
      entity_type,
      date,
      "",
      page,
    ]);
    countResult = await query(assistantQueries.getActivityLogsCount, [
      entity_type,
      date,
      "",
    ]);
  } else if (
    userRole === "assistant" &&
    userPermissions === "center_management"
  ) {
    // Center assistant sees all assistants logs
    logsResult = await query(assistantQueries.getActivityLogs, [
      entity_type,
      date,
      "assistant",
      page,
    ]);
    countResult = await query(assistantQueries.getActivityLogsCount, [
      entity_type,
      date,
      "assistant",
    ]);
  } else {
    // Online assistant sees only his logs
    logsResult = await query(assistantQueries.getMyActivityLogs, [
      userId,
      page,
    ]);
    countResult = await query(assistantQueries.getMyActivityLogsCount, [
      userId,
    ]);
  }

  return {
    logs: logsResult.rows,
    total: parseInt(countResult.rows[0]?.count || 0),
  };
};

// Get dashboard
const getDashboard = async (userPermissions) => {
  if (userPermissions === "center_management") {
    const result = await query(assistantQueries.getCenterAssistantDashboard);
    return result.rows[0];
  } else {
    const result = await query(assistantQueries.getOnlineAssistantDashboard);
    return result.rows[0];
  }
};

module.exports = {
  getAssistantProfile,
  getActivityLogs,
  getDashboard,
};
