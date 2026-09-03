const env = require("../config/env");

// ============ Center Constants ============
const CENTER = {
  NAME: env.CENTER_NAME || "Learning Center",
  PHONE: env.CENTER_PHONE || "01000000000",
  ADDRESS: env.CENTER_ADDRESS || "Address",
};

// ============ API Configuration ============
const WHATSAPP_TOKEN =
  env.WHATSAPP_TOKEN ||
  "EAAes0x5d0CUBSfuhonhfebaifDNBZAQ0344oWIMAeBK6UH5Uy6QomqA9lrDISKdWSZAZBThZBo3VfnEQQOapsqP3WXFZC3Dh9I4QSsqgGpILcqZBaEg89NbtbaCtqp1As0dZCE4RsrYpYn0u4vXzxB5MrkeJZAURhRd9IwXWnqB8PDU97k3myeOjDRBJHq7nlJ31nwZDZD";

const WHATSAPP_PHONE_ID = env.WHATSAPP_PHONE_ID || "1300602659800445";
const API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`;
const LANG_CODE = "ar";

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

function getToday() {
  return new Date().toLocaleDateString("en-GB");
}

function getDayName() {
  return new Date().toLocaleString("ar-EG", { weekday: "long" });
}

// ============ Send Template Message ============

async function sendTemplate({
  phone,
  templateName,
  parameters,
  buttonParams = null,
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
      language: { code: LANG_CODE },
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
    templateName: "welcome",
    parameters: [student.full_name || student.name, student.barcode],
    buttonParams: parentToken,
  });
}

// ============ 2) Absence Message ============

async function sendAbsentMsg(student, date) {
  const phone = student.parent_phone || student.phone;
  const parentToken = student.parent_token || student.parentToken;

  return sendTemplate({
    phone,
    templateName: "absent",
    parameters: [
      student.full_name || student.name,
      student.barcode,
      date || getToday(),
    ],
    buttonParams: parentToken,
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
    templateName: "payment",
    parameters: [
      student.full_name || student.name,
      paymentData.month || "N/A",
      paymentData.year || new Date().getFullYear(),
      paymentData.amount || 0,
    ],
  });
}

// ============ 4) Exam Result Message ============

async function sendExamMsg(student, examData) {
  const phone = student.parent_phone || student.phone;

  return sendTemplate({
    phone,
    templateName: "exam",
    parameters: [
      student.full_name || student.name,
      examData.score || 0,
      examData.fullMark || 100,
      examData.date || getToday(),
      getDayName(),
      student.barcode,
    ],
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
  sendWelcomeMsg,
  sendAbsentMsg,
  sendPaymentMsg,
  sendExamMsg,
  sendByType,
  sendTemplate,
  normalizePhone,
  hasPhone,
};
