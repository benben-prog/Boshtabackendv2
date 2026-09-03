const express = require("express");
const routes = express.Router();
const { query } = require("../config/database");
const env = require("../config/env");

// ============ Webhook Verification ============

routes.get("/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "your_verify_token";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WhatsApp webhook verified");
    return res.status(200).send(challenge);
  }
  return res.status(403).send("Verification failed");
});

// ============ Webhook Status Updates ============

routes.post("/whatsapp/webhook", async (req, res) => {
  try {
    const { entry } = req.body;

    for (const e of entry) {
      for (const change of e.changes) {
        if (change.field === "messages") {
          for (const message of change.value?.messages || []) {
            const messageId = message.id;
            const status = message.status; // sent, delivered, read, failed

            console.log(`Message ${messageId} status update: ${status}`);

            await query(
              `
              UPDATE messages 
              SET status = $1,
                  updated_at = NOW()
              WHERE message_id = $2
            `,
              [status, messageId]
            );
          }
        }
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Error");
  }
});

module.exports = routes;