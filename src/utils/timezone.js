// Timezone utilities for Egypt (Africa/Cairo)
// Keep one consistent representation at the API boundary:
// - Database comparisons use real Date instances (an instant in time).
// - API date-time strings are ISO-8601 with the Egypt offset.
// - Date-only and time-only formats remain backward compatible where needed.

const TIMEZONE = "Africa/Cairo";

if (!process.env.TZ) {
  process.env.TZ = TIMEZONE;
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  timeZoneName: "longOffset",
});

const getPart = (parts, type) => {
  return parts.find((part) => part.type === type)?.value || "";
};

const getEgyptOffset = (date) => {
  const offset = getPart(offsetFormatter.formatToParts(date), "timeZoneName");
  if (offset === "GMT" || !offset) return "+00:00";
  return offset.replace(/^GMT/, "");
};

const parseEgyptLocalDate = (value) => {
  const text = String(value).trim();

  // Date-only values are calendar dates in Egypt, not UTC timestamps.
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(`${text}T00:00:00+02:00`);
  }

  // Old API/client values without an offset are Egypt local date-times.
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(text)) {
    const normalized = text.replace(" ", "T");
    return new Date(`${normalized}${normalized.length === 16 ? ":00" : ""}+02:00`);
  }

  return new Date(value);
};

// Validate and normalize date input.
const normalizeDate = (date) => {
  if (!date) return null;

  const d = date instanceof Date
    ? new Date(date.getTime())
    : parseEgyptLocalDate(date);

  if (Number.isNaN(d.getTime())) return null;
  return d;
};

// Return the real current instant. Formatting it for Egypt happens only at
// display/serialization boundaries; never rebuild a Date from wall-clock parts.
const getNowEgypt = () => new Date();

// Supported formats:
// - YYYY-MM-DD
// - DD/MM/YYYY
// - HH:mm:ss
// - ISO / YYYY-MM-DDTHH:mm:ssZ: parseable Egypt ISO value
// - YYYY-MM-DD HH:mm:ss: kept as a legacy display format
const formatEgyptTime = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  const d = normalizeDate(date);
  if (!d) return null;

  const parts = dateTimeFormatter.formatToParts(d);
  const year = getPart(parts, "year");
  const month = getPart(parts, "month");
  const day = getPart(parts, "day");
  const hour = getPart(parts, "hour");
  const minute = getPart(parts, "minute");
  const second = getPart(parts, "second");

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "HH:mm:ss":
      return `${hour}:${minute}:${second}`;
    case "ISO":
    case "YYYY-MM-DDTHH:mm:ssZ":
      return `${year}-${month}-${day}T${hour}:${minute}:${second}${getEgyptOffset(d)}`;
    case "YYYY-MM-DD HH:mm:ss":
    default:
      // ISO-compatible output prevents Invalid Date in JavaScript clients while
      // keeping the requested Egypt local clock value.
      return `${year}-${month}-${day}T${hour}:${minute}:${second}${getEgyptOffset(d)}`;
  }
};

const getTodayEgypt = () => {
  const parts = dateFormatter.formatToParts(new Date());
  return `${getPart(parts, "year")}-${getPart(parts, "month")}-${getPart(parts, "day")}`;
};

const getCurrentMonthEgypt = () => {
  const parts = dateFormatter.formatToParts(new Date());
  return `${getPart(parts, "year")}-${getPart(parts, "month")}`;
};

const compareEgyptDates = (date1, date2) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);

  if (!d1 || !d2) return null;

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
};

module.exports = {
  TIMEZONE,
  formatEgyptTime,
  getTodayEgypt,
  getCurrentMonthEgypt,
  getNowEgypt,
  compareEgyptDates,
  normalizeDate,
};
