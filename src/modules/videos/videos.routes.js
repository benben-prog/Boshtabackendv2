const express = require("express");
const routes = express.Router();
const videoController = require("./videos.controller");
const validate = require("../../middlewares/validate.middleware");
const videoFilesUpload = require("../../middlewares/uploads/videoFilesUpload");
const {
  createVideoSchema,
  updateVideoSchema,
} = require("../../middlewares/validations/video.validation");

// ============================================
// GETTERS
// ============================================

// Get all videos
routes.get("/", videoController.getAllVideos);

// Get videos by grade
routes.get("/grade/:gradeId", videoController.getVideosByGradeId);

// Download video file
routes.get("/:videoId/download", videoController.downloadVideoFile);

// Get video by ID
routes.get("/:videoId", videoController.getVideoById);

// ============================================
// CREATE
// ============================================

routes.post(
  "/",
  videoFilesUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validate(createVideoSchema),
  videoController.createVideo,
);

// ============================================
// UPDATE
// ============================================

routes.put(
  "/:videoId",
  videoFilesUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validate(updateVideoSchema),
  videoController.updateVideo,
);

// ============================================
// DELETE
// ============================================

// Hard delete
routes.delete("/:videoId", videoController.hardDeleteVideo);

module.exports = routes;
