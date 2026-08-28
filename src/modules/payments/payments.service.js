const { query } = require("../../config/database");
const paymentQueries = require("./payments.queries");

// Create payment - auto set amount from subscription required_amount
const createPayment = async (paymentData) => {
  const { subscription_id, student_id, payment_date, notes } = paymentData;

  // Get subscription required amount
  const subscriptionResult = await query(paymentQueries.getSubscriptionAmount, [
    subscription_id,
  ]);

  if (!subscriptionResult.rows[0]) {
    throw new Error("الاشتراك غير موجود!");
  }

  const { required_amount, status } = subscriptionResult.rows[0];

  // Check if already paid
  if (status === "paid") {
    throw new Error("هذا الاشتراك مدفوع بالفعل!");
  }

  // Amount equals required amount (no partial payment)
  const amount = required_amount;

  // Create payment
  const paymentResult = await query(paymentQueries.createPayment, [
    subscription_id,
    student_id,
    amount,
    payment_date,
    notes,
  ]);

  // Auto mark subscription as paid
  await query(paymentQueries.markSubscriptionAsPaid, [subscription_id]);

  return paymentResult.rows[0];
};

// Get all payments with filters
const getAllPayments = async (filters) => {
  const { search = "", grade_id = null, group_id = null, page = 1 } = filters;
  const result = await query(paymentQueries.getAllPayments, [
    search,
    grade_id,
    group_id,
    page,
  ]);
  return result.rows;
};

// Get payment by ID
const getPaymentById = async (id) => {
  const result = await query(paymentQueries.getPaymentById, [id]);
  return result.rows[0];
};

// Update payment
const updatePayment = async (id, paymentData) => {
  const { amount, payment_date, notes } = paymentData;
  const result = await query(paymentQueries.updatePayment, [
    amount,
    payment_date,
    notes,
    id,
  ]);
  return result.rows[0];
};

// Delete payment - and revert subscription to unpaid
const deletePayment = async (id) => {
  // Get subscription_id before delete
  const paymentInfo = await query(paymentQueries.getPaymentSubscriptionId, [
    id,
  ]);

  if (!paymentInfo.rows[0]) {
    throw new Error("الدفعة غير موجودة!");
  }

  const subscription_id = paymentInfo.rows[0].subscription_id;

  // Delete payment
  const result = await query(paymentQueries.deletePayment, [id]);

  // Check if subscription has other payments
  const otherPayments = await query(paymentQueries.checkOtherPayments, [
    subscription_id,
    id,
  ]);

  // If no other payments, revert subscription to unpaid
  if (parseInt(otherPayments.rows[0].count) === 0) {
    await query(paymentQueries.revertSubscriptionToUnpaid, [subscription_id]);
  }

  return result.rows[0];
};

// Get payments by grade and month
const getPaymentsByGradeAndMonth = async (gradeId, month) => {
  const result = await query(paymentQueries.getPaymentsByGradeAndMonth, [
    gradeId,
    month,
  ]);
  return result.rows;
};

// Get payments by group and month
const getPaymentsByGroupAndMonth = async (groupId, month) => {
  const result = await query(paymentQueries.getPaymentsByGroupAndMonth, [
    groupId,
    month,
  ]);
  return result.rows;
};

// Get monthly collections
const getMonthlyCollections = async () => {
  const result = await query(paymentQueries.getMonthlyCollections);
  return result.rows;
};

// Get unpaid students current month
const getUnpaidStudentsCurrentMonth = async () => {
  const result = await query(paymentQueries.getUnpaidStudentsCurrentMonth);
  return result.rows;
};

// Get grade payment stats
const getGradePaymentStats = async (gradeId) => {
  const result = await query(paymentQueries.getGradePaymentStats, [gradeId]);
  return result.rows[0];
};

// Get group payment stats
const getGroupPaymentStats = async (groupId) => {
  const result = await query(paymentQueries.getGroupPaymentStats, [groupId]);
  return result.rows[0];
};

// Get overall payment stats
const getOverallPaymentStats = async () => {
  const result = await query(paymentQueries.getOverallPaymentStats);
  return result.rows[0];
};

// Get all students payment status
const getAllStudentsPaymentStatus = async () => {
  const result = await query(paymentQueries.getAllStudentsPaymentStatus);
  return result.rows;
};

// Get payments count
const getPaymentsCount = async (filters) => {
  const { search = "", grade_id = null, group_id = null } = filters;
  const result = await query(paymentQueries.getPaymentsCount, [
    search,
    grade_id,
    group_id,
  ]);
  return result.rows[0];
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByGradeAndMonth,
  getPaymentsByGroupAndMonth,
  getMonthlyCollections,
  getUnpaidStudentsCurrentMonth,
  getGradePaymentStats,
  getGroupPaymentStats,
  getOverallPaymentStats,
  getAllStudentsPaymentStatus,
  getPaymentsCount,
};
