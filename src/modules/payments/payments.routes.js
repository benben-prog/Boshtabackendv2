const express = require("express");
const routes = express.Router();
const paymentController = require("./payments.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createPaymentSchema,
  updatePaymentSchema,
} = require("../../middlewares/validations/payments.validation");

// Create payment
routes.post("/", validate(createPaymentSchema), paymentController.createPayment);

// Get all payments
routes.get("/", paymentController.getAllPayments);

// Get monthly collections
routes.get("/collections", paymentController.getMonthlyCollections);

// Get unpaid students
routes.get("/unpaid", paymentController.getUnpaidStudentsCurrentMonth);

// Get overall stats
routes.get("/overall", paymentController.getOverallPaymentStats);

// Get students payment status
routes.get("/students-status", paymentController.getAllStudentsPaymentStatus);

// Get grade stats
routes.get("/grade/:gradeId/stats", paymentController.getGradePaymentStats);

// Get group stats
routes.get("/group/:groupId/stats", paymentController.getGroupPaymentStats);

// Get payments by grade and month
routes.get("/grade/:gradeId/month/:month", paymentController.getPaymentsByGradeAndMonth);

// Get payments by group and month
routes.get("/group/:groupId/month/:month", paymentController.getPaymentsByGroupAndMonth);

// Get payment by ID
routes.get("/:id", paymentController.getPaymentById);

// Update payment
routes.put("/:id", validate(updatePaymentSchema), paymentController.updatePayment);

// Delete payment
routes.delete("/:id", paymentController.deletePayment);

module.exports = routes;