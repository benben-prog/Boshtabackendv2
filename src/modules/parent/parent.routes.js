const express = require("express");
const routes = express.Router();
const parentController = require("./parent.controller");

// ============================================
// PARENT ROUTES
// ============================================

// Get parent dashboard by token
routes.get("/:token", parentController.getParentDashboard);

module.exports = routes;
