const { query, transaction } = require("../../config/database");
const paymentQueries = require("./payments.queries");
const whatsappDispatcher = require("../whatsapp_messages/whatsapp_dispatcher.service");

// ============================================
// HELPER: Format payment data for WhatsApp
// ============================================

function formatPaymentData(monthStr) {
  if (!monthStr) {
    return { month: "غير محدد", year: new Date().getFullYear() };
  }

  const parts = String(monthStr).split("-");

  if (parts.length !== 2) {
    return { month: monthStr, year: new Date().getFullYear() };
  }

  const year = parts[0];
  const month = parts[1];

  const monthNames = {
    "01": "يناير",
    "02": "فبراير",
    "03": "مارس",
    "04": "أبريل",
    "05": "مايو",
    "06": "يونيو",
    "07": "يوليو",
    "08": "أغسطس",
    "09": "سبتمبر",
    10: "أكتوبر",
    11: "نوفمبر",
    12: "ديسمبر",
  };

  return {
    month: monthNames[month] || month,
    year: year,
  };
}

// ============================================
// CREATE PAYMENT (with payment_mode support)
// ============================================

const createPayment = async (paymentData) => {
  const {
    subscription_id,
    student_id,
    amount,
    payment_date,
    payment_mode = "normal",
    notes,
  } = paymentData;

  // Get subscription
  const subscriptionResult = await query(paymentQueries.getSubscriptionAmount, [
    subscription_id,
  ]);

  if (!subscriptionResult.rows[0]) {
    throw new Error("الاشتراك غير موجود");
  }

  const { required_amount, status, month } = subscriptionResult.rows[0];

  if (status === "paid") {
    throw new Error("الاشتراك مدفوع مسبقاً");
  }

  // ============================================
  // Determine final amount based on payment mode
  // ============================================

  let finalAmount;

  if (payment_mode === "custom") {
    // Custom mode: accept any amount (discount, special case, etc.)
    if (!amount || amount <= 0) {
      throw new Error("المبلغ مطلوب في الوضع المخصص");
    }
    finalAmount = amount;
  } else {
    // Normal mode: must match required_amount exactly
    if (amount !== undefined && amount !== null) {
      if (Number(amount) !== Number(required_amount)) {
        throw new Error(`المبلغ المطلوب ${required_amount} جنيه بالظبط`);
      }
    }
    finalAmount = required_amount;
  }

  // Create payment
  const payment = await transaction(async (client) => {
    const paymentResult = await client.query(paymentQueries.createPayment, [
      subscription_id,
      student_id,
      finalAmount,
      payment_date,
      payment_mode,
      notes,
    ]);

    await client.query(paymentQueries.markSubscriptionAsPaid, [subscription_id]);

    return paymentResult.rows[0];
  });

  // Send WhatsApp notification (fire and forget)
  if (payment) {
    try {
      const studentResult = await query(
        "SELECT id, full_name, barcode, phone, parent_phone, parent_token FROM students WHERE id = $1 AND deleted = 0",
        [student_id],
      );
      const student = studentResult.rows[0];

      if (student) {
        const { month: monthName, year } = formatPaymentData(month);
        const paymentAmount = Number(finalAmount) || 0;

        const paymentInfo = {
          month: monthName,
          year: year,
          amount: paymentAmount,
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
      console.error("Error enqueueing payment message:", error.message);
    }
  }

  return payment;
};

// ============================================
// CRUD OPERATIONS
// ============================================

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

const getPaymentsCount = async (filters) => {
  const { search = "", grade_id = null, group_id = null } = filters;
  const result = await query(paymentQueries.getPaymentsCount, [
    search,
    grade_id,
    group_id,
  ]);
  return result.rows[0];
};

const getPaymentById = async (id) => {
  const result = await query(paymentQueries.getPaymentById, [id]);
  return result.rows[0];
};

// ============================================
// UPDATE PAYMENT (flexible)
// ============================================

const updatePayment = async (id, paymentData) => {
  const { amount, payment_date, payment_mode, notes } = paymentData;

  // Get existing payment
  const existingResult = await query(
    "SELECT id, subscription_id, payment_mode, amount, payment_date, notes FROM payments WHERE id = $1",
    [id],
  );

  const existing = existingResult.rows[0];

  if (!existing) {
    return null;
  }

  // Get subscription to know required_amount
  const subscriptionResult = await query(paymentQueries.getSubscriptionAmount, [
    existing.subscription_id,
  ]);

  const subscription = subscriptionResult.rows[0];

  // Determine final payment_mode
  const finalMode = payment_mode ?? existing.payment_mode;

  // Determine final amount based on mode
  let finalAmount;

  if (finalMode === "custom") {
    // Custom mode: use provided amount or existing
    const customAmount = amount ?? existing.amount;
    if (!customAmount || customAmount <= 0) {
      throw new Error("المبلغ مطلوب في الوضع المخصص");
    }
    finalAmount = customAmount;
  } else {
    // Normal mode: use required_amount from subscription
    if (!subscription) {
      throw new Error("الاشتراك غير موجود");
    }

    // If amount is provided, it must match required_amount exactly
    if (amount !== undefined && amount !== null) {
      if (Number(amount) !== Number(subscription.required_amount)) {
        throw new Error(
          `المبلغ المطلوب ${subscription.required_amount} جنيه بالظبط`,
        );
      }
    }

    finalAmount = subscription.required_amount;
  }

  const finalPaymentDate = payment_date ?? existing.payment_date;
  const finalNotes = notes ?? existing.notes;

  const result = await query(paymentQueries.updatePayment, [
    finalAmount,
    finalPaymentDate,
    finalMode,
    finalNotes,
    id,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE PAYMENT
// ============================================

const deletePayment = async (id) => {
  return await transaction(async (client) => {
    const paymentInfo = await client.query(
      paymentQueries.getPaymentSubscriptionId,
      [id],
    );

    if (!paymentInfo.rows[0]) {
      throw new Error("الدفعة غير موجودة");
    }

    const subscription_id = paymentInfo.rows[0].subscription_id;

    const result = await client.query(paymentQueries.deletePayment, [id]);

    const otherPayments = await client.query(
      paymentQueries.checkOtherPayments,
      [subscription_id, id],
    );

    if (parseInt(otherPayments.rows[0].count) === 0) {
      await client.query(paymentQueries.revertSubscriptionToUnpaid, [
        subscription_id,
      ]);
    }

    return result.rows[0];
  });
};

// ============================================
// STATISTICS
// ============================================

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

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentsCount,
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
};
