const { query } = require("../../config/database");
const paymentQueries = require("./payments.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");

const createPayment = async (paymentData) => {
  const { subscription_id, student_id, amount, payment_date, notes } =
    paymentData;

  const subscriptionResult = await query(paymentQueries.getSubscriptionAmount, [
    subscription_id,
  ]);

  if (!subscriptionResult.rows[0]) {
    throw new Error("Subscription not found");
  }

  const { required_amount, status, month } = subscriptionResult.rows[0];

  if (status === "paid") {
    throw new Error("Subscription already paid");
  }

  const paymentResult = await query(paymentQueries.createPayment, [
    subscription_id,
    student_id,
    amount,
    payment_date,
    notes,
  ]);

  await query(paymentQueries.markSubscriptionAsPaid, [subscription_id]);

  const payment = paymentResult.rows[0];

  if (payment) {
    try {
      const studentResult = await query(
        "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
        [student_id],
      );
      const student = studentResult.rows[0];

      if (student) {
        const paymentInfo = {
          month: month || new Date().toISOString().slice(0, 7),
          year: new Date().getFullYear(),
          amount: Number(amount) || 0,
        };

        const paymentMessage = whatsappDispatcher.generatePaymentMessage(
          student,
          paymentInfo,
        );

        await whatsappDispatcher.enqueueForStudentAndParent(
          student,
          "payment",
          {
            message: paymentMessage,
            paymentData: paymentInfo,
          },
        );
      }
    } catch (error) {
      console.error("Error enqueueing payment message:", error);
    }
  }

  return payment;
};

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

const getPaymentById = async (id) => {
  const result = await query(paymentQueries.getPaymentById, [id]);
  return result.rows[0];
};

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

const deletePayment = async (id) => {
  const paymentInfo = await query(paymentQueries.getPaymentSubscriptionId, [
    id,
  ]);

  if (!paymentInfo.rows[0]) {
    throw new Error("الدفعة غير موجودة!");
  }

  const subscription_id = paymentInfo.rows[0].subscription_id;

  const result = await query(paymentQueries.deletePayment, [id]);

  const otherPayments = await query(paymentQueries.checkOtherPayments, [
    subscription_id,
    id,
  ]);

  if (parseInt(otherPayments.rows[0].count) === 0) {
    await query(paymentQueries.revertSubscriptionToUnpaid, [subscription_id]);
  }

  return result.rows[0];
};

const getPaymentsByGradeAndMonth = async (gradeId, month) => {
  const result = await query(paymentQueries.getPaymentsByGradeAndMonth, [
    gradeId,
    month,
  ]);
  return result.rows;
};

const getPaymentsByGroupAndMonth = async (groupId, month) => {
  const result = await query(paymentQueries.getPaymentsByGroupAndMonth, [
    groupId,
    month,
  ]);
  return result.rows;
};

const getMonthlyCollections = async () => {
  const result = await query(paymentQueries.getMonthlyCollections);
  return result.rows;
};

const getUnpaidStudentsCurrentMonth = async () => {
  const result = await query(paymentQueries.getUnpaidStudentsCurrentMonth);
  return result.rows;
};

const getGradePaymentStats = async (gradeId) => {
  const result = await query(paymentQueries.getGradePaymentStats, [gradeId]);
  return result.rows[0];
};

const getGroupPaymentStats = async (groupId) => {
  const result = await query(paymentQueries.getGroupPaymentStats, [groupId]);
  return result.rows[0];
};

const getOverallPaymentStats = async () => {
  const result = await query(paymentQueries.getOverallPaymentStats);
  return result.rows[0];
};

const getAllStudentsPaymentStatus = async () => {
  const result = await query(paymentQueries.getAllStudentsPaymentStatus);
  return result.rows;
};

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
