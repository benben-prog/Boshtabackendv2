/* ============================================
   VIDEOS QUERIES
   ============================================ */

// Create video
const createVideo = `
INSERT INTO videos (title, description, grade_id, video_url, file_url, thumbnail_url, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *
`;

// Get all videos - 20 per page
const getAllVideos = `
SELECT 
  v.id,
  v.title,
  v.description,
  v.grade_id,
  g.name AS grade_name,
  v.video_url,
  v.file_url,
  v.thumbnail_url,
  v.created_by,
  v.created_at,
  v.updated_at
FROM videos v
LEFT JOIN grades g ON v.grade_id = g.id AND g.deleted = 0
ORDER BY v.created_at DESC
LIMIT 20 OFFSET (($1::int - 1) * 20)
`;

// Get video by ID
const getVideoById = `
SELECT 
  v.id,
  v.title,
  v.description,
  v.grade_id,
  g.name AS grade_name,
  v.video_url,
  v.file_url,
  v.thumbnail_url,
  v.created_by,
  v.created_at,
  v.updated_at
FROM videos v
LEFT JOIN grades g ON v.grade_id = g.id AND g.deleted = 0
WHERE v.id = $1
`;

// Get videos by grade - 20 per page
const getVideosByGradeId = `
SELECT 
  v.id,
  v.title,
  v.description,
  v.grade_id,
  g.name AS grade_name,
  v.video_url,
  v.file_url,
  v.thumbnail_url,
  v.created_at,
  v.updated_at
FROM videos v
LEFT JOIN grades g ON v.grade_id = g.id AND g.deleted = 0
WHERE v.grade_id = $1
ORDER BY v.created_at DESC
LIMIT 20 OFFSET (($2::int - 1) * 20)
`;

// Update video
const updateVideo = `
UPDATE videos
SET 
  title = $2,
  description = $3,
  grade_id = $4,
  video_url = $5,
  file_url = $6,
  thumbnail_url = $7,
  updated_at = NOW()
WHERE id = $1
RETURNING *
`;

// Hard delete video
const hardDeleteVideo = `
DELETE FROM videos
WHERE id = $1
RETURNING id
`;

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  getVideosByGradeId,
  updateVideo,
  hardDeleteVideo,
};
