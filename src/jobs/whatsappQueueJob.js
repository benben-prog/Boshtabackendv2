// src/jobs/whatsappQueueJob.js
const cron = require("node-cron");
const whatsappDispatcher = require("../modules/whatsapp_messages/whatsapp_dispatcher.service");
const { logActivity } = require("../utils/activityLogger");
const { query } = require("../config/database");

let isProcessing = false;
let currentCronTask = null;

async function getDelaySeconds() {
  try {
    const result = await query(
      "SELECT whatsapp_delay_seconds FROM settings WHERE id = 1",
    );
    return Number(result.rows[0]?.whatsapp_delay_seconds || 45);
  } catch (error) {
    return 45;
  }
}

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

async function scheduleDynamicCron() {
  const delaySeconds = await getDelaySeconds();
  const batchSize = 50;
  const restTime = 1;
  const totalSeconds = batchSize * delaySeconds + restTime;
  const cronMinutes = Math.ceil(totalSeconds / 60);

  if (currentCronTask) {
    currentCronTask.stop();
    console.log("Old cron stopped");
  }

  currentCronTask = cron.schedule(`*/${cronMinutes} * * * *`, processQueue);

  console.log(
    `WhatsApp queue: delay=${delaySeconds}s, batch=${batchSize}, cron=every ${cronMinutes} minutes`,
  );
}

// Start with initial schedule
scheduleDynamicCron();

setInterval(
  async () => {
    const delaySeconds = await getDelaySeconds();
    const cronMinutes = Math.ceil((5 * delaySeconds + 60) / 60);

    if (
      currentCronTask &&
      currentCronTask.options &&
      currentCronTask.options.expression !== `*/${cronMinutes} * * * *`
    ) {
      console.log(
        `Delay changed to ${delaySeconds}s, rescheduling cron to every ${cronMinutes} minutes`,
      );
      await scheduleDynamicCron();
    }
  },
  10 * 60 * 1000,
);

console.log("WhatsApp queue job started with dynamic interval");
