const env = require("../config/env");

// ============ Center Constants ============
const CENTER = {
  NAME: env.CENTER_NAME || "Learning Center",
  PHONE: env.CENTER_PHONE || "01000000000",
  ADDRESS: env.CENTER_ADDRESS || "Address",
};

// ============ API Configuration ============
const WHATSAPP_TOKEN = env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = env.WHATSAPP_PHONE_ID || "1300602659800445";
const API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`;
const LANG_CODE = "ar";

// ============ Template Names ============
const TEMPLATES = {
  WELCOME: env.WHATSAPP_TEMPLATE_WELCOME || "welcome",
  ABSENCE: env.WHATSAPP_TEMPLATE_ABSENCE || "absent",
  PAYMENT: env.WHATSAPP_TEMPLATE_PAYMENT || "payment",
  EXAM: env.WHATSAPP_TEMPLATE_EXAM || "exam",
};

// ============ Helper Functions ============

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

function getEgyptTime() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
}

function getToday() {
  const egyptTime = getEgyptTime();
  return egyptTime.toLocaleDateString("en-GB");
}

function getDayName() {
  const egyptTime = getEgyptTime();
  return egyptTime.toLocaleString("ar-EG", { weekday: "long" });
}

// ============ Send Template Message ============

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
    console.log(`Sending to ${to} (template: ${templateName})`);

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
      console.error(`Failed to send to ${to}:`, errorMsg);
      return {
        success: false,
        error: errorMsg,
        data,
      };
    }

    console.log(`Successfully sent to ${to}`);
    return {
      success: true,
      id: data?.messages?.[0]?.id || null,
      data,
    };
  } catch (error) {
    console.error(`Failed to send to ${to}:`, error.message);
    return {
      success: false,
      error: error.message || "Connection failed",
    };
  }
}

// ============ 1) Welcome Message ============

async function sendWelcomeMsg(student) {
  const phone = student.parent_phone || student.phone;
  const parentToken = student.parent_token || student.parentToken;

  return sendTemplate({
    phone,
    templateName: TEMPLATES.WELCOME,
    parameters: [
      student.full_name || student.name || "Student",
      student.barcode || "N/A",
    ],
    buttonParams: parentToken,
    lang_code: "en",
  });
}

// ============ 2) Absence Message ============

async function sendAbsentMsg(student, date) {
  const phone = student.parent_phone || student.phone;
  const parentToken = student.parent_token || student.parentToken;

  const absenceDate = date || getToday();

  return sendTemplate({
    phone,
    templateName: TEMPLATES.ABSENCE,
    parameters: [
      student.full_name || student.name || "Student",
      student.barcode || "N/A",
      absenceDate,
    ],
    buttonParams: parentToken,
    lang_code: "ar",
  });
}

// ============ 3) Payment Message ============

async function sendPaymentMsg(student, paymentData) {
  const phone = student.parent_phone || student.phone;

  const msg = `
Payment received for student ${student.full_name || student.name}
Month: ${paymentData.month || "N/A"} Year: ${paymentData.year || new Date().getFullYear()}
Amount: ${paymentData.amount || 0}
  `;
  console.log(msg);

  return sendTemplate({
    phone,
    templateName: TEMPLATES.PAYMENT,
    parameters: [
      student.full_name || student.name || "Student",
      paymentData.month || "N/A",
      paymentData.year || new Date().getFullYear(),
      paymentData.amount || 0,
    ],
    lang_code: "ar",
  });
}

// ============ 4) Exam Result Message ============

async function sendExamMsg(student, examData) {
  const phone = student.parent_phone || student.phone;

  return sendTemplate({
    phone,
    templateName: TEMPLATES.EXAM,
    parameters: [
      student.full_name || student.name || "Student",
      examData.score || 0,
      examData.fullMark || 100,
      examData.date || getToday(),
      getDayName(),
      student.barcode || "N/A",
    ],
    lang_code: "ar",
  });
}

// ============ Dispatcher by Type ============

async function sendByType(type, payload) {
  switch (type) {
    case "welcome":
      return sendWelcomeMsg(payload.student);
    case "absence":
      return sendAbsentMsg(payload.student, payload.date);
    case "payment":
      return sendPaymentMsg(payload.student, payload.payment);
    case "exam":
      return sendExamMsg(payload.student, payload.result);
    default:
      return { success: false, error: `Unknown message type: ${type}` };
  }
}

module.exports = {
  CENTER,
  TEMPLATES,
  sendWelcomeMsg,
  sendAbsentMsg,
  sendPaymentMsg,
  sendExamMsg,
  sendByType,
  sendTemplate,
  normalizePhone,
  hasPhone,
  getToday,
  getDayName,
  getEgyptTime,
};
