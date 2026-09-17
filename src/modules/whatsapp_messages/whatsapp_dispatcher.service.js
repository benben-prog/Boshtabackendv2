// src/modules/whatsapp_messages/whatsapp_dispatcher.service.js
const { query } = require("../../config/database");
const whatsappClient = require("../../utils/whatsappClient");
const { messages } = require("../../constants/messages");
const {
  formatEgyptTime,
  getTodayEgypt,
  getNowEgypt,
} = require("../../utils/timezone");

// ============================================
// CONSTANTS
// ============================================

const SENDING_HOUR_START = 7;
const SENDING_HOUR_END = 23;
const MAX_RETRY_ATTEMPTS = 3;
const QUEUE_PROCESSING_LOCK_TIMEOUT = 5 * 60 * 1000;
const PROCESS_INTERVAL_MS = 60 * 1000;
const LOAD_BATCH_SIZE = 50;
const MAX_QUEUE_SIZE = 500;

// Message statuses
const STATUS = {
  PENDING: "pending",      // الرسالة في الطابور
  SENT: "sent",            // تم إرسالها من WhatsApp API
  FAILED: "failed",        // فشل الإرسال
  SKIPPED: "skipped",      // تم تخطيها (رقم خاطئ، قالب معطل، الخ)
  DELIVERED: "delivered",  // وصلت للمستقبل (من webhook)
  READ: "read",            // قُرئت (من webhook)
};

// Priority order for message types (lower = higher priority)
const TYPE_PRIORITY_SQL = `
  CASE 
    WHEN type = 'absence' THEN 1
    WHEN type = 'exam' THEN 2
    WHEN type = 'payment' THEN 3
    WHEN type = 'welcome' THEN 4
    ELSE 5
  END
`;

// ============================================
// STATE
// ============================================

let messageQueue = [];
let processingQueue = false;
let lastProcessingStart = null;
let intervalId = null;
let isStarted = false;

let sentTodayCounter = 0;
let sentTodayDate = null;
let dailyLimitReached = false;

// ============================================
// HELPER: Daily Counter Management
// ============================================

function resetDailyCounterIfNeeded() {
  const today = getTodayEgypt();

  if (sentTodayDate !== today) {
    sentTodayCounter = 0;
    sentTodayDate = today;
    dailyLimitReached = false;
    console.log(`[WhatsApp] Daily counter reset for ${today}`);
  }
}

function getSentTodayCount() {
  resetDailyCounterIfNeeded();
  return sentTodayCounter;
}

function incrementSentCounter() {
  resetDailyCounterIfNeeded();
  sentTodayCounter++;
}

// ============================================
// HELPER: Get WhatsApp Settings
// ============================================

async function getWhatsappSettings() {
  const result = await query(
    "SELECT whatsapp_daily_limit, whatsapp_delay_seconds FROM settings WHERE id = 1",
  );
  return (
    result.rows[0] || { whatsapp_daily_limit: 250, whatsapp_delay_seconds: 2 }
  );
}

// ============================================
// HELPER: Get Today's Sent Count from DB
// ============================================

async function getTodaySentCountFromDB() {
  const result = await query(
    `SELECT COUNT(*) AS count
     FROM messages
     WHERE status = $1
       AND DATE(sent_at AT TIME ZONE 'Africa/Cairo') = DATE(NOW() AT TIME ZONE 'Africa/Cairo')`,
    [STATUS.SENT],
  );
  return parseInt(result.rows[0]?.count || 0);
}

// ============================================
// HELPER: Check if within sending hours
// ============================================

function isWithinSendingHours() {
  const now = getNowEgypt();
  const hour = now.getHours();
  return hour >= SENDING_HOUR_START && hour < SENDING_HOUR_END;
}

// ============================================
// HELPER: Get milliseconds until next morning
// ============================================

