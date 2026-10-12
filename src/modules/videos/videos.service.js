const { query } = require("../../config/database");
const videoQueries = require("./videos.queries");

// ============================================
// CREATE
// ============================================

const createVideo = async (videoData) => {
  const finalTitle = (videoData.title || videoData.video_title || videoData.videoTitle || videoData.name || "").trim();
  if (!finalTitle) {
    const error = new Error("عنوان المحاضرة أو الفيديو مطلوب ولا يمكن تركه فارغاً");
    error.statusCode = 400;
    throw error;
  }

  const {
    description,
    grade_id,
    video_url,
    file_url = null,
    thumbnail_url = null,
    created_by,
  } = videoData;

  const result = await query(videoQueries.createVideo, [
    finalTitle,
    description,
    grade_id,
    video_url,
    file_url,
    thumbnail_url,
    created_by,
  ]);

  const createdVideo = result.rows[0];

  const targetPlaylistId = videoData.playlist_id || videoData.playlistId;
  if (targetPlaylistId) {
    await query(
      `INSERT INTO playlist_videos (playlist_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [parseInt(targetPlaylistId), createdVideo.id],
    );
  } else if (grade_id) {
    let defaultPl = await query(
      `SELECT id FROM playlists WHERE grade_id = $1 AND title = 'المحاضرات العامة' LIMIT 1`,
      [grade_id],
    );
    let plId;
    if (defaultPl.rows.length > 0) {
      plId = defaultPl.rows[0].id;
    } else {
      const newPl = await query(
        `INSERT INTO playlists (title, description, grade_id, created_by) VALUES ('المحاضرات العامة', 'جميع المحاضرات والفيديوهات التعليمية', $1, $2) RETURNING id`,
        [grade_id, created_by || null],
      );
      plId = newPl.rows[0].id;
    }
    await query(
      `INSERT INTO playlist_videos (playlist_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [plId, createdVideo.id],
    );
  }

  return createdVideo;
};

// ============================================
// GETTERS
// ============================================

const getAllVideos = async (page = 1) => {
  const result = await query(videoQueries.getAllVideos, [page]);
  return result.rows;
};

const getVideoById = async (videoId) => {
  const result = await query(videoQueries.getVideoById, [videoId]);
  return result.rows[0];
};

const getVideosByGradeId = async (gradeId, page = 1) => {
  const result = await query(videoQueries.getVideosByGradeId, [gradeId, page]);
  return result.rows;
};

// ============================================
// UPDATE
// ============================================

const updateVideo = async (videoId, videoData) => {
  const { title, description, grade_id, video_url, file_url, thumbnail_url } =
    videoData;

  const result = await query(videoQueries.updateVideo, [
    videoId,
    title ?? null,
    description ?? null,
    grade_id ?? null,
    video_url ?? null,
    file_url ?? null,
    thumbnail_url ?? null,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const hardDeleteVideo = async (videoId) => {
  const result = await query(videoQueries.hardDeleteVideo, [videoId]);
  return result.rows[0];
};

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  getVideosByGradeId,
  updateVideo,
  hardDeleteVideo,
};
