const { query } = require("../../config/database");

const aiQueries = {
  // Get today's usage for a user
  getTodayUsage: async (userType, userId) => {
    const result = await query(
      `
      SELECT 
        id, user_type, user_id, usage_date,
        message_count, file_count, created_at, updated_at
      FROM ai_daily_usage
      WHERE user_type = $1 AND user_id = $2 AND usage_date = CURRENT_DATE
    `,
      [userType, userId],
    );
    return result.rows[0] || null;
  },

  // Increment usage for today (creates record if not exists)
  incrementUsage: async (userType, userId, incrementMessages = 1, incrementFiles = 0) => {
    const result = await query(
      `
      INSERT INTO ai_daily_usage (
        user_type, user_id, usage_date,
        message_count, file_count, created_at, updated_at
      )
      VALUES ($1, $2, CURRENT_DATE, $3, $4, NOW(), NOW())
      ON CONFLICT (user_type, user_id, usage_date)
      DO UPDATE SET
        message_count = ai_daily_usage.message_count + EXCLUDED.message_count,
        file_count = ai_daily_usage.file_count + EXCLUDED.file_count,
        updated_at = NOW()
      RETURNING *
    `,
      [userType, userId, incrementMessages, incrementFiles],
    );
    return result.rows[0];
  },

  // Save a message (user or assistant)
  insertMessage: async ({
    userType,
    userId,
    role,
    message,
    fileName = null,
    filePath = null,
    fileMimeType = null,
  }) => {
    const result = await query(
      `
      INSERT INTO ai_messages (
        user_type, user_id, role, message,
        file_name, file_path, file_mime_type, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `,
      [userType, userId, role, message, fileName, filePath, fileMimeType],
    );
    return result.rows[0];
  },

  // Get recent messages for Gemini conversation context
  getRecentContext: async (userType, userId, limit = 10) => {
    const result = await query(
      `
      SELECT id, role, message, file_name, file_mime_type, created_at
      FROM ai_messages
      WHERE user_type = $1 AND user_id = $2
      ORDER BY created_at DESC
      LIMIT $3
    `,
      [userType, userId, limit],
    );
    // Return in chronological order (oldest to newest)
    return result.rows.reverse();
  },

  // Get conversation history for frontend display
  getHistory: async (userType, userId, limit = 50) => {
    const result = await query(
      `
      SELECT id, role, message, file_name, file_mime_type, created_at
      FROM ai_messages
      WHERE user_type = $1 AND user_id = $2
      ORDER BY created_at ASC
      LIMIT $3
    `,
      [userType, userId, limit],
    );
    return result.rows;
  },

  // Clear conversation history (Start new chat)
  clearHistory: async (userType, userId) => {
    const result = await query(
      `
      DELETE FROM ai_messages
      WHERE user_type = $1 AND user_id = $2
    `,
      [userType, userId],
    );
    return { deletedCount: result.rowCount };
  },

  // Get student info for context (name, grade)
  getStudentContext: async (studentId) => {
    const result = await query(
      `
      SELECT s.id, s.full_name, g.name AS grade_name
      FROM students s
      LEFT JOIN grades g ON g.id = s.grade_id
      WHERE s.id = $1 AND s.deleted = 0
    `,
      [studentId],
    );
    return result.rows[0] || null;
  },

  // Get staff/teacher info for context
  getUserContext: async (userId) => {
    const result = await query(
      `
      SELECT id, full_name, role
      FROM users
      WHERE id = $1 AND deleted = 0
    `,
      [userId],
    );
    return result.rows[0] || null;
  },
};

module.exports = aiQueries;