function getMillisecondsUntilMorning() {
  const now = getNowEgypt();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(SENDING_HOUR_START, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}

// ============================================
// HELPER: Get Template by Type
// ============================================

async function getTemplateByType(type) {
  const result = await query(
    `SELECT id, type, template, is_active, sent_to, delay
     FROM whatsapp_messages
     WHERE type = $1`,
    [type],
  );
  return result.rows[0];
}

// ============================================
// HELPER: Get All Templates
// ============================================

async function getAllTemplates() {
  const result = await query(
    `SELECT id, type, template, is_active, sent_to, delay, created_at, updated_at
     FROM whatsapp_messages
     ORDER BY created_at DESC`,
  );
  return result.rows;
}

// ============================================
// MESSAGE GENERATORS
// ============================================

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

// ============================================
// QUEUE: Load pending messages from DB (with priority ordering)
// ============================================

async function loadPendingMessages(limit = LOAD_BATCH_SIZE) {
  const result = await query(
    `SELECT id FROM messages
     WHERE status = $1
     ORDER BY ${TYPE_PRIORITY_SQL} ASC, created_at ASC
     LIMIT $2`,
    [STATUS.PENDING, limit],
  );
  return result.rows.map((row) => row.id);
}

// ============================================
// QUEUE: Refresh queue from DB
// ============================================

async function refreshQueueFromDB() {
  try {
    if (messageQueue.length >= MAX_QUEUE_SIZE) {
      return 0;
    }

    const queuedIds = new Set(messageQueue);
    const pendingIds = await loadPendingMessages(LOAD_BATCH_SIZE);

    let addedCount = 0;
    for (const id of pendingIds) {
      if (!queuedIds.has(id)) {
        messageQueue.push(id);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      console.log(
        `[WhatsApp Queue] Added ${addedCount} new messages (queue size: ${messageQueue.length})`,
      );
    }

    return addedCount;
  } catch (error) {
    console.error("[WhatsApp Queue] Error refreshing queue:", error.message);
    return 0;
  }
}

// ============================================
// QUEUE: Process messages with delay
// ============================================

async function processQueueWithDelay() {
  if (processingQueue) {
    return;
  }

  if (
    lastProcessingStart &&
    Date.now() - lastProcessingStart > QUEUE_PROCESSING_LOCK_TIMEOUT
  ) {
    console.log("[WhatsApp Queue] Stale lock detected, resetting");
    processingQueue = false;
  }

  if (messageQueue.length === 0) {
    return;
  }

  processingQueue = true;
  lastProcessingStart = Date.now();

  try {
    const settings = await getWhatsappSettings();
    const delaySeconds = settings.whatsapp_delay_seconds || 2;

    console.log(
      `[WhatsApp Queue] Starting processing (${messageQueue.length} messages in queue)`,
    );

    while (messageQueue.length > 0) {
      // Check sending hours
      if (!isWithinSendingHours()) {
        console.log(
          "[WhatsApp Queue] Outside sending hours, stopping processing (messages remain pending)",
        );
        break;
      }

      // Check daily limit from memory
      const sentToday = getSentTodayCount();

      if (sentToday >= settings.whatsapp_daily_limit) {
        console.log(
          `[WhatsApp Queue] Daily limit reached (${sentToday}/${settings.whatsapp_daily_limit}), stopping processing (messages remain pending)`,
        );

        dailyLimitReached = true;
        break;
      }

      const messageId = messageQueue.shift();

      try {
        await dispatchMessage(messageId);
      } catch (error) {
        console.error(
          `[WhatsApp Queue] Error dispatching message ${messageId}:`,
          error.message,
        );
      }

      if (messageQueue.length > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, delaySeconds * 1000),
        );
      }
    }

    console.log("[WhatsApp Queue] Processing finished");
  } finally {
    processingQueue = false;
    lastProcessingStart = null;
  }
}

// ============================================
// QUEUE: Enqueue single message
// ============================================

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
      return {
        inserted: false,
        id: existing.rows[0].id,
        message: "Duplicate",
      };
    }
  }

  const paramsJson = params ? JSON.stringify(params) : null;

  const result = await query(
    `INSERT INTO messages 
     (student_id, phone, message, type, recipient, ref_key, status, params, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 
       NOW() AT TIME ZONE 'Africa/Cairo', 
       NOW() AT TIME ZONE 'Africa/Cairo')
     RETURNING id, status`,
    [student_id, phone, message, type, recipient, ref_key, STATUS.PENDING, paramsJson],
  );

  // Push to in-memory queue and try to process if not already
  if (!messageQueue.includes(result.rows[0].id)) {
    messageQueue.push(result.rows[0].id);
  }
  if (!processingQueue) {
    processQueueWithDelay();
  }

  return {
    inserted: true,
    id: result.rows[0].id,
  };
}

