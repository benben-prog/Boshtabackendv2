// Timezone utilities for Egypt (Africa/Cairo)
// Database comparisons use real Date instances. API date-time values are
// serialized as ISO-8601 values with the current Egypt offset.

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

const getPart = (parts, type) =>
  parts.find((part) => part.type === type)?.value || "";

const getEgyptOffset = (date) => {
  const value = getPart(offsetFormatter.formatToParts(date), "timeZoneName");
  if (value === "GMT" || !value) return "+00:00";
  return value.replace(/^GMT/, "");
};

const getOffsetMinutes = (date) => {
  const offset = getEgyptOffset(date);
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(offset);
  if (!match) return 0;

  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
};

// Parse a date-time entered without a timezone as Egypt local time. The
// offset is calculated through Intl so DST changes are handled by the runtime.
const parseEgyptLocalDate = (value) => {
  const text = String(value).trim();
  const dateTimeMatch = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(text);
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

  if (!dateTimeMatch && !dateOnlyMatch) return new Date(value);

  const [, year, month, day, hour = "00", minute = "00", second = "00", ms = ""] =
    dateTimeMatch || [...dateOnlyMatch, "00", "00", "00", ""];
  const milliseconds = ms ? ms.padEnd(3, "0") : "000";

  // Treat the wall-clock components as UTC first, then remove Egypt's offset.
  const wallClockAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    Number(milliseconds),
  );
  const initialGuess = new Date(wallClockAsUtc);
  const offsetMs = getOffsetMinutes(initialGuess) * 60 * 1000;
  return new Date(wallClockAsUtc - offsetMs);
};

const normalizeDate = (date) => {
  if (!date) return null;

  const value = date instanceof Date ? new Date(date.getTime()) : date;
  const normalized =
    typeof value === "string" ? parseEgyptLocalDate(value) : new Date(value);

  if (Number.isNaN(normalized.getTime())) return null;
  return normalized;
};

// Return the actual current instant. Never rebuild Date from Egypt wall-clock
// components because that changes the instant and breaks deadline comparisons.
const getNowEgypt = () => new Date();

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
    case "YYYY-MM-DD HH:mm:ss":
    default:
      return `${year}-${month}-${day}T${hour}:${minute}:${second}${getEgyptOffset(d)}`;
  }
};

const serializeApiDates = (value, seen = new WeakSet()) => {
  if (value instanceof Date) return formatEgyptTime(value, "ISO");
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => serializeApiDates(item, seen));
  }

  const result = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = serializeApiDates(item, seen);
  }
  return result;
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
  serializeApiDates,
};
