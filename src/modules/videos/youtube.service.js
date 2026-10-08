const { google } = require("googleapis");
const axios = require("axios");
const env = require("../../config/env");
const { query } = require("../../config/database");
const googleAuth = require("../../utils/googleAuth");
const playlistVideoQueries = require("../playlist_videos/playlist_videos.queries");

/**
 * Returns an authenticated OAuth2 client and YouTube API instance.
 * Prioritizes the central YOUTUBE_REFRESH_TOKEN from environment if set,
 * otherwise falls back to the database tokens for the user/teacher/super_admin.
 */
const getYouTubeClient = async (userId = null) => {
  // 1. Try central environment token
  if (env.YOUTUBE_REFRESH_TOKEN && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    return { oauth2Client, youtube, isCentral: true };
  }

  // 2. Query database for any token record that has youtube scope
  const ytTokenRes = await query(
    "SELECT * FROM google_tokens WHERE scope LIKE '%youtube%' ORDER BY updated_at DESC LIMIT 1",
  );

  if (ytTokenRes.rows.length) {
    const record = ytTokenRes.rows[0];
    const oauth2Client = googleAuth.getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: record.access_token,
      refresh_token: record.refresh_token,
      expiry_date: record.expiry_date ? Number(record.expiry_date) : null,
    });

    oauth2Client.on("tokens", async (newTokens) => {
      try {
        await googleAuth.saveUserTokens(record.user_id, newTokens);
      } catch (err) {
        console.error("Failed to update refreshed Google tokens:", err.message);
      }
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    return { oauth2Client, youtube, isCentral: true };
  }

  // 3. Fallback to user tokens
  const clientData = await googleAuth.getAuthenticatedClient(userId || 1);
  return {
    oauth2Client: clientData.oauth2Client,
    youtube: clientData.youtube,
    isCentral: false,
  };
};

/**
 * Retrieves details of the connected YouTube channel.
 */
const getChannelInfo = async (userId = null) => {
  try {
    const { youtube } = await getYouTubeClient(userId);
    const res = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channel = res.data.items && res.data.items[0];
    if (!channel) {
      return {
        is_connected: false,
        message: "لا توجد قناة يوتيوب مفعلة على هذا الحساب",
      };
    }

    return {
      is_connected: true,
      channel_id: channel.id,
      title: channel.snippet.title,
      custom_url: channel.snippet.customUrl || null,
      avatar: channel.snippet.thumbnails?.default?.url || null,
      video_count: Number(channel.statistics?.videoCount || 0),
    };
  } catch (error) {
    if (error.code === 403 || error.message?.includes("quota")) {
      const err = new Error("تم استهلاك الحصة اليومية المتاحة لـ YouTube API");
      err.statusCode = 429;
      throw err;
    }
    throw error;
  }
};

/**
 * Validates prerequisites before upload (grade existence, playlist, channel status).
 */
