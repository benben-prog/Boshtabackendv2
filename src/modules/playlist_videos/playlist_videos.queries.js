/* ============================================
   PLAYLIST VIDEOS QUERIES
   ============================================ */

// Get playlist videos
const getPlaylistVideos = `
SELECT 
  pv.id,
  pv.playlist_id,
  pv.video_id,
  v.title,
  v.description,
  v.video_url,
  v.file_url,
  v.thumbnail_url,
  pv.added_at
FROM playlist_videos pv
JOIN videos v ON pv.video_id = v.id
WHERE pv.playlist_id = $1
ORDER BY pv.added_at ASC
`;

// Add video to playlist
const addVideoToPlaylist = `
INSERT INTO playlist_videos (playlist_id, video_id)
VALUES ($1, $2)
RETURNING *
`;

// Remove video from playlist
const removeVideoFromPlaylist = `
DELETE FROM playlist_videos
WHERE id = $1
RETURNING id
`;

module.exports = {
  getPlaylistVideos,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
