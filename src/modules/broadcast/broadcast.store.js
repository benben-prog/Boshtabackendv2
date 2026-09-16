// In-memory store for online users + pending messages
// Test only — resets on server restart
// لا يحتاج قاعدة بيانات

// Map<userId, { userId, role, name, lastPing }>
const onlineUsers = new Map();

// Map<userId, Array<{ message, sentAt }>>
const pendingMessages = new Map();

const ONLINE_TIMEOUT_MS = 10000; // 10 seconds

// ============================================
// PING: record that a user is online
// ============================================

function recordPing(userId, role, name) {
  if (!userId) return;

  onlineUsers.set(String(userId), {
    userId,
    role: role || "unknown",
    name: name || "مستخدم",
    lastPing: Date.now(),
  });
}

// ============================================
// ONLINE: get list of online users (auto-cleans stale)
// ============================================

function getOnlineUsers() {
  const now = Date.now();
  const cutoff = now - ONLINE_TIMEOUT_MS;

  for (const [id, user] of onlineUsers.entries()) {
    if (user.lastPing < cutoff) {
      onlineUsers.delete(id);
    }
  }

  return Array.from(onlineUsers.values());
}

// ============================================
// SEND: queue a message for a set of users
// ============================================

function sendToUsers(userIds, message) {
  const sentAt = new Date().toISOString();
  let count = 0;

  for (const userId of userIds) {
    const id = String(userId);
    if (!pendingMessages.has(id)) {
      pendingMessages.set(id, []);
    }
    pendingMessages.get(id).push({ message, sentAt });
    count++;
  }

  return count;
}

// ============================================
// FETCH: get and clear a user's pending messages
// ============================================

function getAndClearMessages(userId) {
  const id = String(userId);
  const messages = pendingMessages.get(id) || [];
  pendingMessages.delete(id);
  return messages;
}

module.exports = {
  recordPing,
  getOnlineUsers,
  sendToUsers,
  getAndClearMessages,
};
