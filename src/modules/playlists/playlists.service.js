const { query } = require("../../config/database");
const playlistQueries = require("./playlists.queries");

// Create playlist
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

// Get all playlists
const getAllPlaylists = async (page = 1) => {
  const result = await query(playlistQueries.getAllPlaylists, [page]);
  return result.rows;
};

// Get playlist by ID
const getPlaylistById = async (playlistId) => {
  const result = await query(playlistQueries.getPlaylistById, [playlistId]);
  return result.rows[0];
};

// Get playlists by grade
const getPlaylistsByGradeId = async (gradeId, page = 1) => {
  const result = await query(playlistQueries.getPlaylistsByGradeId, [
    gradeId,
    page,
  ]);
  return result.rows;
};

// Update playlist
const updatePlaylist = async (playlistId, playlistData) => {
  const existing = await query("SELECT * FROM playlists WHERE id = $1", [
    playlistId,
  ]);
  if (!existing.rows[0]) return null;

  const updated = {
    title: playlistData.title ?? existing.rows[0].title,
    description: playlistData.description ?? existing.rows[0].description,
    grade_id: playlistData.grade_id ?? existing.rows[0].grade_id,
    thumbnail_url: playlistData.thumbnail_url ?? existing.rows[0].thumbnail_url,
  };

  const result = await query(playlistQueries.updatePlaylist, [
    playlistId,
    updated.title,
    updated.description,
    updated.grade_id,
    updated.thumbnail_url,
  ]);
  return result.rows[0];
};

// Hard delete playlist
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
