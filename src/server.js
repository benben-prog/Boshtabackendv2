const app = require("./app");
const env = require("./config/env");
const { testConnection, closePool } = require("./config/database");

const PORT = env.PORT;
const GRACEFUL_SHUTDOWN_TIMEOUT = 10000; // 10 seconds

let server = null;
let whatsappDispatcher = null;

async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("Failed to connect to database");
      process.exit(1);
    }

    // Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
    });

    // Configure server timeouts
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    server.requestTimeout = 0;

    // Start WhatsApp system
    try {
      whatsappDispatcher = require("./modules/whatsapp_messages/whatsapp_dispatcher.service");
      await whatsappDispatcher.startSystem();
      console.log("WhatsApp system started successfully");
    } catch (error) {
      console.error("Failed to start WhatsApp system:", error.message);
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`);

  // Stop WhatsApp system
  if (whatsappDispatcher) {
    try {
      whatsappDispatcher.stopSystem();
    } catch (error) {
      console.error("Error stopping WhatsApp system:", error.message);
    }
  }

  if (!server) {
    process.exit(0);
  }

  // Stop accepting new connections
  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await closePool();
      console.log("Database pool closed");
      process.exit(0);
    } catch (error) {
      console.error("Error closing database pool:", error.message);
      process.exit(1);
    }
  });

  // Force shutdown if graceful shutdown takes too long
  setTimeout(() => {
    console.error("Forced shutdown due to timeout");
    process.exit(1);
  }, GRACEFUL_SHUTDOWN_TIMEOUT);
}

// Handle process signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  gracefulShutdown("unhandledRejection");
});

// Start server (unless running on Vercel)
if (process.env.VERCEL) {
  module.exports = app;
} else {
  startServer();
}
