const youtubeService = require("./youtube.service");
const { logActivity } = require("../../utils/activityLogger");
const { cleanupUploadedFiles } = require("../../utils/fileStorage");

const youtubeController = {
  // 1. Get Connected Channel Info
  getChannelInfo: async (req, res, next) => {
    try {
      const channelInfo = await youtubeService.getChannelInfo(req.clientId);
      return res.status(200).json({
        success: true,
        message: "تم جلب بيانات قناة YouTube بنجاح",
        data: channelInfo,
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Pre-Upload Validation Endpoint
  validateUpload: async (req, res, next) => {
    try {
      const result = await youtubeService.validateUpload(req.body);
      return res.status(200).json({
        success: true,
        message: "البيانات صالحة ويمكن بدء الرفع المباشر",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // 3. Initialize Resumable Upload Session (Zero Server Bandwidth)
  initResumableUpload: async (req, res, next) => {
    try {
      let clientOrigin = req.headers.origin;
      if (!clientOrigin && req.headers.referer) {
        try {
          clientOrigin = new URL(req.headers.referer).origin;
        } catch (_) {}
      }

      const result = await youtubeService.initResumableUpload({
        ...req.body,
        userId: req.clientId,
        origin: clientOrigin || "https://boshta.benb3n.cloud",
      });

      return res.status(201).json({
        success: true,
        message: "تم إنشاء جلسة الرفع المباشر بنجاح",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // 4. Confirm Upload and Register in Database
  confirmUpload: async (req, res, next) => {
    try {
      const file_url =
        req.files && req.files["file"]
          ? req.files["file"][0].path
          : req.body.file_url || null;
      const thumbnail_url =
        req.files && req.files["thumbnail"]
          ? req.files["thumbnail"][0].path
          : req.body.thumbnail_url || null;

      const result = await youtubeService.confirmUpload({
        ...req.body,
        file_url,
        thumbnail_url,
        userId: req.clientId,
      });

      await logActivity({
        user_id: req.clientId,
        user_role: req.clientRole,
        user_permissions: req.clientPermissions,
        action: "create_youtube_video",
        entity_type: "video",
        entity_id: result.video.id,
        description: `رفع وتوثيق فيديو جديد من يوتيوب: ${result.video.title}`,
      });

      return res.status(201).json({
        success: true,
        message: "تم تسجيل وحفظ الفيديو في المنصة بنجاح",
        data: result,
      });
    } catch (error) {
      cleanupUploadedFiles(req);
      next(error);
    }
  },
};

module.exports = youtubeController;
