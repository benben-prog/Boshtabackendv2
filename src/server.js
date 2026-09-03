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
      const isConnected = await testConnection();

      if (!isConnected) {
        console.error("Failed to connect to database");
        process.exit(1);
      }

      server = app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
        console.log(`Environment: ${env.NODE_ENV}`);
        console.log(`API Docs: http://localhost:${env.PORT}/api-docs`);
      });

      server.keepAliveTimeout = 65000;
      server.headersTimeout = 66000;
      server.requestTimeout = 0;

      // Load WhatsApp queue job
      try {
        require("./jobs/whatsappQueueJob");
        console.log("WhatsApp queue job loaded");
      } catch (error) {
        console.log("WhatsApp queue job not loaded:", error.message);
      }
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    if (server) {
      server.close(async () => {
        console.log("HTTP server closed");
        await closePool();
        console.log("Database pool closed");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("Forced shutdown");
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

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
