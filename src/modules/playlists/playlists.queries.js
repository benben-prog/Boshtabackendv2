/* ============================================
   PLAYLISTS QUERIES
   ============================================ */

// Create playlist
const createPlaylist = `
INSERT INTO playlists (title, description, grade_id, thumbnail_url, created_by)
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`;

// Get all playlists - 20 per page
const getAllPlaylists = `
SELECT 
  p.id AS playlist_id,
  p.title,
  p.description,
  p.grade_id,
  g.name AS grade_name,
  p.thumbnail_url,
  p.created_by,
  p.created_at,
  p.updated_at,
  COUNT(pv.id) AS videos_count
FROM playlists p
LEFT JOIN grades g ON p.grade_id = g.id AND g.deleted = 0
LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
GROUP BY p.id, g.name
ORDER BY p.created_at DESC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

// Get playlist by ID
const getPlaylistById = `
SELECT 
  p.id AS playlist_id,
  p.title,
  p.description,
  p.grade_id,
  g.name AS grade_name,
  p.thumbnail_url,
  p.created_by,
  p.created_at,
  p.updated_at,
  COUNT(pv.id) AS videos_count
FROM playlists p
LEFT JOIN grades g ON p.grade_id = g.id AND g.deleted = 0
LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
WHERE p.id = $1
GROUP BY p.id, g.name
`;

// Get playlists by grade - 20 per page
const getPlaylistsByGradeId = `
SELECT 
  p.id AS playlist_id,
  p.title,
  p.description,
  p.grade_id,
  g.name AS grade_name,
  p.thumbnail_url,
  p.created_at,
  p.updated_at,
  COUNT(pv.id) AS videos_count
FROM playlists p
LEFT JOIN grades g ON p.grade_id = g.id AND g.deleted = 0
LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
WHERE p.grade_id = $1
GROUP BY p.id, g.name
ORDER BY p.created_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Update playlist
const updatePlaylist = `
UPDATE playlists
SET 
  title = $2,
  description = $3,
  grade_id = $4,
  thumbnail_url = $5,
  updated_at = NOW()
WHERE id = $1
RETURNING *
`;

// Hard delete playlist
const hardDeletePlaylist = `
DELETE FROM playlists
WHERE id = $1
RETURNING id
`;

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  getPlaylistsByGradeId,
  updatePlaylist,
  hardDeletePlaylist,
};
