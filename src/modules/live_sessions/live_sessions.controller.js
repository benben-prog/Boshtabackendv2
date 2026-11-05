const liveSessionsService = require("./live_sessions.service");
const { formatEgyptTime } = require("../../utils/timezone");
const { resolveStoredPath, cleanupUploadedFiles } = require("../../utils/fileStorage");
const fs = require("fs");
const env = require("../../config/env");

// Helper: format dates
const formatDate = (date) => {
  if (!date) return null;
  return formatEgyptTime(date, "YYYY-MM-DD HH:mm:ss");
};

const formatDatesInObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const formatted = { ...obj };
  const dateFields = ["start_time", "end_time", "created_at", "updated_at"];
  dateFields.forEach((field) => {
    if (formatted[field] !== undefined && formatted[field] !== null) {
      const original = formatted[field];
      try {
        const d = new Date(original);
        if (!isNaN(d.getTime())) {
          formatted[`${field}_iso`] = d.toISOString();
        }
      } catch (_) {}
      formatted[field] = formatDate(original);
    }
  });

  if (formatted.material_file_path) {
    const backendUrl = env.BACKEND_URL || "https://backend.benb3n.cloud";
    const cleanPath = String(formatted.material_file_path).replace(/^\/+/, "");
    formatted.material_url = `${backendUrl}/${cleanPath}`;
    // Standard aliases matching assignments and videos
    formatted.file_path = formatted.material_file_path;
    formatted.file_url = formatted.material_file_path;
    formatted.download_url = `${backendUrl}/api/live-sessions/${formatted.id}/download`;
    formatted.student_download_url = `${backendUrl}/api/student/live-sessions/${formatted.id}/download`;
    formatted.teacher_download_url = `${backendUrl}/api/teacher/live-sessions/${formatted.id}/download`;
    formatted.assistant_download_url = `${backendUrl}/api/assistant/live-sessions/${formatted.id}/download`;
  } else {
    formatted.material_url = null;
    formatted.file_path = null;
    formatted.file_url = null;
    formatted.download_url = null;
    formatted.student_download_url = null;
    formatted.teacher_download_url = null;
    formatted.assistant_download_url = null;
  }

  return formatted;
};

const formatDatesInArray = (items) => {
  if (!items || !Array.isArray(items)) return items;
  return items.map((item) => formatDatesInObject(item));
};

