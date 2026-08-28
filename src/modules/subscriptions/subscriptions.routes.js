const express = require("express");
const routes = express.Router();
const subscriptionController = require("./subscriptions.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createSubscriptionSchema,
  updateSubscriptionStatusSchema,
} = require("../../middlewares/validations/subscriptions.validation");

// Create subscription
routes.post("/", validate(createSubscriptionSchema), subscriptionController.createSubscription);

// Get overall stats
routes.get("/overall", subscriptionController.getOverallSubscriptionStats);

// Get students without subscription
routes.get("/without-current", subscriptionController.getStudentsWithoutSubscriptionCurrentMonth);

// Get subscriptions by month
routes.get("/month/:month", subscriptionController.getSubscriptionsByMonth);

// Get grade stats
routes.get("/grade/:gradeId/stats", subscriptionController.getGradeSubscriptionStats);

// Get group stats
routes.get("/group/:groupId/stats", subscriptionController.getGroupSubscriptionStats);

// Get student subscriptions
routes.get("/student/:studentId", subscriptionController.getStudentSubscriptions);

// Update subscription status
routes.put("/:id/status", validate(updateSubscriptionStatusSchema), subscriptionController.updateSubscriptionStatus);

// Delete subscription
routes.delete("/:id", subscriptionController.deleteSubscription);

module.exports = routes;