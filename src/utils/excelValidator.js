// Validate Egyptian phone number
const validateEgyptianPhone = (phone) => {
  // Empty is valid (optional field)
  if (!phone || phone === "") return true;

  const cleaned = String(phone).replace(/[\s\-\(\)]/g, "");

  // Egyptian format: 01xxxxxxxxx (11 digits)
  const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

  return egyptianPhoneRegex.test(cleaned);
};

// Clean phone number
const cleanPhone = (phone) => {
  if (!phone || phone === "") return null;
  return String(phone).replace(/[\s\-\(\)]/g, "");
};

// Validate time format (HH:MM)
const validateTime = (time) => {
  if (!time || time === "") return false;

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(String(time).trim());
};

// Clean time (handles Excel time format)
const cleanTime = (time) => {
  if (time === null || time === undefined || time === "") return null;

  // Excel time format (number)
  if (typeof time === "number") {
    const hours = Math.floor(time * 24);
    const minutes = Math.round((time * 24 - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const timeStr = String(time).trim();

  // HH:MM:SS format
  const timeWithSeconds = timeStr.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (timeWithSeconds) {
    return `${timeWithSeconds[1].padStart(2, "0")}:${timeWithSeconds[2]}`;
  }

  // HH:MM format
  const timeSimple = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (timeSimple) {
    return `${timeSimple[1].padStart(2, "0")}:${timeSimple[2]}`;
  }

  return null;
};

// Validate that start time is before end time
const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;

  const start = String(startTime).split(":").map(Number);
  const end = String(endTime).split(":").map(Number);

  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];

  return startMinutes < endMinutes;
};

// Validate number
const validateNumber = (value) => {
  if (value === null || value === undefined || value === "") return false;
  return !isNaN(Number(value));
};

// Clean number
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
