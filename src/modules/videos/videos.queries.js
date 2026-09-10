/* ============================================
   VIDEOS QUERIES
   ============================================ */

// ============================================
// CREATE
// ============================================

const createVideo = `
INSERT INTO videos (title, description, grade_id, video_url, file_url, thumbnail_url, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *
`;

// ============================================
// GETTERS
// ============================================

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

// ============================================
// UPDATE
// ============================================

const updateVideo = `
UPDATE videos
SET 
  title = COALESCE($2, title),
  description = COALESCE($3, description),
  grade_id = COALESCE($4, grade_id),
  video_url = COALESCE($5, video_url),
  file_url = COALESCE($6, file_url),
  thumbnail_url = COALESCE($7, thumbnail_url),
  updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
WHERE id = $1
RETURNING *
`;

// ============================================
// DELETE
// ============================================

const hardDeleteVideo = `
DELETE FROM videos
WHERE id = $1
RETURNING id, file_url, thumbnail_url
`;

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  getVideosByGradeId,
  updateVideo,
  hardDeleteVideo,
};
