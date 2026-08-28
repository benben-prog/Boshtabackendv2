const playlistVideoService = require("./playlist_videos.service");
const { logActivity } = require("../../utils/activityLogger");

// Get playlist videos
const getPlaylistVideos = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const videos = await playlistVideoService.getPlaylistVideos(playlistId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الفيديوهات بنجاح!",
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// Add video to playlist
const addVideoToPlaylist = async (req, res, next) => {
  try {
    const { playlist_id, video_id } = req.body;

    const playlistVideo = await playlistVideoService.addVideoToPlaylist(
      playlist_id,
      video_id,
    );

    if (!playlistVideo) {
      throw new Error("فشل إضافة الفيديو للقائمة حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "add_video_to_playlist",
      entity_type: "playlist_video",
      entity_id: playlistVideo.id,
      description: `إضافة فيديو (ID: ${video_id}) لقائمة (ID: ${playlist_id})`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إضافة الفيديو للقائمة بنجاح!",
      data: playlistVideo,
    });
  } catch (error) {
    next(error);
  }
};

// Remove video from playlist
const removeVideoFromPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await playlistVideoService.removeVideoFromPlaylist(id);

    if (!result) {
      throw new Error("فشل حذف الفيديو من القائمة حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "remove_video_from_playlist",
      entity_type: "playlist_video",
      entity_id: id,
      description: `حذف فيديو من قائمة (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الفيديو من القائمة بنجاح!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaylistVideos,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
