const cron = require("node-cron");
const whatsappDispatcher = require("../modules/whatsapp_messages/whatsapp_dispatcher.service");
const { logActivity } = require("../utils/activityLogger");

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running WhatsApp queue job`);

  try {
    const result = await whatsappDispatcher.sendQueue({
      statuses: ["pending"],
      delaySeconds: 5,
      limit: 50,
    });

    if (result.total > 0) {
      console.log(`Queue job complete: ${result.sent} sent, ${result.failed} failed`);

      await logActivity({
        user_id: null,
        user_role: "system",
        user_permissions: null,
        action: "cron_send_queue",
        entity_type: "whatsapp",
        entity_id: null,
        description: `Auto queue send: ${result.sent} success, ${result.failed} failed`,
      });
    } else {
      console.log("No messages in queue");
    }
  } catch (error) {
    console.error(`Queue job failed:`, error);
  }
});

console.log("WhatsApp queue job started (runs every 5 minutes)");