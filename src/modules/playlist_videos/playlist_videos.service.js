const { query } = require("../../config/database");
const playlistVideoQueries = require("./playlist_videos.queries");

// ============================================
// GETTERS
// ============================================

const getPlaylistVideos = async (playlistId) => {
  const result = await query(playlistVideoQueries.getPlaylistVideos, [
    playlistId,
  ]);
  return result.rows;
};

// ============================================
// ADD
// ============================================

const addVideoToPlaylist = async (playlistId, videoId) => {
  const result = await query(playlistVideoQueries.addVideoToPlaylist, [
    playlistId,
    videoId,
  ]);

  // If conflict (already exists), return null
  // The controller will handle it
  return result.rows[0] || null;
};

// ============================================
// REMOVE
// ============================================

const removeVideoFromPlaylist = async (id) => {
  const result = await query(playlistVideoQueries.removeVideoFromPlaylist, [
    id,
  ]);
  return result.rows[0];
};

module.exports = {
  getPlaylistVideos,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
