// src/modules/whatsapp_messages/whatsapp_messages.controller.js
const whatsappDispatcher = require("./whatsapp_dispatcher.service");
const { query } = require("../../config/database");
const { logActivity } = require("../../utils/activityLogger");

const getEgyptDate = () => {
  const now = new Date();
  const cairoTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return cairoTime.toISOString().split("T")[0];
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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
    "sent_at",
    "delivered_at",
    "scheduled_at",
  ];
  dateFields.forEach((field) => {
    if (formatted[field] !== undefined && formatted[field] !== null) {
      formatted[field] = formatDate(formatted[field]);
    }
  });
  return formatted;
};

const sendWelcome = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await query(
      `
      SELECT s.*, g.name AS grade_name, gr.name AS group_name
      FROM students s
      LEFT JOIN grades g ON s.grade_id = g.id
      LEFT JOIN groups gr ON s.group_id = gr.id
      WHERE s.id = $1 AND s.deleted = 0
    `,
      [studentId],
    );

    if (!student.rows[0]) {
      throw new Error("Student not found");
    }

    const studentData = student.rows[0];

    const welcomeMessage = whatsappDispatcher.generateWelcomeMessage({
      full_name: studentData.full_name,
      barcode: studentData.barcode,
      parent_token: studentData.parent_token,
    });

    const results = await whatsappDispatcher.enqueueForStudentAndParent(
      studentData,
      "welcome",
      { message: welcomeMessage },
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "enqueue_welcome",
      entity_type: "whatsapp",
      entity_id: null,
      description: `Added welcome message to queue for ${studentData.full_name}`,
    });

    return res.status(201).json({
      success: true,
      message: "Welcome message added to queue",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const sendAbsence = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { date } = req.query;

    const student = await query(
      `
      SELECT s.*, g.name AS grade_name, gr.name AS group_name
      FROM students s
      LEFT JOIN grades g ON s.grade_id = g.id
      LEFT JOIN groups gr ON s.group_id = gr.id
      WHERE s.id = $1 AND s.deleted = 0
    `,
      [studentId],
    );

    if (!student.rows[0]) {
      throw new Error("Student not found");
    }

    const studentData = student.rows[0];
    const absenceDate = date || getEgyptDate();

    const absenceMessage = whatsappDispatcher.generateAbsenceMessage(
      studentData,
      absenceDate,
    );

    const results = await whatsappDispatcher.enqueueForStudentAndParent(
      studentData,
      "absence",
      { message: absenceMessage, date: absenceDate },
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "enqueue_absence",
      entity_type: "whatsapp",
      entity_id: null,
      description: `Added absence message to queue for ${studentData.full_name}`,
    });

    return res.status(201).json({
      success: true,
      message: "Absence message added to queue",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const sendPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await query(
      `
      SELECT 
        p.*,
        s.id AS student_id,
        s.full_name,
        s.barcode,
        s.phone,
        s.parent_phone,
        s.parent_token,
        sub.month
      FROM payments p
      JOIN students s ON p.student_id = s.id AND s.deleted = 0
      LEFT JOIN subscriptions sub ON p.subscription_id = sub.id
      WHERE p.id = $1
    `,
      [paymentId],
    );

    if (!payment.rows[0]) {
      throw new Error("Payment not found");
    }

    const paymentData = payment.rows[0];

    const student = {
      id: paymentData.student_id,
      full_name: paymentData.full_name,
      barcode: paymentData.barcode,
      phone: paymentData.phone,
      parent_phone: paymentData.parent_phone,
      parent_token: paymentData.parent_token,
    };

    const paymentInfo = {
      month: paymentData.month || "N/A",
      year: new Date().getFullYear(),
      amount: paymentData.amount || 0,
    };

    const paymentMessage = whatsappDispatcher.generatePaymentMessage(
      student,
      paymentInfo,
    );

    const results = await whatsappDispatcher.enqueueForStudentAndParent(
      student,
      "payment",
      { message: paymentMessage, paymentData: paymentInfo },
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "enqueue_payment",
      entity_type: "whatsapp",
      entity_id: null,
      description: `Added payment message to queue for ${student.full_name}`,
    });

    return res.status(201).json({
      success: true,
      message: "Payment message added to queue",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const sendExam = async (req, res, next) => {
  try {
    const { resultId } = req.params;

    const examResult = await query(
      `
      SELECT 
        er.*,
        s.id AS student_id,
        s.full_name,
        s.barcode,
        s.phone,
        s.parent_phone,
        s.parent_token,
        e.title AS exam_title,
        e.total_degree,
        e.exam_date
      FROM exam_results er
      JOIN students s ON er.student_id = s.id AND s.deleted = 0
      JOIN exams e ON er.exam_id = e.id AND e.deleted = 0
      WHERE er.id = $1
    `,
      [resultId],
    );

    if (!examResult.rows[0]) {
      throw new Error("Exam result not found");
    }

    const resultData = examResult.rows[0];

    const student = {
      id: resultData.student_id,
      full_name: resultData.full_name,
      barcode: resultData.barcode,
      phone: resultData.phone,
      parent_phone: resultData.parent_phone,
      parent_token: resultData.parent_token,
    };

    const examDate = resultData.exam_date
      ? new Date(resultData.exam_date).toISOString().split("T")[0]
      : getEgyptDate();

    const dayName = resultData.exam_date
      ? new Date(resultData.exam_date).toLocaleString("en-US", {
          weekday: "long",
        })
      : "";

    const examInfo = {
      score: resultData.degree || 0,
      fullMark: resultData.total_degree || 100,
      date: examDate,
      day: dayName,
    };

    const examMessage = whatsappDispatcher.generateExamMessage(
      student,
      examInfo,
    );

    const results = await whatsappDispatcher.enqueueForStudentAndParent(
      student,
      "exam",
      { message: examMessage, examData: examInfo },
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "enqueue_exam",
      entity_type: "whatsapp",
      entity_id: null,
      description: `Added exam result message to queue for ${student.full_name}`,
    });

    return res.status(201).json({
      success: true,
      message: "Exam result message added to queue",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const sendQueue = async (req, res, next) => {
  try {
    const result = await whatsappDispatcher.sendQueue({ limit: 5 });

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "send_queue",
      entity_type: "whatsapp",
      entity_id: null,
      description: `Queue sent: ${result.sent} success, ${result.failed} failed`,
    });

    return res.status(200).json({
      success: true,
      message: "Queue processed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getQueueStats = async (req, res, next) => {
  try {
    const stats = await whatsappDispatcher.getStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const resetFailed = async (req, res, next) => {
  try {
    const result = await whatsappDispatcher.resetFailed();

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "reset_failed_messages",
      entity_type: "whatsapp",
      entity_id: null,
      description: `Reset ${result.length} failed messages`,
    });

    return res.status(200).json({
      success: true,
      message: `Reset ${result.length} messages`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    let whereClause = "";
    const params = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` WHERE m.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (type) {
      whereClause += status
        ? ` AND m.type = $${paramIndex}`
        : ` WHERE m.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `
      SELECT 
        m.id,
        m.student_id,
        s.full_name AS student_name,
        s.barcode,
        m.phone,
        m.message,
        m.type,
        m.recipient,
        m.status,
        m.attempts,
        m.error_message,
        m.message_id,
        m.sent_at,
        m.delivered_at,
        m.created_at,
        m.updated_at
      FROM messages m
      LEFT JOIN students s ON m.student_id = s.id
      ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
      [...params, parseInt(limit), offset],
    );

    const countResult = await query(
      `
      SELECT COUNT(*) AS total
      FROM messages m
      ${whereClause}
    `,
      params,
    );

    const formattedMessages = formatDatesInArray(result.rows);

    return res.status(200).json({
      success: true,
      data: formattedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0]?.total || 0),
        totalPages: Math.ceil(
          parseInt(countResult.rows[0]?.total || 0) / parseInt(limit),
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await whatsappDispatcher.getMessageById(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const formattedMessage = formatDatesInObject(message);

    return res.status(200).json({
      success: true,
      data: formattedMessage,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const result = await query(
      "DELETE FROM messages WHERE id = $1 RETURNING id",
      [messageId],
    );

    if (!result.rows[0]) {
      throw new Error("Message not found");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_message",
      entity_type: "whatsapp",
      entity_id: messageId,
      description: `Deleted message (ID: ${messageId})`,
    });

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await whatsappDispatcher.getAllTemplates();

    const formattedTemplates = formatDatesInArray(templates);

    return res.status(200).json({
      success: true,
      data: formattedTemplates,
    });
  } catch (error) {
    next(error);
  }
};

const getTemplateById = async (req, res, next) => {
  try {
    const { templateId } = req.params;

    const result = await query(
      `
      SELECT id, type, template, is_active, sent_to, delay, created_at, updated_at
      FROM whatsapp_messages
      WHERE id = $1
    `,
      [templateId],
    );

    if (!result.rows[0]) {
      throw new Error("Template not found");
    }

    const formattedTemplate = formatDatesInObject(result.rows[0]);

    return res.status(200).json({
      success: true,
      data: formattedTemplate,
    });
  } catch (error) {
    next(error);
  }
};

const createTemplate = async (req, res, next) => {
  try {
    const {
      type = "custom",
      template,
      sent_to = "parents",
      delay = 45,
    } = req.body;

    if (!template) {
      throw new Error("Template is required");
    }

    const result = await query(
      `
      INSERT INTO whatsapp_messages (type, template, is_active, sent_to, delay)
      VALUES ($1, $2, 1, $3, $4)
      RETURNING id, type, template, is_active, sent_to, delay, created_at, updated_at
    `,
      [type, template, sent_to, delay],
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_whatsapp_template",
      entity_type: "whatsapp_template",
      entity_id: result.rows[0].id,
      description: `Created WhatsApp template: ${template.slice(0, 50)}...`,
    });

    const formattedTemplate = formatDatesInObject(result.rows[0]);

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: formattedTemplate,
    });
  } catch (error) {
    next(error);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const { type, template, sent_to, delay } = req.body;

    const existing = await query(
      "SELECT id FROM whatsapp_messages WHERE id = $1",
      [templateId],
    );

    if (!existing.rows[0]) {
      throw new Error("Template not found");
    }

    const result = await query(
      `
      UPDATE whatsapp_messages
      SET 
        type = COALESCE($1, type),
        template = COALESCE($2, template),
        sent_to = COALESCE($3, sent_to),
        delay = COALESCE($4, delay),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, type, template, is_active, sent_to, delay, created_at, updated_at
    `,
      [type, template, sent_to, delay, templateId],
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_whatsapp_template",
      entity_type: "whatsapp_template",
      entity_id: templateId,
      description: `Updated WhatsApp template (ID: ${templateId})`,
    });

    const formattedTemplate = formatDatesInObject(result.rows[0]);

    return res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: formattedTemplate,
    });
  } catch (error) {
    next(error);
  }
};

const toggleTemplateActive = async (req, res, next) => {
  try {
    const { templateId } = req.params;

    const existing = await query(
      "SELECT id, is_active FROM whatsapp_messages WHERE id = $1",
      [templateId],
    );

    if (!existing.rows[0]) {
      throw new Error("Template not found");
    }

    const result = await query(
      `
      UPDATE whatsapp_messages
      SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, type, template, is_active, sent_to, delay, created_at, updated_at
    `,
      [templateId],
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "toggle_whatsapp_template",
      entity_type: "whatsapp_template",
      entity_id: templateId,
      description: `Toggled WhatsApp template (ID: ${templateId}) to ${result.rows[0].is_active === 1 ? "active" : "inactive"}`,
    });

    const formattedTemplate = formatDatesInObject(result.rows[0]);

    return res.status(200).json({
      success: true,
      message: `Template ${result.rows[0].is_active === 1 ? "activated" : "deactivated"} successfully`,
      data: formattedTemplate,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const stats = await whatsappDispatcher.getStats();
    const templates = await whatsappDispatcher.getAllTemplates();

    return res.status(200).json({
      success: true,
      message: "WhatsApp dashboard data loaded successfully",
      data: {
        stats,
        templates,
      },
    });
  } catch (error) {
    next(error);
  }
};
const updateSettings = async (req, res, next) => {
  try {
    const { whatsapp_daily_limit, whatsapp_delay_seconds } = req.body;

    const result = await query(
      `
      UPDATE settings 
      SET 
        whatsapp_daily_limit = COALESCE($1::int, whatsapp_daily_limit),
        whatsapp_delay_seconds = COALESCE($2::int, whatsapp_delay_seconds),
        updated_at = NOW()
      WHERE id = 1
      RETURNING whatsapp_daily_limit, whatsapp_delay_seconds
      `,
      [whatsapp_daily_limit ?? null, whatsapp_delay_seconds ?? null],
    );

    return res.status(200).json({
      success: true,
      message: "تم تحديث الإعدادات بنجاح",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  sendWelcome,
  sendAbsence,
  sendPayment,
  sendExam,
  sendQueue,
  updateSettings,
  getQueueStats,
  resetFailed,
  getMessages,
  getMessageById,
  deleteMessage,
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  toggleTemplateActive,
  getDashboard,
};
