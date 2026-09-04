// src/jobs/whatsappQueueJob.js
const cron = require("node-cron");
const whatsappDispatcher = require("../modules/whatsapp_messages/whatsapp_dispatcher.service");
const { logActivity } = require("../utils/activityLogger");

let isProcessing = false;

async function processQueue() {
  if (isProcessing) {
    console.log("Queue already processing, skipping...");
    return;
  }

  isProcessing = true;

  try {
    const result = await whatsappDispatcher.sendQueue({ limit: 5 });

    if (result.total > 0) {
      console.log(
        `Queue processed: ${result.sent} sent, ${result.failed} failed`,
      );

      await logActivity({
        user_id: null,
        user_role: "system",
        user_permissions: null,
        action: "cron_send_queue",
        entity_type: "whatsapp",
        entity_id: null,
        description: `Auto queue send: ${result.sent} success, ${result.failed} failed`,
      });
    } else if (result.dailyLimitReached) {
      console.log("Daily limit reached, waiting for next day");
    } else {
      console.log("No messages in queue");
    }
  } catch (error) {
    console.error("Queue processing failed:", error);
  } finally {
    isProcessing = false;
  }
}

cron.schedule("* * * * *", processQueue);

console.log("WhatsApp queue job started (runs every minute)");
