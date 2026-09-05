// src/modules/whatsapp_messages/whatsapp_dispatcher.service.js
const { query } = require("../../config/database");
const whatsappClient = require("../../utils/whatsappClient");
const { messages } = require("../../constants/messages");
const { formatEgyptTime, getTodayEgypt } = require("../../utils/timezone");

async function getWhatsappSettings() {
  const result = await query(
    "SELECT whatsapp_daily_limit, whatsapp_delay_seconds FROM settings WHERE id = 1",
  );
  return (
    result.rows[0] || { whatsapp_daily_limit: 250, whatsapp_delay_seconds: 45 }
  );
}

async function getTodaySentCount() {
  const result = await query(
    `
    SELECT COUNT(*) AS count
    FROM messages
    WHERE status IN ('sent', 'delivered', 'read')
      AND DATE(created_at AT TIME ZONE 'Africa/Cairo') = DATE(NOW() AT TIME ZONE 'Africa/Cairo')
  `,
  );
  return parseInt(result.rows[0]?.count || 0);
}

async function getTemplateByType(type) {
  const result = await query(
    `
    SELECT id, type, template, is_active, sent_to, delay
    FROM whatsapp_messages
    WHERE type = $1
  `,
    [type],
  );
  return result.rows[0];
}

async function getAllTemplates() {
  const result = await query(`
    SELECT 
      id,
      type,
      template,
      is_active,
      sent_to,
      delay,
      created_at,
      updated_at
    FROM whatsapp_messages
    ORDER BY created_at DESC
  `);
  return result.rows;
}

function generateWelcomeMessage(student) {
  return messages.welcome(
    student.full_name,
    student.barcode,
    student.parent_token,
  );
}

function generateAbsenceMessage(student, date) {
  return messages.absent(
    student.full_name,
    student.barcode,
    date,
    student.parent_token,
  );
}

function generatePaymentMessage(student, paymentData) {
  // paymentData.month is already formatted by payments.service.js
  return messages.payment(
    student.full_name,
    paymentData.month || "غير محدد",
    paymentData.year || "غير محدد",
    paymentData.amount || 0,
  );
}

function generateExamMessage(student, examData) {
  return messages.exams(
    student.full_name,
    examData.score || 0,
    examData.fullMark || 100,
    examData.date || "غير محدد",
    examData.day || "غير محدد",
    student.barcode,
  );
}

async function enqueueMessage(messageData) {
  const { student_id, type, phone, recipient, message, ref_key } = messageData;

  if (!phone) {
    return { inserted: false, error: "Phone number required" };
  }

  const template = await getTemplateByType(type);
  if (!template || Number(template.is_active) !== 1) {
    return { inserted: false, error: "Template inactive", skipped: true };
  }

  const dailyLimit = await getWhatsappSettings();
  const sentToday = await getTodaySentCount();

  if (ref_key) {
    const existing = await query("SELECT id FROM messages WHERE ref_key = $1", [
      ref_key,
    ]);
    if (existing.rows.length > 0) {
      return { inserted: false, id: existing.rows[0].id, message: "Duplicate" };
    }
  }

  let status = "pending";
  if (sentToday >= dailyLimit.whatsapp_daily_limit) {
    status = "scheduled";
  }

  const result = await query(
    `
    INSERT INTO messages (student_id, phone, message, type, recipient, ref_key, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() AT TIME ZONE 'Africa/Cairo', NOW() AT TIME ZONE 'Africa/Cairo')
    RETURNING id, status
  `,
    [student_id, phone, message, type, recipient, ref_key, status],
  );

  return {
    inserted: true,
    id: result.rows[0].id,
    scheduled: status === "scheduled",
  };
}

async function enqueueForStudentAndParent(student, type, messageData) {
  const template = await getTemplateByType(type);

  if (!template || Number(template.is_active) !== 1) {
    return [{ inserted: false, error: "Template inactive", skipped: true }];
  }

  const results = [];
  const baseRefKey = `${type}_${student.id}_${getTodayEgypt()}`;

  const sendTo = template.sent_to || "parents";
  const phones = [];

  if (sendTo === "parents" || sendTo === "both") {
    if (student.parent_phone) {
      phones.push({ phone: student.parent_phone, recipient: "parent" });
    }
  }

  if (sendTo === "both") {
    if (student.phone) {
      phones.push({ phone: student.phone, recipient: "student" });
    }
  }

  for (const phoneInfo of phones) {
    const message = messageData.message;
    const refKey = `${baseRefKey}_${phoneInfo.recipient}`;

    const result = await enqueueMessage({
      student_id: student.id,
      type,
      phone: phoneInfo.phone,
      recipient: phoneInfo.recipient,
      message,
      ref_key: refKey,
    });

    results.push(result);
  }

  if (results.length === 0) {
    return [
      { inserted: false, error: "No phone numbers available", skipped: true },
    ];
  }

  return results;
}