// ============================================
// QUEUE: Enqueue for student and parent
// ============================================

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

  if (phones.length === 0) {
    return [
      {
        inserted: false,
        error: "No phone numbers available",
        skipped: true,
      },
    ];
  }

  const results = [];
  const baseRefKey = `${type}_${student.id}_${getTodayEgypt()}`;

  for (const phoneInfo of phones) {
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
    }

    const result = await enqueueMessage({
      student_id: student.id,
      type,
      phone: phoneInfo.phone,
      recipient: phoneInfo.recipient,
      message: messageData.message,
      ref_key: refKey,
      params,
    });

    results.push(result);
  }

  return results;
}

// ============================================
// DISPATCH: Send single message
// ============================================

async function dispatchMessage(messageId) {
  const result = await query(
    `SELECT 
       m.*,
       s.full_name,
       s.barcode,
       s.parent_token,
       s.phone AS student_phone,
       s.parent_phone
     FROM messages m
     LEFT JOIN students s ON m.student_id = s.id
     WHERE m.id = $1`,
    [messageId],
  );

  const message = result.rows[0];
  if (!message) {
    console.error(`[WhatsApp] Message not found: ${messageId}`);
    return { success: false, error: "Message not found" };
  }

  // ========================================
  // 1. STATUS CHECK: يجب أن تكون pending فقط
  // ========================================
  if (message.status !== STATUS.PENDING) {
    const errorMsg = `Message already in status: ${message.status}`;
    console.warn(`[WhatsApp] ${errorMsg} (ID: ${messageId})`);
    return { success: false, error: errorMsg };
  }

  // ========================================
  // 2. TEMPLATE CHECK: القالب يجب أن يكون مفعل
  // ========================================
  const template = await getTemplateByType(message.type);
  if (!template || Number(template.is_active) !== 1) {
    const errorMsg = "Template inactive or not found";
    console.warn(`[WhatsApp] ${errorMsg} (ID: ${messageId}, Type: ${message.type})`);
    await markSkipped(message.id, errorMsg);
    return { success: false, skipped: true, error: errorMsg };
  }

  // ========================================
  // 3. PHONE CHECK: يجب أن يكون هناك رقم صحيح
  // ========================================
  if (!message.phone || !message.phone.trim()) {
    const errorMsg = "No phone number provided";
    console.warn(`[WhatsApp] ${errorMsg} (ID: ${messageId})`);
    await markSkipped(message.id, errorMsg);
    return { success: false, skipped: true, error: errorMsg };
  }

  // ========================================
  // 4. BUILD STUDENT OBJECT
  // ========================================
  const student = {
    id: message.student_id,
    full_name: message.full_name || "-",
    name: message.full_name || "-",
    barcode: message.barcode || "-",
    parent_token: message.parent_token || "-",
    phone: message.student_phone,
    parent_phone: message.parent_phone,
  };

  // ========================================
  // 5. PARSE PARAMS
  // ========================================
  let params = {};
  try {
    if (message.params) {
      params =
        typeof message.params === "string"
          ? JSON.parse(message.params)
          : message.params;
    }
  } catch (e) {
    console.error(`[WhatsApp] Failed to parse params (ID: ${messageId}):`, e.message);
    params = {};
  }

  // ========================================
  // 6. SEND MESSAGE (الإرسال الفعلي)
  // ========================================
  let sendResult;
  try {
    switch (message.type) {
      case "welcome":
        sendResult = await whatsappClient.sendWelcomeMsg(student, message.phone);
        break;

      case "absence":
        sendResult = await whatsappClient.sendAbsentMsg(
          student,
          message.phone,
          params.date || "",
        );
        break;

      case "payment":
        sendResult = await whatsappClient.sendPaymentMsg(student, message.phone, {
          month: params.month || "غير محدد",
          year: params.year || new Date().getFullYear(),
          amount: params.amount || 0,
        });
        break;

      case "exam":
        sendResult = await whatsappClient.sendExamMsg(student, message.phone, {
          score: params.score || 0,
          fullMark: params.fullMark || 100,
          date: params.date || "غير محدد",
          day: params.day || "غير محدد",
        });
        break;

      default:
        sendResult = { success: false, error: "Unknown message type" };
    }
  } catch (error) {
    console.error(`[WhatsApp] Exception while sending (ID: ${messageId}):`, error.message);
    sendResult = { success: false, error: error.message };
  }

  // ========================================
  // 7. HANDLE RESULT
  // ========================================
  if (!sendResult) {
    const errorMsg = "No response from WhatsApp client";
    console.error(`[WhatsApp] ${errorMsg} (ID: ${messageId})`);
    await markFailed(message.id, errorMsg);
    return { success: false, error: errorMsg };
  }

  // ✅ SUCCESS: الرسالة تم إرسالها بنجاح
  if (sendResult.success && sendResult.id) {
    console.log(
      `[WhatsApp] Message sent successfully (ID: ${messageId}, API ID: ${sendResult.id})`,
    );
    await markSent(message.id, sendResult.id);
    incrementSentCounter();
    return {
      success: true,
      id: sendResult.id,
      messageId,
    };
  }

  // ❌ SKIPPED: إذا كانت مشكلة في الرقم أو القالب
  if (sendResult.skipped) {
    console.warn(
      `[WhatsApp] Message skipped (ID: ${messageId}): ${sendResult.error}`,
    );
    await markSkipped(message.id, sendResult.error);
    return { success: false, skipped: true, error: sendResult.error };
  }

  // ❌ FAILED: فشل الإرسال من API
  const errorMsg = sendResult.error || "Unknown error";
  console.error(
    `[WhatsApp] Message failed (ID: ${messageId}): ${errorMsg}`,
  );
  await markFailed(message.id, errorMsg);
  return { success: false, error: errorMsg };
}

