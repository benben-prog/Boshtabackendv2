/**
 * Matatata Sender — Standalone Script
 *
 * Usage:
 *   node scripts/send-message.js
 *   node scripts/send-message.js "رسالة مخصصة"
 *   node scripts/send-message.js --once
 *   node scripts/send-message.js --list
 *
 * يبعت الرسالة كل 3 ثواني لكل اللي أونلاين.
 * Ctrl+C للإيقاف.
 */

const axios = require("axios");

// ============================================
// CONFIG
// ============================================

const API_URL = process.env.API_URL || "https://backend.benb3n.cloud/";

const API_USERNAME = process.env.API_USERNAME || "your_api_username";
const API_PASSWORD = process.env.API_PASSWORD || "your_api_password";

const args = process.argv.slice(2);
const ONCE = args.includes("--once");
const LIST = args.includes("--list");

const MESSAGE = args.find((a) => !a.startsWith("--")) || "هاكونا ماتاتا";
const INTERVAL_MS = 3000;

// ============================================
// AUTH
// ============================================

const basicAuth = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString(
  "base64",
);

const headers = {
  Authorization: `Basic ${basicAuth}`,
  "Content-Type": "application/json",
};

// ============================================
// ACTIONS
// ============================================

async function listOnline() {
  try {
    const res = await axios.get(`${API_URL}/broadcast/online`, {
      headers,
    });

    const users = res.data.data || [];

    if (users.length === 0) {
      console.log("📭 مفيش حد أونلاين دلوقتي");
      return;
    }

    console.log(`👥 الأونلاين (${users.length}):`);
    for (const u of users) {
      console.log(`   • ${u.name} [${u.role}] — idle ${u.idle_seconds}s`);
    }
  } catch (error) {
    handleError(error);
  }
}

async function sendOnce() {
  try {
    // 1. Get online users
    const onlineRes = await axios.get(`${API_URL}/broadcast/online`, {
      headers,
    });

    const users = onlineRes.data.data || [];
    const time = new Date().toLocaleTimeString("ar-EG");

    if (users.length === 0) {
      console.log(`[${time}] 😴 مفيش حد أونلاين`);
      return;
    }

    // 2. Send message to all
    const userIds = users.map((u) => u.user_id);

    await axios.post(
      `${API_URL}/broadcast/send`,
      { user_ids: userIds, message: MESSAGE },
      { headers },
    );

    console.log(
      `[${time}] 📤 "${MESSAGE}" → ${users.length} مستخدم (${users
        .map((u) => u.name)
        .join(", ")})`,
    );
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  if (error.code === "ECONNREFUSED") {
    console.error(`❌ السيرفر مش شغال على ${API_URL}`);
  } else if (error.response) {
    console.error(
      `❌ خطأ ${error.response.status}: ${error.response.statusText}`,
    );
  } else {
    console.error(`❌ خطأ: ${error.message}`);
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  if (LIST) {
    console.log("============================================");
    console.log("👥 قايمة الأونلاين");
    console.log("============================================\n");
    await listOnline();
    process.exit(0);
  }

  console.log("============================================");
  console.log(`🎉 Matatata Sender`);
  console.log(`   السيرفر: ${API_URL}`);
  console.log(`   الرسالة: "${MESSAGE}"`);
  console.log(`   النمط: ${ONCE ? "مرة واحدة" : "كل 3 ثواني"}`);
  console.log(`   لإيقاف: Ctrl+C`);
  console.log("============================================\n");

  await sendOnce();

  if (ONCE) {
    process.exit(0);
  }

  const intervalId = setInterval(sendOnce, INTERVAL_MS);

  process.on("SIGINT", () => {
    console.log("\n\n👋 تم الإيقاف");
    clearInterval(intervalId);
    process.exit(0);
  });
}

main();
