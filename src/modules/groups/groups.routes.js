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
// BULK UPLOAD ROUTES
// ============================================

// تحميل Template للمجموعات
routes.get("/template", groupsBulkController.downloadGroupsTemplate);

// رفع ملف Excel لإضافة مجموعات
routes.post(
  "/bulk-upload",
  excelUpload.single("file"),
  groupsBulkController.bulkUploadGroups,
);

// ============================================
// REGULAR ROUTES
// ============================================

// Create a new group
routes.post("/", validate(createGroupSchema), groupController.createGroup);

// Get all groups
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

// Update group
routes.put("/:id", validate(updateGroupSchema), groupController.updateGroup);

// Soft delete group
routes.delete("/:id", groupController.softDeleteGroup);

// Hard delete group
routes.delete("/:id/permanent", groupController.hardDeleteGroup);

module.exports = routes;
