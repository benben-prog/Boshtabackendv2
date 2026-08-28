const { Pool } = require("pg");
const env = require("./env");

// Set timezone
process.env.TZ = "Africa/Cairo";

// SSL configuration
function getSslConfig() {
  if (env.NODE_ENV === "production") {
    const isLocalhost =
      env.DB_HOST === "localhost" ||
      env.DB_HOST === "127.0.0.1" ||
      (env.DATABASE_URL &&
        (env.DATABASE_URL.includes("localhost") ||
          env.DATABASE_URL.includes("127.0.0.1")));

    if (isLocalhost) {
      return false;
    }

    return {
      rejectUnauthorized: true,
      ...(process.env.DATABASE_CA_CERT && { ca: process.env.DATABASE_CA_CERT }),
    };
  }

  if (env.DB_SSL === "true" || env.DB_SSL === "1") {
    return {
      rejectUnauthorized: false,
    };
  }

  return false;
}

// Pool configuration
function getPoolConfig() {
  const config = {
    connectionTimeoutMillis: env.DB_POOL_CONNECTION_TIMEOUT,
    idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,
    max: env.DB_POOL_MAX,
    allowExitOnIdle: false,
    statement_timeout: 30000,
    query_timeout: 30000,
  };

  if (env.DATABASE_URL) {
    config.connectionString = env.DATABASE_URL;
    config.ssl = getSslConfig();
    return config;
  }

  return {
    ...config,
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: getSslConfig(),
  };
}

// Create pool
const pool = new Pool(getPoolConfig());

// Pool events
pool.on("connect", async (client) => {
  try {
    await client.query("SET TIME ZONE 'Africa/Cairo'");
    await client.query("SET datestyle TO 'ISO, DMY'");
    if (env.NODE_ENV !== "production") {
      console.log("Database connected successfully");
    }
  } catch (error) {
    console.error("Error setting timezone:", error.message);
  }
});

pool.on("error", (err) => {
  console.error("Database error:", err.message);
});

// Query function
async function query(text, params) {
  const client = await pool.connect();
  try {
    await client.query("SET TIME ZONE 'Africa/Cairo'");
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    if (env.NODE_ENV !== "production") {
      console.error("Query error:", {
        query: text.substring(0, 100),
        error: error.message,
      });
    } else {
      console.error("Query error:", error.message);
    }
    throw error;
  } finally {
    client.release();
  }
}

// Transaction helper
async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET TIME ZONE 'Africa/Cairo'");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Helper functions
async function getCurrentTime() {
  const result = await query("SELECT NOW() AS current_time");
  return result.rows[0].current_time;
}

async function checkTimezone() {
  const result = await query("SHOW timezone");
  return result.rows[0].TimeZone;
}

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const time = await getCurrentTime();
    const tz = await checkTimezone();
    console.log("Connected successfully!");
    console.log(`Server Time: ${time}`);
    console.log(`Timezone: ${tz}`);
    return true;
  } catch (error) {
    console.error("Connection failed:", error.message);
    return false;
  }
}

// Graceful shutdown
async function closePool() {
  try {
    await pool.end();
    console.log("Database pool closed");
  } catch (error) {
    console.error("Error closing pool:", error.message);
  }
}

module.exports = {
  pool,
  query,
  transaction,
  getCurrentTime,
  checkTimezone,
  testConnection,
  closePool,
};
