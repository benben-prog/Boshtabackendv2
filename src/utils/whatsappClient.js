// src/utils/whatsappClient.js
const env = require("../config/env");
const { formatEgyptTime } = require("./timezone");

const WHATSAPP_TOKEN = env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = env.WHATSAPP_PHONE_ID || "1300602659800445";
const API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`;

// Helper: Normalize phone number to international format
function normalizePhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("20") && digits.length >= 12) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  if (digits.length === 10) return `20${digits}`;
  return digits;
}

// Helper: Check if phone number is valid
function hasPhone(phone) {
  return normalizePhone(phone).length >= 11;
}

// Helper: Ensure text is not empty
function safeText(text) {
  const result = String(text ?? "").trim();
  return result || "-";
}

// Helper: Format date for display
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

// Helper: Get day name in Arabic
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

// Helper: Get month name in Arabic
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
// SEND WELCOME TEMPLATE
// Template: welcome
// Parameters: {{1}} = name, {{2}} = barcode
// Button: {{1}} = parent_token (URL)
// ============================================
async function sendWelcomeMsg(student, phone) {
  const to = normalizePhone(phone);
  if (!hasPhone(to)) {
    return { success: false, skipped: true, error: "No valid phone number" };
  }

  const name = safeText(student.full_name || student.name || "Student");
  const barcode = safeText(student.barcode || "N/A");
  const token = safeText(student.parent_token || "");

  const template = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "welcome",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: barcode },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: token }],
        },
      ],
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();
    return { success: true, id: data?.messages?.[0]?.id || null, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SEND ABSENCE TEMPLATE
// Template: absent
// Parameters: {{1}} = name, {{2}} = barcode, {{3}} = date
// Button: {{1}} = parent_token (URL)
// ============================================
async function sendAbsentMsg(student, phone, date) {
  const to = normalizePhone(phone);
  if (!hasPhone(to)) {
    return { success: false, skipped: true, error: "No valid phone number" };
  }

  const name = safeText(student.full_name || student.name || "Student");
  const barcode = safeText(student.barcode || "N/A");
  const formattedDate = safeText(
    date || getEgyptDate(new Date()) || "غير محدد",
  );
  const token = safeText(student.parent_token || "");

  const template = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "absent",
      language: { code: "ar" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: barcode },
            { type: "text", text: formattedDate },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: token }],
        },
      ],
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();
    return { success: true, id: data?.messages?.[0]?.id || null, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SEND PAYMENT TEMPLATE
// Template: payment
// Parameters: {{1}} = name, {{2}} = month, {{3}} = year, {{4}} = amount
// ============================================
async function sendPaymentMsg(student, phone, paymentData) {
  const to = normalizePhone(phone);
  if (!hasPhone(to)) {
    return { success: false, skipped: true, error: "No valid phone number" };
  }

  const name = safeText(student.full_name || student.name || "Student");
  const month = safeText(paymentData?.month || "غير محدد");
  const year = safeText(String(paymentData?.year || new Date().getFullYear()));
  const amount = safeText(String(paymentData?.amount ?? 0));

  const template = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "payment",
      language: { code: "ar" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: month },
            { type: "text", text: year },
            { type: "text", text: amount },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();
    return { success: true, id: data?.messages?.[0]?.id || null, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SEND EXAM TEMPLATE
// Template: exam
// Parameters: {{1}} = name, {{2}} = score, {{3}} = fullMark, {{4}} = date, {{5}} = day, {{6}} = barcode
// ============================================
async function sendExamMsg(student, phone, examData) {
  const to = normalizePhone(phone);
  if (!hasPhone(to)) {
    return { success: false, skipped: true, error: "No valid phone number" };
  }

  const name = safeText(student.full_name || student.name || "Student");
  const score = safeText(String(examData?.score ?? 0));
  const fullMark = safeText(String(examData?.fullMark ?? 100));
  const date = safeText(examData?.date || "غير محدد");
  const day = safeText(examData?.day || "غير محدد");
  const barcode = safeText(student.barcode || "N/A");

  const template = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "exam",
      language: { code: "ar" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: score },
            { type: "text", text: fullMark },
            { type: "text", text: date },
            { type: "text", text: day },
            { type: "text", text: barcode },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();
    return { success: true, id: data?.messages?.[0]?.id || null, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// GENERIC SEND TEMPLATE (fallback)
// ============================================
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
        text: safeText(p),
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
          text: safeText(buttonParams),
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

module.exports = {
  sendTemplate,
  sendWelcomeMsg,
  sendAbsentMsg,
  sendPaymentMsg,
  sendExamMsg,
  normalizePhone,
  hasPhone,
  getEgyptDate,
  getEgyptDay,
  getEgyptMonth,
  safeText,
};
