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
    const { search = "", grade_id = null, group_id = null, month = "" } = req.query;
    const isAll =
      req.query.all === "true" ||
      req.query.limit === "all" ||
      parseInt(req.query.limit) >= 500;
    const page = parseInt(req.query.page) || 1;
    const limit = isAll ? 100000 : (parseInt(req.query.limit) || 20);

    const filters = {
      search,
      grade_id: parseInt(grade_id) || null,
      group_id: parseInt(group_id) || null,
      month,
      page,
      limit,
    };

    const payments = isAll
      ? await paymentService.getAllPaymentsForExport(filters)
      : await paymentService.getAllPayments(filters);
    const countData = await paymentService.getPaymentsCount(filters);
    const totalCount = parseInt(countData?.count || 0);
    const totalAmount = parseFloat(countData?.total_amount || 0);

    const formattedPayments = formatDatesInArray(payments);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح",
      data: formattedPayments,
      pagination: {
        page: isAll ? 1 : page,
        limit: isAll ? totalCount : limit,
        total: totalCount,
        totalPages: isAll ? 1 : Math.ceil(totalCount / limit),
        total_amount: totalAmount,
        is_all: isAll,
      },
    });
  } catch (error) {
    next(error);
  }
};

const exportPaymentsExcel = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null, month = "" } = req.query;
    const filters = {
      search,
      grade_id: parseInt(grade_id) || null,
      group_id: parseInt(group_id) || null,
      month,
    };

    const payments = await paymentService.getAllPaymentsForExport(filters);
    const countData = await paymentService.getPaymentsCount(filters);
    const totalAmount = parseFloat(countData?.total_amount || 0);

    const { exportPaymentsToExcel, sendExcelResponse } = require("../../utils/excelExporter");
    const { buffer, fileName } = exportPaymentsToExcel(payments, {
      totalAmount,
      totalCount: payments.length,
      gradeName: payments[0]?.grade_name || null,
      groupName: payments[0]?.group_name || null,
      month: month || null,
    });

    return sendExcelResponse(res, buffer, fileName);
  } catch (error) {
    next(error);
  }
};

const exportPaymentsPdf = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null, month = "" } = req.query;
    const filters = {
      search,
      grade_id: parseInt(grade_id) || null,
      group_id: parseInt(group_id) || null,
      month,
    };

    const payments = await paymentService.getAllPaymentsForExport(filters);
    const countData = await paymentService.getPaymentsCount(filters);
    const totalAmount = parseFloat(countData?.total_amount || 0);

    const excelUrl = req.originalUrl.replace("/export/pdf", "/export/excel");

    const { renderPaymentsReportHtml, sendReportHtml } = require("../../utils/pdfHtmlExporter");
    const html = renderPaymentsReportHtml({
      payments,
      meta: {
        totalAmount,
        gradeName: payments[0]?.grade_name || null,
        groupName: payments[0]?.group_name || null,
        month: month || null,
      },
      stats: {
        totalAmount,
      },
      excelUrl,
    });

    return sendReportHtml(res, html);
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
    const isAll = req.query.all === "true" || req.query.limit === "all";
    const page = parseInt(req.query.page) || 1;
    const limit = isAll ? 100000 : (parseInt(req.query.limit) || 20);

    const { rows, total, totalAmount } = await paymentService.getPaymentsByGradeAndMonth(
      gradeId,
      month,
      page,
      limit,
    );

    const formattedPayments = formatDatesInArray(rows);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح",
      data: formattedPayments,
      pagination: {
        page: isAll ? 1 : page,
        limit: isAll ? total : limit,
        total,
        totalPages: isAll ? 1 : Math.ceil(total / limit),
        total_amount: totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentsByGroupAndMonth = async (req, res, next) => {
  try {
    const { groupId, month } = req.params;
    const isAll = req.query.all === "true" || req.query.limit === "all";
    const page = parseInt(req.query.page) || 1;
    const limit = isAll ? 100000 : (parseInt(req.query.limit) || 20);

    const { rows, total, totalAmount } = await paymentService.getPaymentsByGroupAndMonth(
      groupId,
      month,
      page,
      limit,
    );

    const formattedPayments = formatDatesInArray(rows);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الدفعات بنجاح",
      data: formattedPayments,
      pagination: {
        page: isAll ? 1 : page,
        limit: isAll ? total : limit,
        total,
        totalPages: isAll ? 1 : Math.ceil(total / limit),
        total_amount: totalAmount,
      },
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
    const isAll = req.query.all === "true" || req.query.limit === "all";
    const page = parseInt(req.query.page) || 1;
    const limit = isAll ? 100000 : (parseInt(req.query.limit) || 20);

    const { rows, total } = await paymentService.getUnpaidStudentsCurrentMonth(
      page,
      limit,
    );

    const formattedStudents = formatDatesInArray(rows);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح",
      data: formattedStudents,
      pagination: {
        page: isAll ? 1 : page,
        limit: isAll ? total : limit,
        total,
        totalPages: isAll ? 1 : Math.ceil(total / limit),
      },
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
  exportPaymentsExcel,
  exportPaymentsPdf,
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