const validateUpload = async ({ grade_id, playlist_id, title, file_size, mime_type }) => {
  // 1. Check Grade
  const gradeRes = await query(
    "SELECT id, name FROM grades WHERE id = $1 AND deleted = 0 LIMIT 1",
    [grade_id],
  );
  if (!gradeRes.rows.length) {
    const error = new Error("الصف الدراسي المحدد غير موجود أو تم حذفه");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check Playlist if specified
  if (playlist_id) {
    const plRes = await query(
      "SELECT id, title, grade_id FROM playlists WHERE id = $1 LIMIT 1",
      [playlist_id],
    );
    if (!plRes.rows.length) {
      const error = new Error("قائمة التشغيل المحددة غير موجودة أو تم حذفها");
      error.statusCode = 404;
      throw error;
    }
    if (Number(plRes.rows[0].grade_id) !== Number(grade_id)) {
      const error = new Error("قائمة التشغيل المحددة لا تنتمي لنفس الصف الدراسي");
      error.statusCode = 400;
      throw error;
    }
  }

  // 3. Check Channel / Token availability
  const hasToken =
    Boolean(env.YOUTUBE_REFRESH_TOKEN) ||
    Boolean(await googleAuth.getUserTokens());

  if (!hasToken) {
    const error = new Error("قناة YouTube المركزية غير متصلة بالنظام");
    error.statusCode = 500;
    throw error;
  }

  return {
    valid: true,
    grade_name: gradeRes.rows[0].name,
  };
};

/**
 * Creates a Google YouTube Resumable Upload session.
 * Consumes ZERO backend bandwidth: only exchanges metadata (< 1KB).
 * Returns the direct Google Cloud upload URL to the frontend.
 */
const initResumableUpload = async ({
  userId,
  title,
  description = "",
  grade_id,
  playlist_id = null,
  file_size,
  mime_type = "video/mp4",
  privacy_status = "unlisted",
  origin = null,
}) => {
  // Validate basic requirements first
  await validateUpload({ grade_id, playlist_id, title, file_size, mime_type });

  const { oauth2Client } = await getYouTubeClient(userId);
  const tokenResponse = await oauth2Client.getAccessToken();
  const accessToken = tokenResponse?.token || tokenResponse;

  if (!accessToken) {
    const error = new Error("فشل الحصول على تصريح الوصول من Google");
    error.statusCode = 401;
    throw error;
  }

  const clientOrigin = origin || env.FRONTEND_URL || "https://boshta.benb3n.cloud";

  try {
    const response = await axios.post(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        snippet: {
          title: title.trim(),
          description: (description || "").trim(),
          categoryId: "27", // Education category
        },
        status: {
          privacyStatus: privacy_status || "unlisted",
          embeddable: true,
          selfDeclaredMadeForKids: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Length": String(file_size),
          "X-Upload-Content-Type": mime_type,
          Origin: clientOrigin,
        },
        maxRedirects: 0,
        validateStatus: (status) => status === 200 || status === 308,
      },
    );

    const uploadUrl = response.headers["location"];
    if (!uploadUrl) {
      throw new Error("لم يتم استلام رابط جلسة الرفع من خوادم Google");
    }

    return {
      upload_url: uploadUrl,
      title: title.trim(),
      grade_id: Number(grade_id),
      playlist_id: playlist_id ? Number(playlist_id) : null,
      privacy_status: privacy_status || "unlisted",
    };
  } catch (error) {
    const googleReason = error.response?.data?.error?.errors?.[0]?.reason;
    const googleMsg = error.response?.data?.error?.message;

    if (googleReason === "quotaExceeded" || (googleMsg && googleMsg.toLowerCase().includes("quota"))) {
      const quotaErr = new Error(
        "تم استهلاك الحصة اليومية المتاحة لرفع الفيديوهات من Google YouTube API. يرجى المحاولة غداً أو طلب زيادة الحصة.",
      );
      quotaErr.statusCode = 429;
      throw quotaErr;
    }

    const message =
      googleMsg || error.message || "فشل إنشاء جلسة رفع الفيديو في YouTube";
    const err = new Error(message);
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};

/**
 * Confirms the video upload after the client finishes direct upload to Google,
 * creates the video record in the database and optionally attaches to playlist.
 */
const confirmUpload = async ({
  userId,
  youtube_video_id,
  title,
  description = "",
  grade_id,
  playlist_id = null,
  thumbnail_url = null,
  file_url = null,
}) => {
  // Validate Grade
  const gradeRes = await query(
    "SELECT id FROM grades WHERE id = $1 AND deleted = 0 LIMIT 1",
    [grade_id],
  );
  if (!gradeRes.rows.length) {
    const error = new Error("الصف الدراسي المحدد غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Construct standard YouTube video URL
  const cleanVideoId = String(youtube_video_id).trim();
  const videoUrl = `https://www.youtube.com/watch?v=${cleanVideoId}`;

  // Use YouTube high quality thumbnail fallback if not supplied
  const defaultThumbnail = `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`;
  const finalThumbnail = thumbnail_url || defaultThumbnail;

  // Insert into videos table
  const insertVideoQuery = `
    INSERT INTO videos (title, description, grade_id, video_url, file_url, thumbnail_url, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const videoResult = await query(insertVideoQuery, [
    title.trim(),
    (description || "").trim(),
    Number(grade_id),
    videoUrl,
    file_url || null,
    finalThumbnail,
    userId || null,
  ]);

  const newVideo = videoResult.rows[0];

  // Attach to playlist if provided
  let playlistAttached = false;
  const numPlaylistId = Number(playlist_id);
  if (playlist_id && !isNaN(numPlaylistId) && numPlaylistId > 0) {
    const plResult = await query(playlistVideoQueries.addVideoToPlaylist, [
      numPlaylistId,
      newVideo.id,
    ]);
    if (plResult.rows.length) {
      playlistAttached = true;
    }
  }

  return {
    video: newVideo,
    playlist_attached: playlistAttached,
    youtube_video_id: cleanVideoId,
  };
};

module.exports = {
  getYouTubeClient,
  getChannelInfo,
  validateUpload,
  initResumableUpload,
  confirmUpload,
};
