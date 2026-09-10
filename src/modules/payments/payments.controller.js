const paymentService = require("./payments.service");
const { logActivity } = require("../../utils/activityLogger");
const { formatEgyptTime } = require("../../utils/timezone");

// ============================================
// HELPER: Format dates
// ============================================

const formatDate = (date) => {
  if (!date) return null;
  return formatEgyptTime(date, "YYYY-MM-DD HH:mm:ss");
};

const formatDatesInArray = (items) => {
  if (!items || !Array.isArray(items)) return items;
  return items.map((item) => formatDatesInObject(item));
};

const formatDatesInObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const formatted = { ...obj };
  const dateFields = [
    "created_at",
    "updated_at",
    "payment_date",
    "date",
    "submitted_at",
  ];
  dateFields.forEach((field) => {
    if (formatted[field] !== undefined && formatted[field] !== null) {
      formatted[field] = formatDate(formatted[field]);
    }
  });
  return formatted;
};

// ============================================
// CREATE PAYMENT
// ============================================

const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);

    if (!payment) {
      throw new Error("فشل تسجيل الدفعة حاول مرة أخرى");
    }

    const modeText = payment.payment_mode === "custom" ? "مخصص" : "عادي";

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_payment",
      entity_type: "payment",
      entity_id: payment.id,
      description: `تسجيل دفعة (${modeText}) للطالب (ID: ${payment.student_id}) بمبلغ ${payment.amount}`,
    });

    const formattedPayment = formatDatesInObject(payment);

    return res.status(201).json({
      success: true,
      message: "تم تسجيل الدفعة بنجاح",
      data: formattedPayment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

const getAllPayments = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null } = req.query;
    const page = parseInt(req.query.page) || 1;

    const filters = {
      search,
      grade_id: grade_id ? parseInt(grade_id) : null,
      group_id: group_id ? parseInt(group_id) : null,
      page,
    };

    const payments = await paymentService.getAllPayments(filters);
    const { count } = await paymentService.getPaymentsCount(filters);

    const formattedPayments = formatDatesInArray(payments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح",
      data: formattedPayments,
      pagination: {
        page,
        limit: 20,
        total: parseInt(count),
        totalPages: Math.ceil(parseInt(count) / 20),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id);

    if (!payment) {
      throw new Error("فشل تحميل الدفعة حاول مرة أخرى");
    }

    const formattedPayment = formatDatesInObject(payment);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعة بنجاح",
      data: formattedPayment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE & DELETE
// ============================================

const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.updatePayment(id, req.body);

    if (!payment) {
      throw new Error("فشل تعديل الدفعة حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_payment",
      entity_type: "payment",
      entity_id: id,
      description: `تعديل دفعة (ID: ${id})`,
    });

    const formattedPayment = formatDatesInObject(payment);

    return res.status(200).json({
      success: true,
      message: "تم تعديل الدفعة بنجاح",
      data: formattedPayment,
    });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.deletePayment(id);

    if (!payment) {
      throw new Error("فشل حذف الدفعة حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_payment",
      entity_type: "payment",
      entity_id: id,
      description: `حذف دفعة (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الدفعة بنجاح",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// STATISTICS
// ============================================

const getPaymentsByGradeAndMonth = async (req, res, next) => {
  try {
    const { gradeId, month } = req.params;
    const payments = await paymentService.getPaymentsByGradeAndMonth(
      gradeId,
      month,
    );

    const formattedPayments = formatDatesInArray(payments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح",
      data: formattedPayments,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentsByGroupAndMonth = async (req, res, next) => {
  try {
    const { groupId, month } = req.params;
    const payments = await paymentService.getPaymentsByGroupAndMonth(
      groupId,
      month,
    );

    const formattedPayments = formatDatesInArray(payments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح",
      data: formattedPayments,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyCollections = async (req, res, next) => {
  try {
    const collections = await paymentService.getMonthlyCollections();

    const formattedCollections = formatDatesInArray(collections);

    return res.status(200).json({
      success: true,
      message: "تم تحميل التحصيلات بنجاح",
      data: formattedCollections,
    });
  } catch (error) {
    next(error);
  }
};

const getUnpaidStudentsCurrentMonth = async (req, res, next) => {
  try {
    const students = await paymentService.getUnpaidStudentsCurrentMonth();

    const formattedStudents = formatDatesInArray(students);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح",
      data: formattedStudents,
    });
  } catch (error) {
    next(error);
  }
};

const getGradePaymentStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const stats = await paymentService.getGradePaymentStats(gradeId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى");
    }

    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupPaymentStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const stats = await paymentService.getGroupPaymentStats(groupId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى");
    }

    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

const getOverallPaymentStats = async (req, res, next) => {
  try {
    const stats = await paymentService.getOverallPaymentStats();

    const formattedStats = formatDatesInObject(stats);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStudentsPaymentStatus = async (req, res, next) => {
  try {
    const students = await paymentService.getAllStudentsPaymentStatus();

    const formattedStudents = formatDatesInArray(students);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح",
      data: formattedStudents,
    });
  } catch (error) {
    next(error);
  }
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
};
