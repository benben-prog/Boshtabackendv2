const { query } = require("../../config/database");
const whatsappClient = require("../../utils/whatsappClient");

// ============ Dispatch Single Message ============

async function dispatchMessage(messageId) {
  console.log(`Processing message ID: ${messageId}`);

  const result = await query(
    `
    SELECT 
      m.*,
      s.id AS student_id,
      s.full_name,
      s.barcode,
      s.phone,
      s.parent_phone,
      s.parent_token,
      s.grade_id,
      s.group_id,
      g.name AS grade_name,
      gr.name AS group_name
    FROM messages m
    LEFT JOIN students s ON m.student_id = s.id
    LEFT JOIN grades g ON s.grade_id = g.id
    LEFT JOIN groups gr ON s.group_id = gr.id
    WHERE m.id = $1
  `,
    [messageId]
  );

  const message = result.rows[0];
  if (!message) {
    return { success: false, error: "Message not found" };
  }

  if (message.status !== "pending") {
    return { success: false, error: `Message status is ${message.status}` };
  }

  const phone = message.recipient === "student" 
    ? message.phone 
    : message.parent_phone || message.phone;

  if (!whatsappClient.hasPhone(phone)) {
    await markFailed(message.id, "No valid phone number");
    return { success: false, skipped: true, error: "No valid phone number" };
  }

  const student = {
    id: message.student_id,
    full_name: message.full_name,
    name: message.full_name,
    barcode: message.barcode,
    grade_name: message.grade_name,
    group_name: message.group_name,
    phone: message.phone,
    parent_phone: message.parent_phone,
    parent_token: message.parent_token,
  };

  let params = {};
  try {
    params = typeof message.params === "string" 
      ? JSON.parse(message.params) 
      : message.params || {};
  } catch {
    params = {};
  }

  let sendResult;
  switch (message.type) {
    case "welcome":
      sendResult = await whatsappClient.sendWelcomeMsg(student);
      break;
    case "absence":
      sendResult = await whatsappClient.sendAbsentMsg(student, params.date);
      break;
    case "payment":
      sendResult = await whatsappClient.sendPaymentMsg(student, params);
      break;
    case "exam":
      sendResult = await whatsappClient.sendExamMsg(student, params);
      break;
    default:
      sendResult = await whatsappClient.sendTemplate({
        phone,
        templateName: message.template_name || "custom",
        parameters: params.parameters || [],
      });
  }

  if (sendResult?.success) {
    await markSent(message.id, sendResult.id);
    console.log(`Message ${messageId} sent successfully`);
  } else {
    await markFailed(message.id, sendResult?.error || "Send failed");
    console.log(`Message ${messageId} failed: ${sendResult?.error}`);
  }

  return sendResult;
}

// ============ Mark as Sent ============

async function markSent(id, messageId) {
  await query(
    `
    UPDATE messages 
    SET status = 'sent', 
        sent_at = NOW(),
        attempts = attempts + 1,
        updated_at = NOW()
    WHERE id = $1
  `,
    [id]
  );
}

// ============ Mark as Failed ============

async function markFailed(id, error) {
  await query(
    `
    UPDATE messages 
    SET status = 'failed', 
        error_message = $2,
        attempts = attempts + 1,
        updated_at = NOW()
    WHERE id = $1
  `,
    [id, error?.slice(0, 500) || "Unknown error"]
  );
}

// ============ Send Queue ============

async function sendQueue({ statuses = ["pending"], delaySeconds = 5, limit = 100 } = {}) {
  console.log("Starting queue processing...");

  const placeholders = statuses.map((_, i) => `$${i + 1}`).join(",");
  const result = await query(
    `
    SELECT id FROM messages 
    WHERE status IN (${placeholders})
    ORDER BY created_at ASC
    LIMIT ${limit}
  `,
    statuses
  );

  const messages = result.rows;
  if (messages.length === 0) {
    console.log("No messages in queue");
    return { success: true, sent: 0, failed: 0, total: 0 };
  }

  console.log(`Messages in queue: ${messages.length}`);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < messages.length; i++) {
    console.log(`Sending ${i + 1}/${messages.length}`);
    const dispatchResult = await dispatchMessage(messages[i].id);
    if (dispatchResult?.success) sent++;
    else failed++;

    if (i < messages.length - 1 && delaySeconds > 0) {
      console.log(`Waiting ${delaySeconds} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
    }
  }

  console.log(`Queue complete: ${sent} sent, ${failed} failed`);
  return { success: true, sent, failed, total: messages.length };
}

// ============ Enqueue Message ============

async function enqueueMessage(messageData) {
  const {
    student_id,
    type,
    recipient = "parent",
    phone,
    params,
    ref_key,
    template_id,
    scheduled_at = null,
  } = messageData;

  if (ref_key) {
    const existing = await query("SELECT id FROM messages WHERE ref_key = $1", [ref_key]);
    if (existing.rows.length > 0) {
      console.log(`Duplicate message: ${ref_key}`);
      return { inserted: false, id: existing.rows[0].id, message: "Duplicate" };
    }
  }

  let targetPhone = phone;
  if (!targetPhone && student_id) {
    const studentResult = await query(
      "SELECT phone, parent_phone FROM students WHERE id = $1 AND deleted = 0",
      [student_id]
    );
    if (studentResult.rows[0]) {
      targetPhone = recipient === "student" 
        ? studentResult.rows[0].phone 
        : studentResult.rows[0].parent_phone;
    }
  }

  if (!targetPhone) {
    return { inserted: false, error: "Phone number required" };
  }

  const result = await query(
    `
    INSERT INTO messages 
      (student_id, phone, type, recipient, params, ref_key, template_id, scheduled_at, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
    RETURNING id
  `,
    [
      student_id,
      targetPhone,
      type,
      recipient,
      JSON.stringify(params || {}),
      ref_key,
      template_id,
      scheduled_at,
    ]
  );

  console.log(`Message added to queue (ID: ${result.rows[0].id}, type: ${type})`);
  return { inserted: true, id: result.rows[0].id };
}

// ============ Get Statistics ============

async function getStats() {
  const result = await query(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed
    FROM messages
  `);
  return result.rows[0];
}

// ============ Reset Failed Messages ============

async function resetFailed() {
  const result = await query(`
    UPDATE messages 
    SET status = 'pending', 
        error_message = NULL,
        updated_at = NOW()
    WHERE status = 'failed' AND attempts < 3
    RETURNING id
  `);
  console.log(`Reset ${result.rowCount} failed messages`);
  return result.rows;
}

// ============ Get Message by ID ============

async function getMessageById(id) {
  const result = await query(
    `
    SELECT 
      m.*,
      s.full_name,
      s.barcode,
      s.parent_phone,
      s.parent_token
    FROM messages m
    LEFT JOIN students s ON m.student_id = s.id
    WHERE m.id = $1
  `,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  dispatchMessage,
  sendQueue,
  enqueueMessage,
  getStats,
  resetFailed,
  markSent,
  markFailed,
  getMessageById,
};