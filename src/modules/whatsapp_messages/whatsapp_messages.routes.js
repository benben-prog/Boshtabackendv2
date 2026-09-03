const express = require("express");
const routes = express.Router();
const whatsappController = require("./whatsapp_messages.controller");

// ============ Send Instant Messages ============

// POST /api/assistant/whatsapp/send/welcome/:studentId?instant=true
routes.post("/send/welcome/:studentId", whatsappController.sendWelcome);

// POST /api/assistant/whatsapp/send/absence/:studentId?instant=true&date=2024-01-15
routes.post("/send/absence/:studentId", whatsappController.sendAbsence);

// POST /api/assistant/whatsapp/send/payment/:paymentId?instant=true
routes.post("/send/payment/:paymentId", whatsappController.sendPayment);

// POST /api/assistant/whatsapp/send/exam/:resultId?instant=true
routes.post("/send/exam/:resultId", whatsappController.sendExam);

// ============ Queue Management ============

// POST /api/assistant/whatsapp/queue/send
routes.post("/queue/send", whatsappController.sendQueue);

// GET /api/assistant/whatsapp/queue/stats
routes.get("/queue/stats", whatsappController.getQueueStats);

// POST /api/assistant/whatsapp/queue/reset-failed
routes.post("/queue/reset-failed", whatsappController.resetFailed);

// ============ Message Management ============

// GET /api/assistant/whatsapp/messages?status=pending&type=welcome&page=1&limit=20
routes.get("/messages", whatsappController.getAllMessages);

// GET /api/assistant/whatsapp/messages/:messageId
routes.get("/messages/:messageId", whatsappController.getMessageById);

// DELETE /api/assistant/whatsapp/messages/:messageId
routes.delete("/messages/:messageId", whatsappController.deleteMessage);

module.exports = routes;