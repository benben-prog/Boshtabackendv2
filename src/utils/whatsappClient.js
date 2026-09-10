const env = require("../config/env");
const { formatEgyptTime } = require("./timezone");

const WHATSAPP_TOKEN = env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = env.WHATSAPP_PHONE_ID;
const API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`;
const FETCH_TIMEOUT = 15000; // 15 seconds

// Normalize phone number to international format
function normalizePhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("20") && digits.length >= 12) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  if (digits.length === 10) return `20${digits}`;
  return digits;
}

// Check if phone number is valid
function hasPhone(phone) {
  return normalizePhone(phone).length >= 11;
}

// Ensure text is not empty
function safeText(text) {
  const result = String(text ?? "").trim();
  return result || "-";
}

// Fetch with timeout
async function fetchWithTimeout(url, options, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Send template message
async function sendTemplate({
  phone,
  templateName,
  parameters,
  buttonParams = null,
  langCode = "ar",
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
      language: { code: langCode },
      components,
    },
  };

  try {
    const response = await fetchWithTimeout(API_URL, {
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
    if (error.name === "AbortError") {
      return { success: false, error: "Request timeout" };
    }
    return { success: false, error: error.message || "Connection failed" };
  }
}

// Send welcome message
async function sendWelcomeMsg(student, phone) {
  const name = safeText(student.full_name || student.name);
  const barcode = safeText(student.barcode);
  const token = safeText(student.parent_token);

  return sendTemplate({
    phone,
    templateName: "welcome",
    parameters: [name, barcode],
    buttonParams: token,
    langCode: "en",
  });
}

// Send absence message
async function sendAbsentMsg(student, phone, date) {
  const name = safeText(student.full_name || student.name);
  const barcode = safeText(student.barcode);
  const formattedDate = safeText(date || "غير محدد");
  const token = safeText(student.parent_token);

  return sendTemplate({
    phone,
    templateName: "absent",
    parameters: [name, barcode, formattedDate],
    buttonParams: token,
    langCode: "ar",
  });
}

// Send payment message
async function sendPaymentMsg(student, phone, paymentData) {
  const name = safeText(student.full_name || student.name);
  const month = safeText(paymentData?.month || "غير محدد");
  const year = safeText(String(paymentData?.year || new Date().getFullYear()));
  const amount = safeText(String(paymentData?.amount ?? 0));

  return sendTemplate({
    phone,
    templateName: "payment",
    parameters: [name, month, year, amount],
    langCode: "ar",
  });
}

// Send exam message
async function sendExamMsg(student, phone, examData) {
  const name = safeText(student.full_name || student.name);
  const score = safeText(String(examData?.score ?? 0));
  const fullMark = safeText(String(examData?.fullMark ?? 100));
  const date = safeText(examData?.date || "غير محدد");
  const day = safeText(examData?.day || "غير محدد");
  const barcode = safeText(student.barcode);

  return sendTemplate({
    phone,
    templateName: "exam",
    parameters: [name, score, fullMark, date, day, barcode],
    langCode: "ar",
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
  safeText,
};
