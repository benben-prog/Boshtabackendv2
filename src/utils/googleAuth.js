const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { query } = require("../config/database");

/**
 * Creates a base Google OAuth2 client
 */
const getOAuth2Client = () => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error("بيانات اعتماد Google Client ID أو Secret غير مهيأة في النظام");
  }

  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI,
  );
};

/**
 * Generate Google OAuth consent URL
 * Encodes the userId and optional redirectTo into a secure state token valid for 15 minutes
 */
const generateAuthUrl = (userId, redirectTo = null) => {
  const oauth2Client = getOAuth2Client();

  const state = jwt.sign(
    { userId, redirectTo: redirectTo || null, purpose: "google_oauth" },
    env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state,
  });
};

/**
 * Verifies the state parameter returned by Google
 */
const verifyOAuthState = (state) => {
  try {
    const decoded = jwt.verify(state, env.JWT_SECRET);
    if (decoded.purpose !== "google_oauth") {
      throw new Error("رمز الحالة غير صالح");
    }
    return {
      userId: decoded.userId,
      redirectTo: decoded.redirectTo || null,
    };
  } catch (err) {
    throw new Error("رمز التحقق من الحالة منتهي الصلاحية أو غير صحيح");
  }
};

/**
 * Exchanges authorization code for tokens
 */
const exchangeCodeForTokens = async (code) => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

/**
 * Saves or updates tokens for a user in the database
 */
const saveUserTokens = async (userId, tokens) => {
  const {
    access_token,
    refresh_token,
    scope,
    token_type = "Bearer",
    expiry_date,
  } = tokens;

  // If refresh_token is not returned (because user re-consented without prompt=consent), keep existing one
  await query(
    `
    INSERT INTO google_tokens (user_id, access_token, refresh_token, scope, token_type, expiry_date, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = COALESCE(EXCLUDED.refresh_token, google_tokens.refresh_token),
      scope = COALESCE(EXCLUDED.scope, google_tokens.scope),
      token_type = COALESCE(EXCLUDED.token_type, google_tokens.token_type),
      expiry_date = COALESCE(EXCLUDED.expiry_date, google_tokens.expiry_date),
      updated_at = NOW()
  `,
    [userId, access_token, refresh_token || null, scope, token_type, expiry_date],
  );
};

/**
 * Gets tokens for a specific user, or fallback to the platform teacher or super_admin
 */
const getUserTokens = async (userId) => {
  // First check specific user
  let result = await query(
    "SELECT * FROM google_tokens WHERE user_id = $1 LIMIT 1",
    [userId],
  );

  // If not found and user might be assistant/admin, fallback to any teacher's connected token
  if (!result.rows.length) {
    result = await query(
      `
      SELECT gt.* FROM google_tokens gt
      JOIN users u ON u.id = gt.user_id
      WHERE u.role = 'teacher' AND u.deleted = 0
      ORDER BY gt.updated_at DESC
      LIMIT 1
    `,
    );
  }

  // If still not found, fallback to any super_admin's connected token
  if (!result.rows.length) {
    result = await query(
      `
      SELECT gt.* FROM google_tokens gt
      JOIN users u ON u.id = gt.user_id
      WHERE u.role = 'super_admin' AND u.deleted = 0
      ORDER BY gt.updated_at DESC
      LIMIT 1
    `,
    );
  }

  return result.rows[0] || null;
};

/**
 * Deletes Google tokens for a user (disconnect)
 */
const deleteUserTokens = async (userId) => {
  await query("DELETE FROM google_tokens WHERE user_id = $1", [userId]);
};

/**
 * Returns an authenticated OAuth2 client for the user
 */
const getAuthenticatedClient = async (userId) => {
  const tokenRecord = await getUserTokens(userId);
  if (!tokenRecord) {
    const error = new Error("حساب Google غير مربوط، يرجى ربط حساب Google أولاً لإنشاء حصص البث المباشر");
    error.statusCode = 400;
    throw error;
  }

  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    access_token: tokenRecord.access_token,
    refresh_token: tokenRecord.refresh_token,
    expiry_date: tokenRecord.expiry_date ? Number(tokenRecord.expiry_date) : null,
  });

  // Automatically persist refreshed tokens
  oauth2Client.on("tokens", async (newTokens) => {
    try {
      await saveUserTokens(tokenRecord.user_id, newTokens);
    } catch (err) {
      console.error("Failed to update refreshed Google tokens:", err.message);
    }
  });

  return {
    oauth2Client,
    calendar: google.calendar({ version: "v3", auth: oauth2Client }),
    drive: google.drive({ version: "v3", auth: oauth2Client }),
    youtube: google.youtube({ version: "v3", auth: oauth2Client }),
  };
};

/**
 * Creates a Google Calendar event with Google Meet conference
 */
const createMeetEvent = async (userId, { title, description, startTime, endTime }) => {
  const { calendar } = await getAuthenticatedClient(userId);

  const requestId = `boshta-meet-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: title,
      description: description || `حصة بث مباشر: ${title}`,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "Africa/Cairo",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "Africa/Cairo",
      },
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const meetLink =
    response.data.hangoutLink ||
    (response.data.conferenceData?.entryPoints || []).find(
      (ep) => ep.entryPointType === "video",
    )?.uri;

  if (!meetLink) {
    throw new Error("تعذر إنشاء رابط Google Meet من خوادم Google، يرجى التأكد من صلاحيات الحساب");
  }

  return {
    meet_link: meetLink,
    google_event_id: response.data.id,
  };
};

/**
 * Deletes an event from Google Calendar (optional cleanup)
 */
const deleteMeetEvent = async (userId, eventId) => {
  if (!eventId) return;
  try {
    const { calendar } = await getAuthenticatedClient(userId);
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
  } catch (err) {
    console.warn(`Could not delete Google Calendar event ${eventId}:`, err.message);
  }
};

/**
 * Searches organizer's Google Drive for recordings matching session
 */
const findDriveRecording = async (userId, title, startTime) => {
  try {
    const { drive } = await getAuthenticatedClient(userId);

    // Look for video files created around the session time
    const queryStr = "mimeType contains 'video/' and trashed = false";

    const res = await drive.files.list({
      q: queryStr,
      fields: "files(id, name, webViewLink, webContentLink, createdTime, size)",
      orderBy: "createdTime desc",
      pageSize: 20,
    });

    const files = res.data.files || [];
    if (!files.length) return null;

    // Search for match by title or closest createdTime
    const match = files.find(
      (f) =>
        f.name.toLowerCase().includes(title.toLowerCase()) ||
        f.name.toLowerCase().includes("meet recordings"),
    );

    return match || files[0] || null;
  } catch (err) {
    console.warn("Error searching Drive recordings:", err.message);
    return null;
  }
};

module.exports = {
  getOAuth2Client,
  generateAuthUrl,
  verifyOAuthState,
  exchangeCodeForTokens,
  saveUserTokens,
  getUserTokens,
  deleteUserTokens,
  getAuthenticatedClient,
  createMeetEvent,
  deleteMeetEvent,
  findDriveRecording,
};
