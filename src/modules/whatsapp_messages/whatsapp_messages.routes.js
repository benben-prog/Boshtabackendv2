// src/modules/whatsapp_messages/whatsapp_messages.routes.js
const express = require("express");
const routes = express.Router();
const whatsappController = require("./whatsapp_messages.controller");

routes.post("/send/welcome/:studentId", whatsappController.sendWelcome);
routes.post("/send/absence/:studentId", whatsappController.sendAbsence);
routes.post("/send/payment/:paymentId", whatsappController.sendPayment);
routes.post("/send/exam/:resultId", whatsappController.sendExam);

routes.post("/queue/send", whatsappController.sendQueue);
routes.get("/queue/stats", whatsappController.getQueueStats);
routes.post("/queue/reset-failed", whatsappController.resetFailed);

routes.get("/messages", whatsappController.getMessages);
routes.get("/messages/:messageId", whatsappController.getMessageById);
routes.delete("/messages/:messageId", whatsappController.deleteMessage);

routes.get("/dashboard", whatsappController.getDashboard);

routes.get("/templates", whatsappController.getAllTemplates);
routes.get("/templates/:templateId", whatsappController.getTemplateById);
routes.post("/templates", whatsappController.createTemplate);
routes.put("/templates/:templateId", whatsappController.updateTemplate);
routes.put(
  "/templates/:templateId/toggle",
  whatsappController.toggleTemplateActive,
);

module.exports = routes;
