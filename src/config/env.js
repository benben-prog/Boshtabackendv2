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

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "center_db",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRES_DATE: process.env.EXPIRES_DATE || "7d",

  // API Auth
  API_USERNAME: process.env.API_USERNAME,
  API_PASSWORD: process.env.API_PASSWORD,

  // Super Admin
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,

  // CORS
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "*").split(","),

  // Rate Limit
  RATE_LIMIT_WINDOW_MS:
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,
  RATE_LIMIT_AUTH_MAX: Number(process.env.RATE_LIMIT_AUTH_MAX) || 5,

  // Database Pool
  DB_POOL_MAX: Number(process.env.DB_POOL_MAX) || 20,
  DB_POOL_IDLE_TIMEOUT: Number(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
  DB_POOL_CONNECTION_TIMEOUT:
    Number(process.env.DB_POOL_CONNECTION_TIMEOUT) || 5000,
};
