const { query } = require("../../config/database");
const playlistQueries = require("./playlists.queries");

// ============================================
// CREATE
// ============================================

const createPlaylist = async (playlistData) => {
  const {
    title,
    description,
    grade_id,
    thumbnail_url = null,
    created_by,
  } = playlistData;

  const result = await query(playlistQueries.createPlaylist, [
    title,
    description,
    grade_id,
    thumbnail_url,
    created_by,
  ]);

  return result.rows[0];
};

// ============================================
// GETTERS
// ============================================

const getAllPlaylists = async (page = 1) => {
  const result = await query(playlistQueries.getAllPlaylists, [page]);
  return result.rows;
};

const getPlaylistById = async (playlistId) => {
  const result = await query(playlistQueries.getPlaylistById, [playlistId]);
  return result.rows[0];
};

const getPlaylistsByGradeId = async (gradeId, page = 1) => {
  const result = await query(playlistQueries.getPlaylistsByGradeId, [
    gradeId,
    page,
  ]);
  return result.rows;
};

// ============================================
// UPDATE
// ============================================

const updatePlaylist = async (playlistId, playlistData) => {
  const { title, description, grade_id, thumbnail_url } = playlistData;

  const result = await query(playlistQueries.updatePlaylist, [
    playlistId,
    title ?? null,
    description ?? null,
    grade_id ?? null,
    thumbnail_url ?? null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const hardDeletePlaylist = async (playlistId) => {
  const result = await query(playlistQueries.hardDeletePlaylist, [playlistId]);
  return result.rows[0];
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  getPlaylistsByGradeId,
  updatePlaylist,
  hardDeletePlaylist,
};
