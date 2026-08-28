const app = require("./app");
const env = require("./config/env");
const { testConnection, closePool } = require("./config/database");

// Vercel Serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  let server;

  async function start() {
    try {
      // Test database connection
      const isConnected = await testConnection();

      if (!isConnected) {
        console.error("Failed to connect to database");
        process.exit(1);
      }

      // Start server
      server = app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
        console.log(`Environment: ${env.NODE_ENV}`);
        console.log(`API Docs: http://localhost:${env.PORT}/api-docs`);
      });

      // Server settings
      server.keepAliveTimeout = 65000;
      server.headersTimeout = 66000;
      server.requestTimeout = 0;
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    if (server) {
      server.close(async () => {
        console.log("HTTP server closed");
        await closePool();
        console.log("Database pool closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("Forced shutdown");
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  // Listen for shutdown signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  // Handle unexpected errors
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });

  start();
}