async function dispatchMessage(messageId) {
  const result = await query(
    `
    SELECT 
      m.*,
      s.full_name,
      s.barcode,
      s.parent_token,
      s.phone AS student_phone,
      s.parent_phone
    FROM messages m
    LEFT JOIN students s ON m.student_id = s.id
    WHERE m.id = $1
  `,
    [messageId],
  );

  const message = result.rows[0];
  if (!message) {
    return { success: false, error: "Message not found" };
  }

  if (message.status !== "pending") {
    return { success: false, error: `Message status is ${message.status}` };
  }

  const template = await getTemplateByType(message.type);
  if (!template || Number(template.is_active) !== 1) {
    await markFailed(message.id, "Template inactive");
    return { success: false, skipped: true, error: "Template inactive" };
  }

  const student = {
    id: message.student_id,
    full_name: message.full_name,
    name: message.full_name,
    barcode: message.barcode,
    parent_token: message.parent_token,
    phone: message.student_phone,
    parent_phone: message.parent_phone,
  };

  let sendResult;

  switch (message.type) {
    case "welcome":
      sendResult = await whatsappClient.sendWelcomeMsg(student, message.phone);
      break;
    case "absence":
      let date = "";
      try {
        if (message.params) {
          const parsed = JSON.parse(message.params);
          date = parsed.date || "";
        }
      } catch {
        date = "";
      }
      sendResult = await whatsappClient.sendAbsentMsg(
        student,
        message.phone,
        date,
      );
      break;
    case "payment":
      let paymentData = {};
      try {
        if (message.params) {
          paymentData = JSON.parse(message.params);
        }
      } catch {}
      sendResult = await whatsappClient.sendPaymentMsg(
        student,
        message.phone,
        paymentData,
      );
      break;
    case "exam":
      let examData = {};
      try {
        if (message.params) {
          examData = JSON.parse(message.params);
        }
      } catch {}
      sendResult = await whatsappClient.sendExamMsg(
        student,
        message.phone,
        examData,
      );
      break;
    default:
      sendResult = { success: false, error: "Unknown message type" };
  }

  if (sendResult?.success) {
    await markSent(message.id, sendResult.id);
    return sendResult;
  } else {
    await markFailed(message.id, sendResult?.error || "Send failed");
    return sendResult;
  }
}

async function markSent(id, messageId) {
  await query(
    `
    UPDATE messages 
    SET status = 'sent', 
        sent_at = NOW() AT TIME ZONE 'Africa/Cairo',
        message_id = $2,
        attempts = attempts + 1,
        updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
    WHERE id = $1
  `,
    [id, messageId],
  );
}

async function markFailed(id, error) {
  await query(
    `
    UPDATE messages 
    SET status = 'failed', 
        error_message = $2,
        attempts = attempts + 1,
        updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
    WHERE id = $1
  `,
    [id, error?.slice(0, 500) || "Unknown error"],
  );
}

async function sendQueue({ limit = 5 } = {}) {
  const settings = await getWhatsappSettings();
  const sentToday = await getTodaySentCount();
  const dailyLimit = settings.whatsapp_daily_limit || 250;

  if (sentToday >= dailyLimit) {
    return {
      success: true,
      sent: 0,
      failed: 0,
      total: 0,
      dailyLimitReached: true,
    };
  }

  const availableSlots = dailyLimit - sentToday;

  await query(
    `
    UPDATE messages 
    SET status = 'pending', updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
    WHERE id IN (
      SELECT id FROM messages 
      WHERE status = 'scheduled'
      ORDER BY created_at ASC
      LIMIT $1
    )
    `,
    [availableSlots],
  );

  const maxToSend = Math.min(limit, availableSlots);

  const result = await query(
    `
    SELECT id FROM messages 
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT $1
  `,
    [maxToSend],
  );

  const pendingMessages = result.rows;
  if (pendingMessages.length === 0) {
    return { success: true, sent: 0, failed: 0, total: 0 };
  }

  let sent = 0;
  let failed = 0;
  const delaySeconds = settings.whatsapp_delay_seconds || 45;

  for (let i = 0; i < pendingMessages.length; i++) {
    const dispatchResult = await dispatchMessage(pendingMessages[i].id);
    if (dispatchResult?.success) sent++;
    else failed++;

    if (i < pendingMessages.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
    }
  }

  return { success: true, sent, failed, total: pendingMessages.length };
}

async function getStats() {
  const settings = await getWhatsappSettings();
  const sentToday = await getTodaySentCount();

  const statsResult = await query(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) AS scheduled,
      SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed,
      SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
      SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) AS read
    FROM messages
  `);

  return {
    ...statsResult.rows[0],
    sent_today: sentToday,
    daily_limit: settings.whatsapp_daily_limit,
    remaining_today: Math.max(0, settings.whatsapp_daily_limit - sentToday),
    delay_seconds: settings.whatsapp_delay_seconds,
  };
}

async function getMessageById(id) {
  const result = await query(
    `
    SELECT 
      m.*,
      s.full_name,
      s.barcode
    FROM messages m
    LEFT JOIN students s ON m.student_id = s.id
    WHERE m.id = $1
  `,
    [id],
  );
  return result.rows[0];
}

async function resetFailed() {
  const result = await query(`
    UPDATE messages 
    SET status = 'pending', 
        error_message = NULL,
        updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
    WHERE status = 'failed' AND attempts < 3
    RETURNING id
  `);
  return result.rows;
}

module.exports = {
  enqueueMessage,
  enqueueForStudentAndParent,
  dispatchMessage,
  sendQueue,
  getStats,
  resetFailed,
  markSent,
  markFailed,
  getMessageById,
  getTemplateByType,
  getAllTemplates,
  generateWelcomeMessage,
  generateAbsenceMessage,
  generatePaymentMessage,
  generateExamMessage,
};
