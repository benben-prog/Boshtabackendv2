const playlistService = require("./playlists.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");
const { cleanupUploadedFiles, resolveStoredPath } = require("../../utils/fileStorage");

// ============================================
// HELPER: Delete file from disk
// ============================================

const deleteFileFromDisk = (filePath) => {
  if (!filePath) return;

  try {
    const fullPath = resolveStoredPath(filePath);
    if (!fullPath) return;
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Failed to delete file:", error.message);
  }
};

// ============================================
// CREATE
// ============================================

const createPlaylist = async (req, res, next) => {
  try {
    const thumbnail_url = req.file ? req.file.path : null;

    const playlist = await playlistService.createPlaylist({
      ...req.body,
      thumbnail_url,
      created_by: req.clientId,
    });

    if (!playlist) {
      throw new Error("فشل إنشاء قائمة التشغيل");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_playlist",
      entity_type: "playlist",
      entity_id: playlist.id,
      description: `إنشاء قائمة تشغيل: ${playlist.title}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء قائمة التشغيل بنجاح",
      data: playlist,
    });
  } catch (error) {
    cleanupUploadedFiles(req);
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

const getAllPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const playlists = await playlistService.getAllPlaylists(page);

    return res.status(200).json({
      success: true,
      message: "تم تحميل قوائم التشغيل بنجاح",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

const getPlaylistById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await playlistService.getPlaylistById(playlistId);

    if (!playlist) {
      throw new Error("قائمة التشغيل غير موجودة");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل قائمة التشغيل بنجاح",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

const getPlaylistsByGradeId = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const playlists = await playlistService.getPlaylistsByGradeId(
      gradeId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل قوائم التشغيل بنجاح",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE
// ============================================

const updatePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    // Get old playlist to know old thumbnail
    const oldPlaylist = await playlistService.getPlaylistById(playlistId);

    if (!oldPlaylist) {
      throw new Error("قائمة التشغيل غير موجودة");
    }

    const newThumbnailUrl = req.file ? req.file.path : null;

    const playlist = await playlistService.updatePlaylist(playlistId, {
      ...req.body,
      thumbnail_url: newThumbnailUrl,
    });

    if (!playlist) {
      throw new Error("فشل تعديل قائمة التشغيل");
    }

    // Delete old thumbnail if new one was uploaded
    if (newThumbnailUrl && oldPlaylist.thumbnail_url) {
      deleteFileFromDisk(oldPlaylist.thumbnail_url);
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_playlist",
      entity_type: "playlist",
      entity_id: playlistId,
      description: `تعديل قائمة تشغيل (ID: ${playlistId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل قائمة التشغيل بنجاح",
      data: playlist,
    });
  } catch (error) {
    cleanupUploadedFiles(req);
    next(error);
  }
};

// ============================================
// DELETE
// ============================================

const hardDeletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    // Delete playlist (returns thumbnail_url)
    const playlist = await playlistService.hardDeletePlaylist(playlistId);

    if (!playlist) {
      throw new Error("قائمة التشغيل غير موجودة");
    }

    // Delete thumbnail from disk
    if (playlist.thumbnail_url) {
      deleteFileFromDisk(playlist.thumbnail_url);
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_playlist",
      entity_type: "playlist",
      entity_id: playlistId,
      description: `حذف قائمة تشغيل (ID: ${playlistId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف قائمة التشغيل بنجاح",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  getPlaylistsByGradeId,
  updatePlaylist,
  hardDeletePlaylist,
};
