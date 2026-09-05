// src/utils/whatsappClient.js
const env = require("../config/env");
const { formatEgyptTime, getTodayEgypt } = require("./timezone");

const WHATSAPP_TOKEN = env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = env.WHATSAPP_PHONE_ID || "1300602659800445";
const API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`;

function normalizePhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("20") && digits.length >= 12) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  if (digits.length === 10) return `20${digits}`;
  return digits;
}

function hasPhone(phone) {
  return normalizePhone(phone).length >= 11;
}

async function sendTemplate({
  phone,
  templateName,
  parameters,
  buttonParams = null,
  lang_code = "ar",
}) {
  const to = normalizePhone(phone);
  if (!hasPhone(to)) {
    return { success: false, skipped: true, error: "No valid phone number" };
  }

  const components = [
    {
      type: "body",
      parameters: parameters.map((p) => ({
        type: "text",
        text: String(p ?? "").trim() || "-",
      })),
    },
  ];

  if (buttonParams) {
    components.push({
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [
        {
          type: "text",
          text: String(buttonParams ?? "").trim(),
        },
      ],
    });
  }

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: lang_code },
      components,
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || `Failed (${response.status})`;
      return { success: false, error: errorMsg, data };
    }

    return {
      success: true,
      id: data?.messages?.[0]?.id || null,
      data,
    };
  } catch (error) {
    return { success: false, error: error.message || "Connection failed" };
  }
}

function getEgyptDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr || "");
    return formatEgyptTime(date, "DD/MM/YYYY");
  } catch {
    return String(dateStr || "");
  }
}

function getEgyptDay(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const egyptDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
    );
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return days[egyptDate.getDay()];
  } catch {
    return "";
  }
}

function getEgyptMonth(monthStr) {
  if (!monthStr) return "";
  const months = {
    "01": "يناير",
    "02": "فبراير",
    "03": "مارس",
    "04": "أبريل",
    "05": "مايو",
    "06": "يونيو",
    "07": "يوليو",
    "08": "أغسطس",
    "09": "سبتمبر",
    10: "أكتوبر",
    11: "نوفمبر",
    12: "ديسمبر",
  };
  return months[monthStr] || monthStr;
}

// ============================================
// WELCOME TEMPLATE
// Template parameters: {{1}} = student name, {{2}} = barcode
// Button: {{1}} = parent token URL
// ============================================
async function sendWelcomeMsg(student, phone) {
  return sendTemplate({
    phone,
    templateName: "welcome",
    parameters: [
      student.full_name || student.name || "Student", // {{1}}
      student.barcode || "N/A", // {{2}}
    ],
    buttonParams: student.parent_token,
    lang_code: "en",
  });
}

// ============================================
// ABSENCE TEMPLATE
// Template parameters: {{1}} = student name, {{2}} = barcode, {{3}} = date
// Button: {{1}} = parent token URL
// ============================================
async function sendAbsentMsg(student, phone, date) {
  return sendTemplate({
    phone,
    templateName: "absent",
    parameters: [
      student.full_name || student.name || "Student", // {{1}}
      student.barcode || "N/A", // {{2}}
      date || "غير محدد", // {{3}}
    ],
    buttonParams: student.parent_token,
    lang_code: "ar",
  });
}

// ============================================
// PAYMENT TEMPLATE
// Template parameters: {{1}} = student name, {{2}} = month, {{3}} = amount
// month should be like "سبتمبر 2026" not "2026-09"
// ============================================
async function sendPaymentMsg(student, phone, paymentData) {
  const monthDisplay = paymentData.month || "غير محدد";
  const amount = Number(paymentData.amount) || 0;

  return sendTemplate({
    phone,
    templateName: "payment",
    parameters: [
      student.full_name || student.name || "Student", // {{1}}
      monthDisplay, // {{2}}
      amount, // {{3}}
    ],
    lang_code: "ar",
  });
}

// ============================================
// EXAM TEMPLATE
// Template parameters: {{1}} = student name, {{2}} = score, {{3}} = full mark, {{4}} = date, {{5}} = day, {{6}} = barcode
// ============================================
async function sendExamMsg(student, phone, examData) {
  return sendTemplate({
    phone,
    templateName: "exam",
    parameters: [
      student.full_name || student.name || "Student", // {{1}}
      Number(examData.score) || 0, // {{2}}
      Number(examData.fullMark) || 100, // {{3}}
      examData.date || "غير محدد", // {{4}}
      examData.day || "غير محدد", // {{5}}
      student.barcode || "N/A", // {{6}}
    ],
    lang_code: "ar",
  });
}

module.exports = {
  sendTemplate,
  sendWelcomeMsg,
  sendAbsentMsg,
  sendPaymentMsg,
  sendExamMsg,
  normalizePhone,
  hasPhone,
};
