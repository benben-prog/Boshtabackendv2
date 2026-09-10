const { query } = require("../../config/database");
const videoQueries = require("./videos.queries");

// ============================================
// CREATE
// ============================================

const createVideo = async (videoData) => {
  const {
    title,
    description,
    grade_id,
    video_url,
    file_url = null,
    thumbnail_url = null,
    created_by,
  } = videoData;

  const result = await query(videoQueries.createVideo, [
    title,
    description,
    grade_id,
    video_url,
    file_url,
    thumbnail_url,
    created_by,
  ]);

  return result.rows[0];
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
