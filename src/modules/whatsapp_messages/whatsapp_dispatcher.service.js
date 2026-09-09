// src/modules/whatsapp_messages/whatsapp_dispatcher.service.js
const { query } = require("../../config/database");
const whatsappClient = require("../../utils/whatsappClient");
const { messages } = require("../../constants/messages");
const { formatEgyptTime, getTodayEgypt } = require("../../utils/timezone");

// ============ Queue System ============
let messageQueue = [];
let processingQueue = false;

// ============ Helper Functions ============

async function getWhatsappSettings() {
  const result = await query(
    "SELECT whatsapp_daily_limit, whatsapp_delay_seconds FROM settings WHERE id = 1",
  );
  return (
    result.rows[0] || { whatsapp_daily_limit: 250, whatsapp_delay_seconds: 2 }
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

// ✅ التحقق من إن الوقت الحالي في الفترة المسموحة (7 صباحًا - 11 مساءً)
function isWithinSendingHours() {
  const now = new Date();
  const egyptTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );
  const hour = egyptTime.getHours();

  // من 7 صباحًا إلى 11 مساءً
  return hour >= 7 && hour < 23;
}

// ✅ حساب الوقت المتبقي لحد 7 الصباح
function getMillisecondsUntilMorning() {
  const now = new Date();
  const egyptTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );
  const tomorrow = new Date(egyptTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);

  return tomorrow.getTime() - egyptTime.getTime();
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

// ============ Message Generators ============

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
  return messages.payment(
    student.full_name,
    paymentData.month || "غير محدد",
    paymentData.year || new Date().getFullYear(),
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

// ============ Queue Processing ============

// ✅ الـ Queue الرئيسي - بيبعت رسالة رسالة مع delay
async function processQueueWithDelay() {
  if (processingQueue) return;
  processingQueue = true;

  const settings = await getWhatsappSettings();
  const delaySeconds = settings.whatsapp_delay_seconds || 2;

  while (messageQueue.length > 0) {
    // ✅ التحقق من الوقت - لو بره الفترة المسموحة نوقف
    if (!isWithinSendingHours()) {
      console.log("خارج وقت الإرسال المسموح - نستنى لـ 7 الصبح");

      // إعادة الرسائل المتبقية لـ scheduled
      if (messageQueue.length > 0) {
        await query(
          `UPDATE messages SET status = 'scheduled' WHERE id = ANY($1)`,
          [messageQueue],
        );
        messageQueue = [];
      }

      // جدولة استئناف الإرسال الساعة 7 الصبح
      setTimeout(() => {
        processScheduledMessages();
      }, getMillisecondsUntilMorning());

      break;
    }

    // ✅ التحقق من الـ Daily Limit
    const sentToday = await getTodaySentCount();

    if (sentToday >= settings.whatsapp_daily_limit) {
      console.log("الـ Daily Limit اكتمل - نستنى لبكرة");

      // إعادة الرسائل المتبقية لـ scheduled
      if (messageQueue.length > 0) {
        await query(
          `UPDATE messages SET status = 'scheduled' WHERE id = ANY($1)`,
          [messageQueue],
        );
        messageQueue = [];
      }

      // جدولة لبكرة 7 الصبح
      setTimeout(() => {
        processScheduledMessages();
      }, getMillisecondsUntilMorning());

      break;
    }

    const messageId = messageQueue.shift();

    try {
      await dispatchMessage(messageId);
    } catch (error) {
      console.error("Error dispatching message:", error);
    }

    // ✅ delay من الإعدادات (افتراضي 2 ثانية)
    if (messageQueue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
    }
  }

  processingQueue = false;
}

// ✅ معالجة الرسائل المؤجلة (scheduled)
async function processScheduledMessages() {
  // التحقق من الوقت أولاً
  if (!isWithinSendingHours()) {
    setTimeout(() => {
      processScheduledMessages();
    }, getMillisecondsUntilMorning());
    return;
  }

  const sentToday = await getTodaySentCount();
  const settings = await getWhatsappSettings();

  if (sentToday >= settings.whatsapp_daily_limit) {
    setTimeout(() => {
      processScheduledMessages();
    }, getMillisecondsUntilMorning());
    return;
  }

  const available = settings.whatsapp_daily_limit - sentToday;

  // تحويل رسائل scheduled إلى pending
  const result = await query(
    `
    UPDATE messages 
    SET status = 'pending', updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
    WHERE id IN (
      SELECT id FROM messages 
      WHERE status = 'scheduled'
      ORDER BY created_at ASC
      LIMIT $1
    )
    RETURNING id
  `,
    [available],
  );

  if (result.rows.length > 0) {
    result.rows.forEach((row) => messageQueue.push(row.id));
    processQueueWithDelay();
  }
}

// ============ Message Enqueueing ============

async function enqueueMessage(messageData) {
  const { student_id, type, phone, recipient, message, ref_key, params } =
    messageData;

  if (!phone) {
    return { inserted: false, error: "Phone number required" };
  }

  const template = await getTemplateByType(type);
  if (!template || Number(template.is_active) !== 1) {
    return { inserted: false, error: "Template inactive", skipped: true };
  }

  if (ref_key) {
    const existing = await query("SELECT id FROM messages WHERE ref_key = $1", [
      ref_key,
    ]);
    if (existing.rows.length > 0) {
      return { inserted: false, id: existing.rows[0].id, message: "Duplicate" };
    }
  }

  const settings = await getWhatsappSettings();
  const sentToday = await getTodaySentCount();

  // ✅ تحديد حالة الرسالة
  let status;
  if (sentToday >= settings.whatsapp_daily_limit) {
    status = "scheduled"; // الـ Daily Limit اكتمل
  } else {
    status = "pending"; // جاهزة للإرسال
  }

  const paramsJson = params ? JSON.stringify(params) : null;

  const result = await query(
    `INSERT INTO messages (student_id, phone, message, type, recipient, ref_key, status, params, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() AT TIME ZONE 'Africa/Cairo', NOW() AT TIME ZONE 'Africa/Cairo')
     RETURNING id, status`,
    [student_id, phone, message, type, recipient, ref_key, status, paramsJson],
  );

  // ✅ لو الرسالة pending → نضيفها للـ Queue
  if (status === "pending") {
    messageQueue.push(result.rows[0].id);
    processQueueWithDelay();
  }

  return {
    inserted: true,
    id: result.rows[0].id,
    scheduled: status === "scheduled",
  };
}

async function enqueueForStudentAndParent(student, type, messageData) {
  const template = await getTemplateByType(type);

  if (!template || Number(template.is_active) !== 1) {
    return [
      {
        inserted: false,
        error: "Template inactive",
        skipped: true,
      },
    ];
  }

  const results = [];
  const baseRefKey = `${type}_${student.id}_${getTodayEgypt()}`;

  const sendTo = template.sent_to || "parents";
  const phones = [];

  if (sendTo === "parents" || sendTo === "both") {
    if (student.parent_phone) {
      phones.push({
        phone: student.parent_phone,
        recipient: "parent",
      });
    }
  }

  if (sendTo === "both") {
    if (student.phone) {
      phones.push({
        phone: student.phone,
        recipient: "student",
      });
    }
  }

  for (const phoneInfo of phones) {
    const message = messageData.message;
    const refKey = `${baseRefKey}_${phoneInfo.recipient}`;

    let params = null;

    switch (type) {
      case "payment":
        params = messageData.paymentData || null;
        break;
      case "exam":
        params = messageData.examData || null;
        break;
      case "absence":
        params = messageData.date ? { date: messageData.date } : null;
        break;
      default:
        params = null;
    }

    const result = await enqueueMessage({
      student_id: student.id,
      type,
      phone: phoneInfo.phone,
      recipient: phoneInfo.recipient,
      message,
      ref_key: refKey,
      params,
    });

    results.push(result);
  }

  if (results.length === 0) {
    return [
      {
        inserted: false,
        error: "No phone numbers available",
        skipped: true,
      },
    ];
  }

  return results;
}

// ============ Message Dispatching ============

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

  let params = {};
  try {
    if (message.params) {
      params =
        typeof message.params === "string"
          ? JSON.parse(message.params)
          : message.params;
    }
  } catch (e) {
    console.error("[WhatsApp] Failed to parse params:", e);
    params = {};
  }

  switch (message.type) {
    case "welcome":
      sendResult = await whatsappClient.sendWelcomeMsg(student, message.phone);
      break;
    case "absence":
      const date = params.date || "";
      sendResult = await whatsappClient.sendAbsentMsg(
        student,
        message.phone,
        date,
      );
      break;
    case "payment":
      const paymentData = {
        month: params.month || "غير محدد",
        year: params.year || new Date().getFullYear(),
        amount: params.amount || 0,
      };
      sendResult = await whatsappClient.sendPaymentMsg(
        student,
        message.phone,
        paymentData,
      );
      break;
    case "exam":
      const examData = {
        score: params.score || 0,
        fullMark: params.fullMark || 100,
        date: params.date || "غير محدد",
        day: params.day || "غير محدد",
      };
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

// ============ Status Updates ============

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

// ============ Public API ============

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
  const delaySeconds = settings.whatsapp_delay_seconds || 2;

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

  if (result.rows.length > 0) {
    result.rows.forEach((row) => messageQueue.push(row.id));
    processQueueWithDelay();
  }

  return result.rows;
}

// ✅ بدء النظام
function startSystem() {
  console.log("WhatsApp system started");
  console.log(`Sending hours: 7:00 AM - 11:00 PM`);
  console.log(`Delay between messages: ${2} seconds (default)`);

  // ✅ معالجة الرسائل المؤجلة فورًا
  processScheduledMessages();

  // ✅ إعادة المحاولة كل 30 دقيقة
  setInterval(
    () => {
      if (isWithinSendingHours()) {
        processScheduledMessages();
      }
    },
    30 * 60 * 1000,
  );
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
  startSystem,
};
