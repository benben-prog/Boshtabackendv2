const express = require("express");
const routes = express.Router();
const gradeController = require("./grades.controller");
const gradesBulkController = require("./grades.bulk.controller");
const validate = require("../../middlewares/validate.middleware");
const excelUpload = require("../../middlewares/uploads/excelUpload");
const {
  createGradeSchema,
  updateGradeSchema,
  findGradeByNameSchema,
} = require("../../middlewares/validations/grades.validation");

// ============================================
// BULK UPLOAD ROUTES
// ============================================

// تحميل Template للصفوف
routes.get("/template", gradesBulkController.downloadGradesTemplate);

// رفع ملف Excel لإضافة صفوف
routes.post(
  "/bulk-upload",
  excelUpload.single("file"),
  gradesBulkController.bulkUploadGrades,
);

// ============================================
// REGULAR ROUTES
// ============================================

// Create a new grade
routes.post("/", validate(createGradeSchema), gradeController.createGrade);

// Get all grades
routes.get("/", gradeController.getAllGrades);

// Get grades with groups count
routes.get("/groups-count", gradeController.getGradesWithGroupsCount);

// Get grades with students count
routes.get("/students-count", gradeController.getGradesWithStudentsCount);

// Get all grades stats
routes.get("/stats", gradeController.getAllGradesStats);

// Find grade by name
routes.post(
  "/find",
  validate(findGradeByNameSchema),
  gradeController.findGradeByName,
);

// Get grade by ID
routes.get("/:id", gradeController.getGradeById);

// Get grade stats
routes.get("/:id/stats", gradeController.getGradeStats);

// Update grade
routes.put("/:id", validate(updateGradeSchema), gradeController.updateGrade);

// Soft delete grade
routes.delete("/:id", gradeController.softDeleteGrade);

// Hard delete grade
routes.delete("/:id/permanent", gradeController.hardDeleteGrade);

module.exports = routes;
