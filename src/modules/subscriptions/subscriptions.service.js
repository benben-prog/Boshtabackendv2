const { query } = require("../../config/database");
const subscriptionQueries = require("./subscriptions.queries");

// Create subscription - auto fetch required_amount from grade
const createSubscription = async (subscriptionData) => {
  const { student_id, month } = subscriptionData;

  const result = await query(subscriptionQueries.createSubscription, [
    student_id,
    month,
  ]);

  return result.rows[0];
};

// Get student subscriptions
const getStudentSubscriptions = async (studentId) => {
  const result = await query(subscriptionQueries.getStudentSubscriptions, [
    studentId,
  ]);
  return result.rows;
};

// Get subscriptions by month
const getSubscriptionsByMonth = async (month) => {
  const result = await query(subscriptionQueries.getSubscriptionsByMonth, [
    month,
  ]);
  return result.rows;
};

// Get students without subscription current month
const getStudentsWithoutSubscriptionCurrentMonth = async () => {
  const result = await query(
    subscriptionQueries.getStudentsWithoutSubscriptionCurrentMonth,
  );
  return result.rows;
};

// Get grade subscription stats
const getGradeSubscriptionStats = async (gradeId) => {
  const result = await query(subscriptionQueries.getGradeSubscriptionStats, [
    gradeId,
  ]);
  return result.rows[0];
};

// Get group subscription stats
const getGroupSubscriptionStats = async (groupId) => {
  const result = await query(subscriptionQueries.getGroupSubscriptionStats, [
    groupId,
  ]);
  return result.rows[0];
};

// Get overall subscription stats
const getOverallSubscriptionStats = async () => {
  const result = await query(subscriptionQueries.getOverallSubscriptionStats);
  return result.rows[0];
};

// Update subscription status
const updateSubscriptionStatus = async (id, status) => {
  const result = await query(subscriptionQueries.updateSubscriptionStatus, [
    status,
    id,
  ]);
  return result.rows[0];
};

// Delete subscription
const deleteSubscription = async (id) => {
  const result = await query(subscriptionQueries.deleteSubscription, [id]);
  return result.rows[0];
};

module.exports = {
  createSubscription,
  getStudentSubscriptions,
  getSubscriptionsByMonth,
  getStudentsWithoutSubscriptionCurrentMonth,
  getGradeSubscriptionStats,
  getGroupSubscriptionStats,
  getOverallSubscriptionStats,
  updateSubscriptionStatus,
  deleteSubscription,
};
