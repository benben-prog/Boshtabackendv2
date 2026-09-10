// src/modules/whatsapp_messages/whatsapp_messages.routes.js
const express = require("express");
const routes = express.Router();
const whatsappController = require("./whatsapp_messages.controller");

// ============================================
// SEND MESSAGES
// ============================================

routes.post("/send/welcome/:studentId", whatsappController.sendWelcome);
routes.post("/send/absence/:studentId", whatsappController.sendAbsence);
routes.post("/send/payment/:paymentId", whatsappController.sendPayment);
routes.post("/send/exam/:resultId", whatsappController.sendExam);

// ============================================
// SETTINGS
// ============================================

routes.put("/settings", whatsappController.updateSettings);

// ============================================
// QUEUE MANAGEMENT
// ============================================

// Force process (reload from DB + process)
routes.post("/queue/force-process", whatsappController.forceProcess);

// Send manually (5 messages)
routes.post("/queue/send", whatsappController.sendQueue);

// Get queue stats
routes.get("/queue/stats", whatsappController.getQueueStats);

// Reset failed messages
routes.post("/queue/reset-failed", whatsappController.resetFailed);

// ============================================
// MESSAGES
// ============================================

routes.get("/messages", whatsappController.getMessages);
routes.get("/messages/:messageId", whatsappController.getMessageById);
routes.delete("/messages/:messageId", whatsappController.deleteMessage);

// ============================================
// DASHBOARD
// ============================================

routes.get("/dashboard", whatsappController.getDashboard);

// ============================================
// TEMPLATES
// ============================================

routes.get("/templates", whatsappController.getAllTemplates);
routes.get("/templates/:templateId", whatsappController.getTemplateById);
routes.post("/templates", whatsappController.createTemplate);
routes.put("/templates/:templateId", whatsappController.updateTemplate);
routes.put(
  "/templates/:templateId/toggle",
  whatsappController.toggleTemplateActive,
);

module.exports = routes;
