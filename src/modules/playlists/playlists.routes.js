const express = require("express");
const routes = express.Router();
const playlistController = require("./playlists.controller");
const validate = require("../../middlewares/validate.middleware");
const playlistThumbnailUpload = require("../../middlewares/uploads/playlistThumbnailUpload");
const {
  createPlaylistSchema,
  updatePlaylistSchema,
} = require("../../middlewares/validations/playlist.validation");

// Get all playlists
routes.get("/", playlistController.getAllPlaylists);

// Get playlists by grade
routes.get("/grade/:gradeId", playlistController.getPlaylistsByGradeId);

// Get playlist by ID
routes.get("/:playlistId", playlistController.getPlaylistById);

// Create playlist
routes.post(
  "/",
  playlistThumbnailUpload.single("thumbnail"),
  validate(createPlaylistSchema),
  playlistController.createPlaylist,
);

// Update playlist
routes.put(
  "/:playlistId",
  playlistThumbnailUpload.single("thumbnail"),
  validate(updatePlaylistSchema),
  playlistController.updatePlaylist,
);

// Hard delete playlist
routes.delete("/:playlistId", playlistController.hardDeletePlaylist);

module.exports = routes;
