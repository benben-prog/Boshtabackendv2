process.env.TZ = "Africa/Cairo";

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
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
const liveSessionsController = require("./modules/live_sessions/live_sessions.controller");

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
const studentAuth = require("./middlewares/studentAuth.middleware");

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
// CORS (Configured & Controlled)
// ============================================

const allowedOrigins = [
  "https://boshta.benb3n.cloud",
  "https://backend.benb3n.cloud",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  ...(env.CORS_ORIGINS || []),
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowed = origin && (allowedOrigins.includes(origin) || env.NODE_ENV !== "production");

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  } else if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-client-key, x-super-admin-key, *",
  );
  res.setHeader("Access-Control-Expose-Headers", "*");
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
app.use(
  "/uploads/exams",
  express.static(path.join(UPLOAD_ROOT, "exams"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "private, no-cache");
      res.setHeader("Content-Disposition", "inline");
    },
  }),
);
app.use(
  "/uploads/live_materials",
  express.static(path.join(UPLOAD_ROOT, "live_materials"), {
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
    customSiteTitle: "Boshta Learn Platform API Docs | منصة بوشطة التعليمية",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      filter: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
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

async function refreshPlatformStatus(retries = 3) {
  try {
    const result = await query(
      "SELECT platform_status FROM settings WHERE id = 1",
    );
    platformStatusCache.status = result.rows[0]?.platform_status || "active";
    platformStatusCache.lastUpdated = new Date();
  } catch (error) {
    if (retries > 0) {
      setTimeout(() => refreshPlatformStatus(retries - 1), 3000);
    } else {
      console.error("Error fetching platform status:", error.message);
    }
  }
}

// Initial fetch with slight delay to allow DB pool handshake to complete
setTimeout(() => refreshPlatformStatus(), 1500);

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

// ============================================
// DIRECT BROWSER DOWNLOADS & PREVIEWS
// (Browser direct navigation, clicks, or new tabs without API Basic Auth headers)
// ============================================
const liveDownloadRoutes = [
  "/api/student/live-sessions/:id/download-material",
  "/api/student/live-sessions/:id/download",
  "/api/student/live-sessions/:id/preview",
  "/api/teacher/live-sessions/:id/download-material",
  "/api/teacher/live-sessions/:id/download",
  "/api/teacher/live-sessions/:id/preview",
  "/api/assistant/live-sessions/:id/download-material",
  "/api/assistant/live-sessions/:id/download",
  "/api/assistant/live-sessions/:id/preview",
  "/api/super-admin/live-sessions/:id/download-material",
  "/api/super-admin/live-sessions/:id/download",
  "/api/super-admin/live-sessions/:id/preview",
  "/api/live-sessions/:id/download",
  "/api/live-sessions/:id/download-material",
  "/api/live-sessions/:id/preview",
];
// Rate Limiter for Authentication (protects against credential stuffing & bcrypt DoS)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "تم تجاوز عدد محاولات الدخول المسموح بها، يرجى المحاولة بعد 15 دقيقة",
  },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/student", apiMiddelware, clientAuth, studentAuth, studentModuleRoutes);
app.use("/api/parent", parentRoutes);
app.use(
  "/api/assistant",
  apiMiddelware,
  clientAuth,
  assistantAuth,
  assistantRoutes,
);
// Google OAuth Callback (Browser redirect from Google, no API client auth headers)
app.get(
  "/api/teacher/google/callback",
  liveSessionsController.handleGoogleCallback,
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
