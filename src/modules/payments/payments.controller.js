const paymentService = require("./payments.service");
const { logActivity } = require("../../utils/activityLogger");

// Create payment
const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);

    if (!payment) {
      throw new Error("فشل تسجيل الدفعة حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_payment",
      entity_type: "payment",
      entity_id: payment.id,
      description: `تسجيل دفعة للطالب (ID: ${payment.student_id}) بمبلغ ${payment.amount}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم تسجيل الدفعة بنجاح!",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get all payments
const getAllPayments = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null } = req.query;
    const page = parseInt(req.query.page) || 1;

    const payments = await paymentService.getAllPayments({
      search,
      grade_id: grade_id ? parseInt(grade_id) : null,
      group_id: group_id ? parseInt(group_id) : null,
      page,
    });

    const { count } = await paymentService.getPaymentsCount({
      search,
      grade_id: grade_id ? parseInt(grade_id) : null,
      group_id: group_id ? parseInt(group_id) : null,
    });

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح!",
      data: payments,
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

// Get payment by ID
const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await paymentService.getPaymentById(id);

    if (!payment) {
      throw new Error("فشل تحميل الدفعة حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعة بنجاح!",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Update payment
const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await paymentService.updatePayment(id, req.body);

    if (!payment) {
      throw new Error("فشل تعديل الدفعة حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_payment",
      entity_type: "payment",
      entity_id: id,
      description: `تعديل دفعة (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الدفعة بنجاح!",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete payment
const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await paymentService.deletePayment(id);

    if (!payment) {
      throw new Error("فشل حذف الدفعة حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف الدفعة بنجاح!",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get payments by grade and month
const getPaymentsByGradeAndMonth = async (req, res, next) => {
  try {
    const { gradeId, month } = req.params;

    const payments = await paymentService.getPaymentsByGradeAndMonth(
      gradeId,
      month,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح!",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// Get payments by group and month
const getPaymentsByGroupAndMonth = async (req, res, next) => {
  try {
    const { groupId, month } = req.params;

    const payments = await paymentService.getPaymentsByGroupAndMonth(
      groupId,
      month,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح!",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly collections
const getMonthlyCollections = async (req, res, next) => {
  try {
    const collections = await paymentService.getMonthlyCollections();

    return res.status(200).json({
      success: true,
      message: "تم تحميل التحصيلات بنجاح!",
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

// Get unpaid students current month
const getUnpaidStudentsCurrentMonth = async (req, res, next) => {
  try {
    const students = await paymentService.getUnpaidStudentsCurrentMonth();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح!",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get grade payment stats
const getGradePaymentStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const stats = await paymentService.getGradePaymentStats(gradeId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get group payment stats
const getGroupPaymentStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const stats = await paymentService.getGroupPaymentStats(groupId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get overall payment stats
const getOverallPaymentStats = async (req, res, next) => {
  try {
    const stats = await paymentService.getOverallPaymentStats();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get all students payment status
const getAllStudentsPaymentStatus = async (req, res, next) => {
  try {
    const students = await paymentService.getAllStudentsPaymentStatus();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح!",
      data: students,
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
