// Timezone utilities for Egypt (Africa/Cairo)
// Egypt observes DST: UTC+2 (winter), UTC+3 (summer)
// Africa/Cairo handles DST automatically

process.env.TZ = "Africa/Cairo";

const TIMEZONE = "Africa/Cairo";

// Cache formatters for better performance
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

// Extract a part from formatter output
const getPart = (parts, type) => {
  return parts.find((p) => p.type === type)?.value || "";
};

// Validate and normalize date input
const normalizeDate = (date) => {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;

  return d;
};

// Get current time in Egypt as a Date object
// Returns current Date (with process.env.TZ = Africa/Cairo, local representations reflect Egypt time)
const getNowEgypt = () => {
  return new Date();
};

// Format a date to Egypt time string
// Supported formats:
//   - "YYYY-MM-DD"
//   - "DD/MM/YYYY"
//   - "YYYY-MM-DD HH:mm:ss" (default)
//   - "HH:mm:ss"
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
    case "YYYY-MM-DD HH:mm:ss":
    default:
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
};

// Get today's date in Egypt (YYYY-MM-DD)
const getTodayEgypt = () => {
  const now = new Date();
  const parts = dateFormatter.formatToParts(now);

  const year = getPart(parts, "year");
  const month = getPart(parts, "month");
  const day = getPart(parts, "day");

  return `${year}-${month}-${day}`;
};

// Get current month in Egypt (YYYY-MM)
const getCurrentMonthEgypt = () => {
  const now = new Date();
  const parts = dateFormatter.formatToParts(now);

  const year = getPart(parts, "year");
  const month = getPart(parts, "month");

  return `${year}-${month}`;
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
};
