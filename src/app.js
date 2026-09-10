const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const studentModuleRoutes = require("./modules/student/student.routes");
const parentRoutes = require("./modules/parent/parent.routes");
const assistantRoutes = require("./modules/assistant/assistant.routes");
const teacherRoutes = require("./modules/teacher/teacher.routes");
const superAdminRoutes = require("./modules/super-admin/super-admin.routes");
const webhookRoutes = require("./webhook.routes");

// Middleware
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error.middleware");
const apiMiddelware = require("./middlewares/apiAuth.middleware");
const clientAuth = require("./middlewares/clientAuth.middleware");
const assistantAuth = require("./middlewares/assistantAuth.middleware");
const teacherAuth = require("./middlewares/teacherAuth.middleware");
const superAdminAuth = require("./middlewares/superAdminAuth.middleware");

// Database
const { query } = require("./config/database");
const env = require("./config/env");

// Swagger
const swaggerSpec = require("./docs/swagger");

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// LOGGING
// ============================================

if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// ============================================
// CORS HEADERS
// ============================================

app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-client-key, x-super-admin-key",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ============================================
// STATIC FILES - PUBLIC (thumbnails, videos)
// ============================================

app.use(
  "/uploads/thumbnails",
  express.static(path.join(process.cwd(), "uploads/thumbnails"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  }),
);

app.use(
  "/uploads/videoFiles",
  express.static(path.join(process.cwd(), "uploads/videoFiles"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  }),
);

app.use(
  "/uploads/photos",
  express.static(path.join(process.cwd(), "uploads/photos"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  }),
);

// ============================================
// ROOT ROUTES
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome To Jupiter Learn API!",
    version: "1.0.0",
    environment: env.NODE_ENV,
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});

app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>JupiterLearn API Docs</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: "/api-docs-json",
            dom_id: "#swagger-ui",
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
          });
        };
      </script>
    </body>
    </html>
  `);
});

// ============================================
// PLATFORM STATUS CHECK (with periodic refresh)
// ============================================

let platformStatusCache = {
  status: "active",
  lastUpdated: null,
};

const REFRESH_INTERVAL = 60000; // 60 seconds

async function refreshPlatformStatus() {
  try {
    const result = await query(
      "SELECT platform_status FROM settings WHERE id = 1",
    );
    platformStatusCache.status = result.rows[0]?.platform_status || "active";
    platformStatusCache.lastUpdated = new Date();
  } catch (error) {
    console.error("Error fetching platform status:", error.message);
  }
}

// Initial fetch
refreshPlatformStatus();

// Periodic refresh
setInterval(refreshPlatformStatus, REFRESH_INTERVAL);

const checkPlatformStatus = async (req, res, next) => {
  try {
    // Always allow these paths
    const allowedPaths = [
      "/api-docs",
      "/api-docs-json",
      "/webhook",
      "/health",
      "/super-admin",
    ];

    if (allowedPaths.some((path) => req.path.includes(path))) {
      return next();
    }

    if (platformStatusCache.status === "paused") {
      return res.status(403).json({
        success: false,
        message:
          "The platform is currently paused, please contact the administrator",
        platform_status: "paused",
        force_logout: true,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

app.use(checkPlatformStatus);

// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/student", apiMiddelware, clientAuth, studentModuleRoutes);
app.use("/api/parent", apiMiddelware, parentRoutes);
app.use(
  "/api/assistant",
  apiMiddelware,
  clientAuth,
  assistantAuth,
  assistantRoutes,
);
app.use("/api/teacher", apiMiddelware, clientAuth, teacherAuth, teacherRoutes);
app.use("/api/super-admin", apiMiddelware, superAdminAuth, superAdminRoutes);

// ============================================
// WEBHOOK ROUTES
// ============================================

app.use("/webhook", webhookRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
