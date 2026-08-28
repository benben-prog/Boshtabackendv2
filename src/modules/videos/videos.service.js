const { query } = require("../../config/database");
const videoQueries = require("./videos.queries");

// Create video
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

// Get all videos
const getAllVideos = async (page = 1) => {
  const result = await query(videoQueries.getAllVideos, [page]);
  return result.rows;
};

// Get video by ID
const getVideoById = async (videoId) => {
  const result = await query(videoQueries.getVideoById, [videoId]);
  return result.rows[0];
};

// Get videos by grade
const getVideosByGradeId = async (gradeId, page = 1) => {
  const result = await query(videoQueries.getVideosByGradeId, [gradeId, page]);
  return result.rows;
};

// Update video
const updateVideo = async (videoId, videoData) => {
  const existing = await query("SELECT * FROM videos WHERE id = $1", [videoId]);
  if (!existing.rows[0]) return null;

  const updated = {
    title: videoData.title ?? existing.rows[0].title,
    description: videoData.description ?? existing.rows[0].description,
    grade_id: videoData.grade_id ?? existing.rows[0].grade_id,
    video_url: videoData.video_url ?? existing.rows[0].video_url,
    file_url: videoData.file_url ?? existing.rows[0].file_url,
    thumbnail_url: videoData.thumbnail_url ?? existing.rows[0].thumbnail_url,
  };

  const result = await query(videoQueries.updateVideo, [
    videoId,
    updated.title,
    updated.description,
    updated.grade_id,
    updated.video_url,
    updated.file_url,
    updated.thumbnail_url,
  ]);
  return result.rows[0];
};

// Hard delete video
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
