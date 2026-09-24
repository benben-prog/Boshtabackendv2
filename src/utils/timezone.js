// Timezone utilities for Egypt (Africa/Cairo)
// Keep one consistent representation at the API boundary:
// - Database comparisons use real Date instances (an instant in time).
// - API date-time strings are ISO-8601 with the Egypt offset.
// - Date-only and time-only formats remain backward compatible.

const TIMEZONE = "Africa/Cairo";

// Ensure dates without an explicit offset are interpreted as Egypt local time.
// This is also configured by config/database.js, but this module can be used
// independently by controllers and scripts.
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

// Extract a part from formatter output
const getPart = (parts, type) => {
  return parts.find((p) => p.type === type)?.value || "";
};

const getEgyptOffset = (date) => {
  const parts = offsetFormatter.formatToParts(date);
  const offset = getPart(parts, "timeZoneName");

  // Intl returns values such as GMT+02:00 or GMT+03:00.
  if (offset === "GMT" || !offset) return "+00:00";
  return offset.replace(/^GMT/, "");
};

// Validate and normalize date input
const normalizeDate = (date) => {
  if (!date) return null;

  const d = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  return d;
};

// Get current time as a real Date instant.
// Do not rebuild a Date from Egypt's wall-clock components: doing so changes
// the instant and causes incorrect exam deadlines and invalid frontend dates.
const getNowEgypt = () => new Date();

// Format a date to Egypt time string
// Supported formats:
//   - "YYYY-MM-DD"
//   - "DD/MM/YYYY"
//   - "YYYY-MM-DD HH:mm:ss" (legacy display format)
//   - "HH:mm:ss"
//   - "ISO" / "YYYY-MM-DDTHH:mm:ssZ" (ISO-8601 with Egypt offset)
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
      // Kept as a display format for existing callers. API date-time values
      // should use ISO by default at serialization boundaries.
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
};

// Get today's date in Egypt (YYYY-MM-DD)
const getTodayEgypt = () => {
  const parts = dateFormatter.formatToParts(new Date());
  return `${getPart(parts, "year")}-${getPart(parts, "month")}-${getPart(parts, "day")}`;
};

// Get current month in Egypt (YYYY-MM)
const getCurrentMonthEgypt = () => {
  const parts = dateFormatter.formatToParts(new Date());
  return `${getPart(parts, "year")}-${getPart(parts, "month")}`;
};

// Compare two dates
// Returns: -1 if date1 < date2, 1 if date1 > date2, 0 if equal
const compareEgyptDates = (date1, date2) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);

  if (!d1 || !d2) return null;

  const t1 = d1.getTime();
  const t2 = d2.getTime();

  if (t1 < t2) return -1;
  if (t1 > t2) return 1;
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