const liveSessionsController = {
  // 1. Get Google OAuth URL
  getGoogleAuthUrl: async (req, res, next) => {
    try {
      const userId = req.clientId;
      const redirectTo =
        req.query.redirect_to ||
        req.query.redirectTo ||
        req.headers.referer ||
        null;
      const url = liveSessionsService.getGoogleAuthUrl(userId, redirectTo);
      return res.status(200).json({
        success: true,
        message: "تم توليد رابط مصادقة Google بنجاح",
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Google OAuth Callback (Browser Redirect from Google)
  handleGoogleCallback: async (req, res, next) => {
    const defaultRedirect = `${env.FRONTEND_URL || "https://boshta.benb3n.cloud"}/dashboard/live-sessions`;
    let targetRedirect = defaultRedirect;

    const appendParam = (urlStr, key, val) => {
      const sep = urlStr.includes("?") ? "&" : "?";
      return `${urlStr}${sep}${key}=${encodeURIComponent(val)}`;
    };

    try {
      const { code, state, error: googleError } = req.query;

      if (state) {
        try {
          const googleAuth = require("../../utils/googleAuth");
          const verified = googleAuth.verifyOAuthState(state);
          if (verified && verified.redirectTo) {
            targetRedirect = verified.redirectTo;
          }
        } catch (_) {}
      }

      if (googleError) {
        return res.redirect(appendParam(targetRedirect, "google_error", googleError));
      }

      if (!code) {
        return res.redirect(
          appendParam(targetRedirect, "google_error", "كود التحقق مفقود"),
        );
      }

      if (!state) {
        // Fallback: If code arrived without state, try to exchange and save as YouTube token
        try {
          const googleAuth = require("../../utils/googleAuth");
          const tokens = await googleAuth.exchangeCodeForTokens(code);
          if (tokens.refresh_token) {
            await googleAuth.saveYouTubeToken(tokens, 1);
            return res.send(`
              <!DOCTYPE html>
              <html lang="ar" dir="rtl">
              <head><meta charset="UTF-8"><title>تم الربط</title></head>
              <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; direction: rtl; background: #f8fafc;">
                <div style="background: white; border-radius: 12px; padding: 30px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                  <div style="font-size: 48px;">✅</div>
                  <h2 style="color: #059669;">تم ربط قناة YouTube وتحديث التوكن بنجاح!</h2>
                  <p style="color: #64748b;">تم حفظ التوكن الجديد في النظام بنجاح ويمكنك الآن رفع الفيديوهات والمحاضرات.</p>
                  <a href="${env.FRONTEND_URL || "https://boshta.benb3n.cloud"}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px;">العودة للمنصة</a>
                </div>
              </body>
              </html>
            `);
          }
        } catch (_) {}

        return res.redirect(
          appendParam(targetRedirect, "google_error", "معامل التحقق من الحالة state مفقود أو غير صالح"),
        );
      }

      const callbackResult = await liveSessionsService.handleGoogleCallback(code, state);

      if (callbackResult.purpose === "youtube_oauth") {
        if (callbackResult.redirectTo) {
          return res.redirect(appendParam(callbackResult.redirectTo, "youtube_connected", "true"));
        }

        return res.send(`
          <!DOCTYPE html>
          <html lang="ar" dir="rtl">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ربط قناة YouTube المركزية</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 90vh; margin: 0; }
              .card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 480px; text-align: center; }
              .icon { font-size: 56px; margin-bottom: 16px; }
              h1 { color: #059669; font-size: 22px; margin: 0 0 12px; }
              p { color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px; }
              .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
              .btn:hover { background: #1d4ed8; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="icon">✅</div>
              <h1>تم ربط وتحديث قناة YouTube بنجاح!</h1>
              <p>تم حفظ التوكن الجديد بنجاح في النظام وتفعيله فوراً. يمكنك الآن العودة إلى لوحة التحكم والبدء في رفع المحاضرات بدون أي مشاكل.</p>
              <a href="${env.FRONTEND_URL || "https://boshta.benb3n.cloud"}" class="btn">العودة للمنصة</a>
            </div>
          </body>
          </html>
        `);
      }

      if (callbackResult.redirectTo) {
        targetRedirect = callbackResult.redirectTo;
      }

      return res.redirect(appendParam(targetRedirect, "google_connected", "true"));
    } catch (error) {
      return res.redirect(appendParam(targetRedirect, "google_error", error.message));
    }
  },

  // 2b. Direct Exchange Code (SPA / Popup flow)
  exchangeCode: async (req, res, next) => {
    try {
      const userId = req.clientId;
      const { code } = req.body;
      const result = await liveSessionsService.exchangeCode(userId, code);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // 3. Get Google Connection Status
  getGoogleStatus: async (req, res, next) => {
    try {
      const userId = req.clientId;
      const status = await liveSessionsService.getGoogleStatus(userId);
      return res.status(200).json({
        success: true,
        message: "تم جلب حالة الاتصال بحساب Google",
        data: status,
      });
    } catch (error) {
      next(error);
    }
  },

  // 4. Disconnect Google Account
  disconnectGoogle: async (req, res, next) => {
    try {
      const userId = req.clientId;
      const result = await liveSessionsService.disconnectGoogle(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // 5. Create Live Session (Generates Meet Link + optional material)
  createLiveSession: async (req, res, next) => {
    try {
      const userId = req.clientId;
      const sessionData = req.body;
      const file = req.file;

      const newSession = await liveSessionsService.createLiveSession(
        userId,
        sessionData,
        file,
      );

      return res.status(201).json({
        success: true,
        message: "تم إنشاء حصة البث المباشر وتوليد رابط Google Meet بنجاح",
        data: formatDatesInObject(newSession),
      });
    } catch (error) {
      cleanupUploadedFiles(req);
      next(error);
    }
  },

  // 6. Get All Live Sessions (Teacher/Assistant view)
  getAllLiveSessions: async (req, res, next) => {
    try {
      const result = await liveSessionsService.getLiveSessions(req.query);
      const formattedSessions = formatDatesInArray(result.sessions);
      return res.status(200).json({
        success: true,
        message: "تم تحميل حصص البث المباشر بنجاح",
        data: formattedSessions,
        sessions: formattedSessions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  // 7. Get Live Session by ID
  getLiveSessionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const session = await liveSessionsService.getLiveSessionById(id);
      return res.status(200).json({
        success: true,
        message: "تم تحميل تفاصيل الحصة بنجاح",
        data: formatDatesInObject(session),
      });
    } catch (error) {
      next(error);
    }
  },

  // 8. Update Live Session
  updateLiveSession: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await liveSessionsService.updateLiveSession(
        id,
        req.body,
        req.file,
      );
      return res.status(200).json({
        success: true,
        message: "تم تحديث بيانات الحصة بنجاح",
        data: formatDatesInObject(updated),
      });
    } catch (error) {
      cleanupUploadedFiles(req);
      next(error);
    }
  },

  // 9. Delete Live Session
  deleteLiveSession: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.clientId;
      const result = await liveSessionsService.deleteLiveSession(id, userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // 10. Sync Recording from Google Drive
  syncRecording: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.clientId;
      const result = await liveSessionsService.syncRecording(id, userId);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  // 11. Manually Update Recording URL
  updateRecordingUrl: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { recording_url } = req.body;
      const updated = await liveSessionsService.updateRecordingUrl(id, recording_url);
      return res.status(200).json({
        success: true,
        message: "تم تحديث رابط تسجيل الحصة بنجاح",
        data: formatDatesInObject(updated),
      });
    } catch (error) {
      next(error);
    }
  },

  // 12. Student View - Get all live sessions for student
  getStudentLiveSessions: async (req, res, next) => {
    try {
      const studentId = req.clientId || req.studentId;
      const result = await liveSessionsService.getLiveSessionsForStudent(
        studentId,
        req.query,
      );
      const formattedSessions = formatDatesInArray(result.sessions);
      return res.status(200).json({
        success: true,
        message: "تم تحميل حصص البث المباشر الخاصة بك بنجاح",
        data: formattedSessions,
        sessions: formattedSessions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  // 13. Student View - Get single live session
  getStudentLiveSessionById: async (req, res, next) => {
    try {
      const studentId = req.clientId || req.studentId;
      const { id } = req.params;
      const session = await liveSessionsService.getStudentLiveSessionById(
        studentId,
        id,
      );
      return res.status(200).json({
        success: true,
        message: "تم تحميل تفاصيل الحصة بنجاح",
        data: formatDatesInObject(session),
      });
    } catch (error) {
      next(error);
    }
  },

  // 14. Download / Preview Live Session Study Material (Student, Teacher, Assistant, Super Admin)
  downloadMaterial: async (req, res, next) => {
    try {
      const id = req.params.id || req.params.sessionId;
      const isPreview = req.isPreview || req.path.includes("/preview");
      let session;

      if (req.clientRole === "student" && (req.clientId || req.studentId)) {
        const studentId = req.clientId || req.studentId;
        session = await liveSessionsService.getStudentLiveSessionById(
          studentId,
          id,
        );
      } else {
        session = await liveSessionsService.getLiveSessionById(id);
      }

      if (!session || !session.material_file_path) {
        return res.status(404).json({
          success: false,
          message: "لا يوجد ملف شرح مرفق لهذه الحصة",
        });
      }

      const filePath = resolveStoredPath(session.material_file_path);
      const backendUrl = env.BACKEND_URL || "https://backend.benb3n.cloud";
      const cleanPath = String(session.material_file_path).replace(/^\/+/, "");
      const publicUrl = `${backendUrl}/${cleanPath}`;

      // If file does not exist on local disk, redirect to public static URL
      if (!filePath || !fs.existsSync(filePath)) {
        return res.redirect(publicUrl);
      }

      if (isPreview) {
        return res.sendFile(filePath);
      }

      return res.download(
        filePath,
        session.material_name || path.basename(filePath),
      );
    } catch (error) {
      next(error);
    }
  },

  // 15. Student Join Session (Validates eligibility and returns Meet link)
  joinSession: async (req, res, next) => {
    try {
      const studentId = req.clientId || req.studentId;
      const { id } = req.params;
      const session = await liveSessionsService.getStudentLiveSessionById(
        studentId,
        id,
      );

      if (session.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "تم إلغاء هذه الحصة من قِبل المعلم",
        });
      }

      return res.status(200).json({
        success: true,
        message: "تم التحقق وجاهز للانضمام للحصة الآن",
        data: {
          session_id: session.id,
          title: session.title,
          status: session.status,
          meet_link: session.meet_link,
          recording_url: session.recording_url || null,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Aliases for convenience matching other modules
  downloadSession: (req, res, next) =>
    liveSessionsController.downloadMaterial(req, res, next),
  previewMaterial: (req, res, next) => {
    req.isPreview = true;
    return liveSessionsController.downloadMaterial(req, res, next);
  },
};

module.exports = liveSessionsController;
