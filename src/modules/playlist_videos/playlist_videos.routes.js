const express = require("express");
const routes = express.Router();
const playlistVideoController = require("./playlist_videos.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  addVideoToPlaylistSchema,
} = require("../../middlewares/validations/playlistVideo.validation");

// Get playlist videos
routes.get("/playlist/:playlistId", playlistVideoController.getPlaylistVideos);

// Add video to playlist
routes.post(
  "/",
  validate(addVideoToPlaylistSchema),
  playlistVideoController.addVideoToPlaylist,
);

// Remove video from playlist
routes.delete("/:id", playlistVideoController.removeVideoFromPlaylist);

module.exports = routes;
