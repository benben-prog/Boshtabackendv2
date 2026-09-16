const express = require("express");
const routes = express.Router();
const store = require("./broadcast.store");

// ============================================
// PING: frontend calls this every 3s
// ============================================
routes.post("/ping", (req, res) => {
  const { user_id, role, name } = req.body;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "user_id مطلوب",
    });
  }

  store.recordPing(user_id, role, name);
  return res.json({ success: true });
});

// ============================================
// ONLINE: list who's online
// ============================================
routes.get("/online", (req, res) => {
  const users = store.getOnlineUsers();

  return res.json({
    success: true,
    total: users.length,
    data: users.map((u) => ({
      user_id: u.userId,
      role: u.role,
      name: u.name,
      idle_seconds: Math.round((Date.now() - u.lastPing) / 1000),
    })),
  });
});

// ============================================
// SEND: send a message to specific users
// (called by the standalone script)
// ============================================
routes.post("/send", (req, res) => {
  const { user_ids, message } = req.body;

  if (!Array.isArray(user_ids) || !message) {
    return res.status(400).json({
      success: false,
      message: "user_ids (array) و message مطلوبين",
    });
  }

  const count = store.sendToUsers(user_ids, message);

  return res.json({
    success: true,
    sent: count,
  });
});

// ============================================
// MESSAGES: frontend polls this for new messages
// ============================================
routes.get("/messages/:userId", (req, res) => {
  const messages = store.getAndClearMessages(req.params.userId);

  return res.json({
    success: true,
    messages,
  });
});

module.exports = routes;
