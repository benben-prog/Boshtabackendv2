const dotenv = require("dotenv");
const path = require("path");

// Load environment file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({ path: path.join(__dirname, "../../", envFile) });

module.exports = {
  // Server
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  UPLOAD_ROOT: process.env.UPLOAD_ROOT,

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "center_db",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  DB_SSL: process.env.DB_SSL || "false",
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
  DB_POOL_MAX: Number(process.env.DB_POOL_MAX) || 20,
  DB_POOL_IDLE_TIMEOUT: Number(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
  DB_POOL_CONNECTION_TIMEOUT:
    Number(process.env.DB_POOL_CONNECTION_TIMEOUT) || 5000,

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