// ============================================
// STATUS: Mark message as SENT
// ✅ يُستخدم فقط عندما يكون لدينا message_id من API
// ============================================

async function markSent(id, messageId) {
  if (!messageId || typeof messageId !== "string") {
    throw new Error(
      `Cannot mark sent without valid message_id (got: ${messageId})`,
    );
  }

  await query(
    `UPDATE messages 
     SET status = $1, 
         sent_at = NOW() AT TIME ZONE 'Africa/Cairo',
         message_id = $2,
         attempts = attempts + 1,
         error_message = NULL,
         updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
     WHERE id = $3`,
    [STATUS.SENT, messageId, id],
  );

  console.log(`[WhatsApp DB] Marked as SENT (ID: ${id}, API ID: ${messageId})`);
}

// ============================================
// STATUS: Mark message as FAILED
// ❌ يُستخدم عن��ما يفشل الإرسال
// ============================================

async function markFailed(id, error) {
  const errorTruncated = (error || "Unknown error").slice(0, 500);

  await query(
    `UPDATE messages 
     SET status = $1, 
         error_message = $2,
         attempts = attempts + 1,
         updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
     WHERE id = $3`,
    [STATUS.FAILED, errorTruncated, id],
  );

  console.log(`[WhatsApp DB] Marked as FAILED (ID: ${id}): ${errorTruncated}`);
}

// ============================================
// STATUS: Mark message as SKIPPED
// ⊘ يُستخدم عندما لا يتم محاولة الإرسال
// ============================================

async function markSkipped(id, reason) {
  const reasonTruncated = (reason || "Unknown reason").slice(0, 500);

  await query(
    `UPDATE messages 
     SET status = $1, 
         error_message = $2,
         updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
     WHERE id = $3`,
    [STATUS.SKIPPED, reasonTruncated, id],
  );

  console.log(`[WhatsApp DB] Marked as SKIPPED (ID: ${id}): ${reasonTruncated}`);
}

// ============================================
// PUBLIC: Send queue manually
// ============================================

