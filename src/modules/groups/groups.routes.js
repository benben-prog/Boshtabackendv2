const express = require("express");
const routes = express.Router();
const groupController = require("./groups.controller");
const groupsBulkController = require("./groups.bulk.controller");
const validate = require("../../middlewares/validate.middleware");
const excelUpload = require("../../middlewares/uploads/excelUpload");
const {
  createGroupSchema,
  updateGroupSchema,
  findGroupByNameSchema,
} = require("../../middlewares/validations/groups.validation");

// ============================================
// BULK UPLOAD
// ============================================

// Download template
routes.get("/template", groupsBulkController.downloadGroupsTemplate);

// Bulk upload
routes.post(
  "/bulk-upload",
  excelUpload.single("file"),
  groupsBulkController.bulkUploadGroups,
);

// ============================================
// CREATE
// ============================================

routes.post("/", validate(createGroupSchema), groupController.createGroup);

// ============================================
// GETTERS
// ============================================

// Get all groups (with filters)
routes.get("/", groupController.getAllGroups);

// Get groups with grade name
routes.get("/with-grade-name", groupController.getGroupsWithGradeName);

// Get groups with students count
routes.get("/students-count", groupController.getGroupsWithStudentsCount);

// Get all groups stats
routes.get("/stats", groupController.getAllGroupsStats);

// Find group by name
routes.post(
  "/find",
  validate(findGroupByNameSchema),
  groupController.findGroupByName,
);

// Get groups by grade
routes.get("/grade/:gradeId", groupController.getGroupsByGradeId);

// Get group by ID
routes.get("/:id", groupController.getGroupById);

// Get group stats
routes.get("/:id/stats", groupController.getGroupStats);

// Get group full stats
routes.get("/:id/full-stats", groupController.getGroupFullStats);

// ============================================
// UPDATE
// ============================================

routes.put("/:id", validate(updateGroupSchema), groupController.updateGroup);

// ============================================
// DELETE
// ============================================

// Soft delete
routes.delete("/:id", groupController.softDeleteGroup);

// Hard delete
routes.delete("/:id/permanent", groupController.hardDeleteGroup);

module.exports = routes;
