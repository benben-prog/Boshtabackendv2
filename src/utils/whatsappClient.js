// src/utils/whatsappClient.js
const env = require("../config/env");

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

async function sendWelcomeMsg(student, phone) {
  const parentToken = student.parent_token || "";
  const parentLink = `https://boshta.benb3n.cloud/parent/${parentToken}`;

  return sendTemplate({
    phone,
    templateName: "welcome",
    parameters: [
      student.full_name || student.name || "Student",
      student.barcode || "N/A",
    ],
    buttonParams: parentLink,
    lang_code: "en",
  });
}

async function sendAbsentMsg(student, phone, date) {
  const parentToken = student.parent_token || "";
  const parentLink = `https://boshta.benb3n.cloud/parent/${parentToken}`;

  return sendTemplate({
    phone,
    templateName: "absent",
    parameters: [
      student.full_name || student.name || "Student",
      student.barcode || "N/A",
      date,
    ],
    buttonParams: parentLink,
    lang_code: "ar",
  });
}

async function sendPaymentMsg(student, phone, paymentData) {
  return sendTemplate({
    phone,
    templateName: "payment",
    parameters: [
      student.full_name || student.name || "Student",
      paymentData.month || "N/A",
      paymentData.year || new Date().getFullYear(),
      paymentData.amount || 0,
    ],
    lang_code: "ar",
  });
}

async function sendExamMsg(student, phone, examData) {
  return sendTemplate({
    phone,
    templateName: "exam",
    parameters: [
      student.full_name || student.name || "Student",
      examData.score || 0,
      examData.fullMark || 100,
      examData.date,
      examData.day || "",
      student.barcode || "N/A",
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