async function sendQueue({ limit = 5 } = {}) {
  const settings = await getWhatsappSettings();
  const sentToday = getSentTodayCount();
  const dailyLimit = settings.whatsapp_daily_limit || 250;

  if (sentToday >= dailyLimit) {
    return {
      success: true,
      sent: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      dailyLimitReached: true,
    };
  }

  const availableSlots = dailyLimit - sentToday;
  const maxToSend = Math.min(limit, availableSlots);

  const result = await query(
    `SELECT id FROM messages 
     WHERE status = $1
     ORDER BY ${TYPE_PRIORITY_SQL} ASC, created_at ASC
     LIMIT $2`,
    [STATUS.PENDING, maxToSend],
  );

  const pendingMessages = result.rows;
  if (pendingMessages.length === 0) {
    return { success: true, sent: 0, failed: 0, skipped: 0, total: 0 };
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const delaySeconds = settings.whatsapp_delay_seconds || 2;

  for (let i = 0; i < pendingMessages.length; i++) {
    const dispatchResult = await dispatchMessage(pendingMessages[i].id);

    if (dispatchResult?.success) sent++;
    else if (dispatchResult?.skipped) skipped++;
    else failed++;

    if (i < pendingMessages.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
    }
  }

  return { success: true, sent, failed, skipped, total: pendingMessages.length };
}

// ============================================
// PUBLIC: Get stats
// ============================================

async function getStats() {
  const settings = await getWhatsappSettings();
  const sentToday = getSentTodayCount();

  const statsResult = await query(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = $2 THEN 1 ELSE 0 END) AS sent,
      SUM(CASE WHEN status = $3 THEN 1 ELSE 0 END) AS failed,
      SUM(CASE WHEN status = $4 THEN 1 ELSE 0 END) AS skipped,
      SUM(CASE WHEN status = $5 THEN 1 ELSE 0 END) AS delivered,
      SUM(CASE WHEN status = $6 THEN 1 ELSE 0 END) AS read
    FROM messages
  `, [STATUS.PENDING, STATUS.SENT, STATUS.FAILED, STATUS.SKIPPED, 'delivered', 'read']);

  return {
    ...statsResult.rows[0],
    sent_today: sentToday,
    daily_limit: settings.whatsapp_daily_limit,
    remaining_today: Math.max(0, settings.whatsapp_daily_limit - sentToday),
    delay_seconds: settings.whatsapp_delay_seconds,
    queue_size: messageQueue.length,
    is_processing: processingQueue,
    is_started: isStarted,
    daily_limit_reached: dailyLimitReached,
  };
}

// ============================================
// PUBLIC: Get message by ID
// ============================================

async function getMessageById(id) {
  const result = await query(
    `SELECT 
       m.*,
       s.full_name,
       s.barcode
     FROM messages m
     LEFT JOIN students s ON m.student_id = s.id
     WHERE m.id = $1`,
    [id],
  );
  return result.rows[0];
}

// ============================================
// PUBLIC: Reset failed messages
// ============================================

async function resetFailed() {
  const result = await query(
    `UPDATE messages 
     SET status = $1, 
         error_message = NULL,
         updated_at = NOW() AT TIME ZONE 'Africa/Cairo'
     WHERE status = $2 AND attempts < $3
     RETURNING id`,
    [STATUS.PENDING, STATUS.FAILED, MAX_RETRY_ATTEMPTS],
  );

  if (result.rows.length > 0) {
    result.rows.forEach((row) => {
      if (!messageQueue.includes(row.id)) {
        messageQueue.push(row.id);
      }
    });

    if (!processingQueue) {
      processQueueWithDelay();
    }
  }

  return result.rows;
}

// ============================================
// PUBLIC: Force process
// ============================================

async function forceProcess() {
  console.log("[WhatsApp Queue] Force process triggered");

  resetDailyCounterIfNeeded();

  const settings = await getWhatsappSettings();
  const sentToday = getSentTodayCount();

  if (sentToday < settings.whatsapp_daily_limit) {
    dailyLimitReached = false;
  }

  await refreshQueueFromDB();

  if (messageQueue.length > 0 && !processingQueue && !dailyLimitReached) {
    await processQueueWithDelay();
  }

  return {
    queue_size: messageQueue.length,
    is_processing: processingQueue,
    sent_today: getSentTodayCount(),
    daily_limit_reached: dailyLimitReached,
  };
}

// ============================================
// PUBLIC: Start system
// ============================================

async function startSystem() {
  if (isStarted) {
    console.log("[WhatsApp] System already started");
    return;
  }

  isStarted = true;

  console.log("============================================");
  console.log("[WhatsApp] System starting...");
  console.log(
    `[WhatsApp] Sending hours: ${SENDING_HOUR_START}:00 - ${SENDING_HOUR_END}:00`,
  );
  console.log(`[WhatsApp] Max retry attempts: ${MAX_RETRY_ATTEMPTS}`);
  console.log(`[WhatsApp] Process interval: ${PROCESS_INTERVAL_MS / 1000}s`);
  console.log(
    `[WhatsApp] Priority: absence > exam > payment > welcome > custom`,
  );
  console.log(
    `[WhatsApp] Message statuses: pending | sent | failed | skipped | delivered | read`,
  );
  console.log("============================================");

  try {
    const sentCount = await getTodaySentCountFromDB();
    sentTodayCounter = sentCount;
    sentTodayDate = getTodayEgypt();
    console.log(`[WhatsApp] Loaded today's sent count: ${sentCount}`);
  } catch (error) {
    console.error("[WhatsApp] Failed to load sent count:", error.message);
    sentTodayCounter = 0;
    sentTodayDate = getTodayEgypt();
  }

  const settings = await getWhatsappSettings();

  if (sentTodayCounter >= settings.whatsapp_daily_limit) {
    dailyLimitReached = true;
    console.log(
      `[WhatsApp] Daily limit already reached (${sentTodayCounter}/${settings.whatsapp_daily_limit})`,
    );
    console.log("[WhatsApp] Will resume tomorrow at 7:00 AM");

    const msUntilMorning = getMillisecondsUntilMorning();
    const minutesUntilMorning = Math.round(msUntilMorning / 1000 / 60);
    console.log(
      `[WhatsApp] Next check in ${minutesUntilMorning} minutes (tomorrow 7:00 AM)`,
    );

    setTimeout(async () => {
      console.log("[WhatsApp] New day started, resetting daily counter");
      resetDailyCounterIfNeeded();

      try {
        const newCount = await getTodaySentCountFromDB();
        sentTodayCounter = newCount;
        console.log(`[WhatsApp] New day's sent count: ${newCount}`);
      } catch (error) {
        console.error("[WhatsApp] Failed to reload sent count:", error.message);
      }

      dailyLimitReached = false;
      await refreshQueueFromDB();

      if (messageQueue.length > 0 && !processingQueue) {
        processQueueWithDelay();
      }
    }, msUntilMorning);
  } else {
    await refreshQueueFromDB();

    if (messageQueue.length > 0 && !processingQueue) {
      processQueueWithDelay();
    }
  }

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(async () => {
    resetDailyCounterIfNeeded();

    if (!isWithinSendingHours()) {
      return;
    }

    const currentSent = getSentTodayCount();
    const currentSettings = await getWhatsappSettings();

    if (
      dailyLimitReached &&
      currentSent < currentSettings.whatsapp_daily_limit
    ) {
      console.log("[WhatsApp] Daily limit reset - resuming message sending");
      dailyLimitReached = false;
    }

    if (dailyLimitReached) {
      return;
    }

    try {
      await refreshQueueFromDB();

      if (messageQueue.length > 0 && !processingQueue) {
        processQueueWithDelay();
      }
    } catch (error) {
      console.error("[WhatsApp] Periodic refresh error:", error.message);
    }
  }, PROCESS_INTERVAL_MS);

  console.log("[WhatsApp] System started successfully");
}

// ============================================
// PUBLIC: Stop system
// ============================================

function stopSystem() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isStarted = false;
  console.log("[WhatsApp] System stopped");
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  STATUS,
  enqueueMessage,
  enqueueForStudentAndParent,
  dispatchMessage,
  sendQueue,
  getStats,
  resetFailed,
  markSent,
  markFailed,
  markSkipped,
  getMessageById,
  getTemplateByType,
  getAllTemplates,
  generateWelcomeMessage,
  generateAbsenceMessage,
  generatePaymentMessage,
  generateExamMessage,
  startSystem,
  stopSystem,
  refreshQueueFromDB,
  processQueueWithDelay,
  forceProcess,
};
