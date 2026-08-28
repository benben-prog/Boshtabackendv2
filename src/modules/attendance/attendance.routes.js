const express = require("express");
const routes = express.Router();
const attendanceController = require("./attendance.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createAttendanceSchema,
  updateAttendanceSchema,
  markRestAbsentSchema,
} = require("../../middlewares/validations/attendance.validation");

// Create attendance
routes.post(
  "/",
  validate(createAttendanceSchema),
  attendanceController.createAttendance,
);

// Mark rest as absent
routes.post(
  "/mark-rest-absent",
  validate(markRestAbsentSchema),
  attendanceController.markRestAbsent,
);

// Get overall stats
routes.get("/overall-stats", attendanceController.getOverallAttendanceStats);

// Get consecutive absences
routes.get(
  "/consecutive-absences",
  attendanceController.getStudentsWithThreeConsecutiveAbsences,
);

// Get dashboard
routes.get("/dashboard", attendanceController.getDashboard);

// Get grade stats
routes.get(
  "/grade/:gradeId/stats",
  attendanceController.getGradeAttendanceStats,
);

// Get attendance by group and date
routes.get(
  "/group/:groupId/date/:date",
  attendanceController.getAttendanceByGroupAndDate,
);

// Get attendance by group and month
routes.get(
  "/group/:groupId/month/:month",
  attendanceController.getAttendanceByGroupAndMonth,
);

// Get attendance summary
routes.get(
  "/summary/group/:groupId/date/:date",
  attendanceController.getAttendanceSummary,
);

// Get attendance by ID
routes.get("/:id", attendanceController.getAttendanceById);

// Update attendance
routes.put(
  "/:id",
  validate(updateAttendanceSchema),
  attendanceController.updateAttendance,
);

// Delete attendance
routes.delete("/:id", attendanceController.deleteAttendance);

module.exports = routes;
