const playlistService = require("./playlists.service");
const { logActivity } = require("../../utils/activityLogger");

// Create playlist
const createPlaylist = async (req, res, next) => {
  try {
    const thumbnail_url = req.file ? req.file.path : null;

    const playlist = await playlistService.createPlaylist({
      ...req.body,
      thumbnail_url,
      created_by: req.clientId,
    });

    if (!playlist) {
      throw new Error("فشل إنشاء قائمة التشغيل حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم إنشاء قائمة التشغيل بنجاح!",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

// Get all playlists
const getAllPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const playlists = await playlistService.getAllPlaylists(page);

    if (!playlists) {
      throw new Error("فشل تحميل قوائم التشغيل حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل قوائم التشغيل بنجاح!",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

// Get playlist by ID
const getPlaylistById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await playlistService.getPlaylistById(playlistId);

    if (!playlist) {
      throw new Error("فشل تحميل قائمة التشغيل حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل قائمة التشغيل بنجاح!",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

// Get playlists by grade
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
      message: "تم تحميل قوائم التشغيل بنجاح!",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

// Update playlist
const updatePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const thumbnail_url = req.file ? req.file.path : null;

    const playlist = await playlistService.updatePlaylist(playlistId, {
      ...req.body,
      thumbnail_url,
    });

    if (!playlist) {
      throw new Error("فشل تعديل قائمة التشغيل حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم تعديل قائمة التشغيل بنجاح!",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

// Hard delete playlist
const hardDeletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await playlistService.hardDeletePlaylist(playlistId);

    if (!playlist) {
      throw new Error("فشل حذف قائمة التشغيل حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف قائمة التشغيل بنجاح!",
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
