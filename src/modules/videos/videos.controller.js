const videoService = require("./videos.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");

// Create video
const createVideo = async (req, res, next) => {
  try {
    const video_url = req.body.video_url;
    const file_url =
      req.files && req.files["file"] ? req.files["file"][0].path : null;
    const thumbnail_url =
      req.files && req.files["thumbnail"]
        ? req.files["thumbnail"][0].path
        : null;

    const video = await videoService.createVideo({
      ...req.body,
      video_url,
      file_url,
      thumbnail_url,
      created_by: req.clientId,
    });

    if (!video) {
      throw new Error("فشل إنشاء الفيديو حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_video",
      entity_type: "video",
      entity_id: video.id,
      description: `رفع فيديو جديد: ${video.title}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الفيديو بنجاح!",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// Get all videos
const getAllVideos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const videos = await videoService.getAllVideos(page);

    if (!videos) {
      throw new Error("فشل تحميل الفيديوهات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الفيديوهات بنجاح!",
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// Get video by ID
const getVideoById = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const video = await videoService.getVideoById(videoId);

    if (!video) {
      throw new Error("فشل تحميل الفيديو حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الفيديو بنجاح!",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// Get videos by grade
const getVideosByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const videos = await videoService.getVideosByGradeId(gradeId, page);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الفيديوهات بنجاح!",
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// Update video
const updateVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const file_url =
      req.files && req.files["file"] ? req.files["file"][0].path : null;
    const thumbnail_url =
      req.files && req.files["thumbnail"]
        ? req.files["thumbnail"][0].path
        : null;

    const video = await videoService.updateVideo(videoId, {
      ...req.body,
      file_url,
      thumbnail_url,
    });

    if (!video) {
      throw new Error("فشل تعديل الفيديو حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_video",
      entity_type: "video",
      entity_id: videoId,
      description: `تعديل فيديو (ID: ${videoId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الفيديو بنجاح!",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// Download video file
const downloadVideoFile = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const video = await videoService.getVideoById(videoId);

    if (!video || !video.file_url) {
      throw new Error("الملف غير موجود");
    }

    const filePath = path.join(__dirname, "../../../", video.file_url);
    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// Hard delete video
const hardDeleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const video = await videoService.hardDeleteVideo(videoId);

    if (!video) {
      throw new Error("فشل حذف الفيديو حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_video",
      entity_type: "video",
      entity_id: videoId,
      description: `حذف فيديو (ID: ${videoId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الفيديو بنجاح!",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  getVideosByGradeId,
  updateVideo,
  downloadVideoFile,
  hardDeleteVideo,
};
