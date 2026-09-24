const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const { UPLOAD_ROOT } = require("./utils/fileStorage");
const swaggerUi = require("swagger-ui-express");

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
// SWAGGER DEBUG LOG (remove after confirming it works)
// ============================================

console.log(
  "[Swagger] Paths loaded:",
  Object.keys(swaggerSpec.paths || {}).length,
);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet with custom CSP that allows Swagger UI to work
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "data:"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);

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
  const allowedOrigins = env.CORS_ORIGINS;
  const allowAllOrigins = allowedOrigins.length === 0 && env.NODE_ENV !== "production";
  const originAllowed = Boolean(origin && allowedOrigins.includes(origin));

  if (originAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  } else if (allowAllOrigins) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "false");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-client-key, x-super-admin-key",
  );
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
  express.static(path.join(UPLOAD_ROOT, "thumbnails"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=86400");
    },
  }),
);

app.use(
  "/uploads/videoFiles",
  express.static(path.join(UPLOAD_ROOT, "videoFiles"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=86400");
    },
  }),
);

app.use(
  "/uploads/photos",
  express.static(path.join(UPLOAD_ROOT, "photos"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "private, no-cache");
    },
  }),
);
app.use(
  "/uploads/assignments",
  express.static(path.join(UPLOAD_ROOT, "assignments"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "private, no-cache");
      res.setHeader("Content-Disposition", "inline");
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

// ============================================
// SWAGGER UI (serves from node_modules - no CDN needed)
// ============================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "JupiterLearn API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
    },
  }),
);

app.get("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
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
app.use("/api/parent", parentRoutes);
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
