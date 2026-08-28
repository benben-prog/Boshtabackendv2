/**
 * التحقق من صحة رقم الهاتف المصري
 * @param {string} phone - رقم الهاتف
 * @returns {boolean} - هل الرقم صحيح
 */
const validateEgyptianPhone = (phone) => {
  // لو فاضي أو null، يعتبر صحيح (لأنه اختياري)
  if (!phone || phone === "") return true;

  // إزالة المسافات والشرطات والأقواس
  const cleaned = String(phone).replace(/[\s\-\(\)]/g, "");

  // التحقق من الصيغة المصرية: 01xxxxxxxxx (11 رقم)
  const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

  return egyptianPhoneRegex.test(cleaned);
};

/**
 * تنظيف رقم الهاتف
 * @param {string} phone - رقم الهاتف
 * @returns {string} - الرقم المنظف
 */
const cleanPhone = (phone) => {
  if (!phone || phone === "") return null;
  return String(phone).replace(/[\s\-\(\)]/g, "");
};

/**
 * التحقق من صحة الوقت
 * @param {string} time - الوقت بصيغة HH:MM
 * @returns {boolean} - هل الوقت صحيح
 */
const validateTime = (time) => {
  if (!time || time === "") return false;

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(String(time).trim());
};

/**
 * تنظيف الوقت
 * @param {string|number} time - الوقت
 * @returns {string|null} - الوقت المنظف
 */
const cleanTime = (time) => {
  if (time === null || time === undefined || time === "") return null;

  // لو الوقت رقم (Excel time format)
  if (typeof time === "number") {
    const hours = Math.floor(time * 24);
    const minutes = Math.round((time * 24 - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  // لو الوقت نص
  const timeStr = String(time).trim();

  // لو بصيغة HH:MM:SS
  const timeWithSeconds = timeStr.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (timeWithSeconds) {
    return `${timeWithSeconds[1].padStart(2, "0")}:${timeWithSeconds[2]}`;
  }

  // لو بصيغة HH:MM
  const timeSimple = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (timeSimple) {
    return `${timeSimple[1].padStart(2, "0")}:${timeSimple[2]}`;
  }

  return null;
};

/**
 * التحقق من أن الوقت الأول أقل من الثاني
 * @param {string} startTime - وقت البداية
 * @param {string} endTime - وقت النهاية
 * @returns {boolean} - هل البداية قبل النهاية
 */
const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;

  const start = String(startTime).split(":").map(Number);
  const end = String(endTime).split(":").map(Number);

  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];

  return startMinutes < endMinutes;
};

/**
 * التحقق من أن القيمة رقم صحيح
 * @param {*} value - القيمة
 * @returns {boolean} - هل هي رقم
 */
const validateNumber = (value) => {
  if (value === null || value === undefined || value === "") return false;
  return !isNaN(Number(value));
};

/**
 * تنظيف الرقم
 * @param {*} value - القيمة
 * @returns {number|null} - الرقم المنظف
 */
const cleanNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

module.exports = {
  validateEgyptianPhone,
  cleanPhone,
  validateTime,
  cleanTime,
  validateTimeRange,
  validateNumber,
  cleanNumber,
};