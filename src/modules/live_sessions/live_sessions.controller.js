const liveSessionsService = require("./live_sessions.service");
const { formatEgyptTime } = require("../../utils/timezone");
const { resolveStoredPath } = require("../../utils/fileStorage");
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
      formatted[field] = formatDate(formatted[field]);
    }
  });
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
      const url = liveSessionsService.getGoogleAuthUrl(userId);
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
    try {
      const { code, state, error: googleError } = req.query;
      const frontendUrl = env.FRONTEND_URL || "https://boshta.benb3n.cloud";

      if (googleError) {
        return res.redirect(
          `${frontendUrl}/dashboard/live-sessions?google_error=${encodeURIComponent(
            googleError,
          )}`,
        );
      }

      if (!code || !state) {
        return res.redirect(
          `${frontendUrl}/dashboard/live-sessions?google_error=${encodeURIComponent(
            "كود التحقق أو رمز الحالة مفقود",
          )}`,
        );
      }

      await liveSessionsService.handleGoogleCallback(code, state);

      return res.redirect(
        `${frontendUrl}/dashboard/live-sessions?google_connected=true`,
      );
    } catch (error) {
      const frontendUrl = env.FRONTEND_URL || "https://boshta.benb3n.cloud";
      return res.redirect(
        `${frontendUrl}/dashboard/live-sessions?google_error=${encodeURIComponent(
          error.message,
        )}`,
      );
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
      next(error);
    }
  },

  // 6. Get All Live Sessions (Teacher/Assistant view)
  getAllLiveSessions: async (req, res, next) => {
    try {
      const result = await liveSessionsService.getLiveSessions(req.query);
      return res.status(200).json({
        success: true,
        message: "تم تحميل حصص البث المباشر بنجاح",
        data: {
          sessions: formatDatesInArray(result.sessions),
          pagination: result.pagination,
        },
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
      return res.status(200).json({
        success: true,
        message: "تم تحميل حصص البث المباشر الخاصة بك بنجاح",
        data: {
          sessions: formatDatesInArray(result.sessions),
          pagination: result.pagination,
        },
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

  // 14. Download Live Session Study Material (Student, Teacher, Assistant, Super Admin)
  downloadMaterial: async (req, res, next) => {
    try {
      const { id } = req.params;
      let session;

      if (req.clientRole === "student") {
        const studentId = req.clientId || req.studentId;
        session = await liveSessionsService.getStudentLiveSessionById(
          studentId,
          id,
        );
      } else {
        session = await liveSessionsService.getLiveSessionById(id);
      }

      if (!session.material_file_path) {
        return res.status(404).json({
          success: false,
          message: "لا يوجد ملف شرح مرفق لهذه الحصة",
        });
      }

      const filePath = resolveStoredPath(session.material_file_path);
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "ملف الشرح غير موجود على مساحة التخزين",
        });
      }

      return res.download(
        filePath,
        session.material_name || "lesson_material.pdf",
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
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = liveSessionsController;
