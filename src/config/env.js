const dotenv = require("dotenv");
const path = require("path");

// Load environment file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({ path: path.join(__dirname, "../../", envFile) });

const isProduction = process.env.NODE_ENV === "production";
const parseBoolean = (value, fallback) => {
  if (value === undefined || value === "") return fallback;
  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};
const parsePositiveInt = (value, fallback, name) => {
  const parsed = value === undefined || value === "" ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
};

const requiredProductionSecrets = [
  "JWT_SECRET",
  "API_USERNAME",
  "API_PASSWORD",
  "SUPER_ADMIN_USERNAME",
  "SUPER_ADMIN_PASSWORD",
];
if (isProduction) {
  const missing = requiredProductionSecrets.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required production configuration: ${missing.join(", ")}`);
  }
}

module.exports = {
  // Server
  PORT: parsePositiveInt(process.env.PORT, 3000, "PORT"),
  NODE_ENV: process.env.NODE_ENV || "development",
  UPLOAD_ROOT: process.env.UPLOAD_ROOT,
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  REQUEST_TIMEOUT_MS: parsePositiveInt(
    process.env.REQUEST_TIMEOUT_MS,
    120000,
    "REQUEST_TIMEOUT_MS",
  ),

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parsePositiveInt(process.env.DB_PORT, 5432, "DB_PORT"),
  DB_NAME: process.env.DB_NAME || "center_db",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  DB_SSL: parseBoolean(process.env.DB_SSL, false),
  DB_SSL_REJECT_UNAUTHORIZED: parseBoolean(
    process.env.DB_SSL_REJECT_UNAUTHORIZED,
    isProduction,
  ),
  DATABASE_CA_CERT: process.env.DATABASE_CA_CERT,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRES_DATE: process.env.EXPIRES_DATE || "7d",

  // API Auth
  API_USERNAME: process.env.API_USERNAME,
  API_PASSWORD: process.env.API_PASSWORD,

  // Super Admin
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,

  // Database Pool
  DB_POOL_MAX: parsePositiveInt(process.env.DB_POOL_MAX, 20, "DB_POOL_MAX"),
  DB_POOL_IDLE_TIMEOUT: parsePositiveInt(
    process.env.DB_POOL_IDLE_TIMEOUT,
    30000,
    "DB_POOL_IDLE_TIMEOUT",
  ),
  DB_POOL_CONNECTION_TIMEOUT: parsePositiveInt(
    process.env.DB_POOL_CONNECTION_TIMEOUT,
    5000,
    "DB_POOL_CONNECTION_TIMEOUT",
  ),

  // WhatsApp Configuration
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID,
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,

  // WhatsApp Templates
  WHATSAPP_TEMPLATE_WELCOME: process.env.WHATSAPP_TEMPLATE_WELCOME || "welcome",
  WHATSAPP_TEMPLATE_ABSENCE: process.env.WHATSAPP_TEMPLATE_ABSENCE || "absent",
  WHATSAPP_TEMPLATE_PAYMENT: process.env.WHATSAPP_TEMPLATE_PAYMENT || "payment",
  WHATSAPP_TEMPLATE_EXAM: process.env.WHATSAPP_TEMPLATE_EXAM || "exam",
};
