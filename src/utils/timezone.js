// src/utils/timezone.js
// Helper functions for Egypt timezone (UTC+2/UTC+3)

const toEgyptTime = (date) => {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return new Date(d.toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
};

const formatEgyptTime = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;

  const egyptDate = new Date(
    d.toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );

  const year = egyptDate.getFullYear();
  const month = String(egyptDate.getMonth() + 1).padStart(2, "0");
  const day = String(egyptDate.getDate()).padStart(2, "0");
  const hours = String(egyptDate.getHours()).padStart(2, "0");
  const minutes = String(egyptDate.getMinutes()).padStart(2, "0");
  const seconds = String(egyptDate.getSeconds()).padStart(2, "0");

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD HH:mm:ss":
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};

const getTodayEgypt = () => {
  const now = new Date();
  const egyptDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );
  const year = egyptDate.getFullYear();
  const month = String(egyptDate.getMonth() + 1).padStart(2, "0");
  const day = String(egyptDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getNowEgypt = () => {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );
};

const compareEgyptDates = (date1, date2) => {
  const d1 = new Date(
    new Date(date1).toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );
  const d2 = new Date(
    new Date(date2).toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
  );
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

module.exports = {
  toEgyptTime,
  formatEgyptTime,
  getTodayEgypt,
  getNowEgypt,
  compareEgyptDates,
};
