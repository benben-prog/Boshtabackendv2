const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

// Routes
const authRouts = require("./modules/auth/auth.routes");
const studentModuleRoutes = require("./modules/student/student.routes");
const parentRoutes = require("./modules/parent/parent.routes");
const assistantRoutes = require("./modules/assistant/assistant.routes");
const teacherRoutes = require("./modules/teacher/teacher.routes");
const superAdminRoutes = require("./modules/super-admin/super-admin.routes");
const whatsappRoutes = require("./modules/whatsapp_messages/whatsapp_messages.routes");
const webhookRoutes = require("./routes/webhook.routes");

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
const rateLimit = require("express-rate-limit");

// Database
const { query } = require("./config/database");
const env = require("./config/env");

// Swagger
const swaggerSpec = require("./docs/swagger");

const app = express();

// ============================================
// RATE LIMITING
// ============================================

const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    message: "Too many requests from this IP",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.RATE_LIMIT_AUTH_MAX || 5,
  message: {
    success: false,
    message: "Too many login attempts from this IP",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// CORS HEADERS
// ============================================

const allowedOrigins = env.CORS_ORIGINS || ["*"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-client-key, x-super-admin-key",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ============================================
// STATIC FILES
// ============================================

const staticFileAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization required",
    });
  }
  next();
};

app.use(
  "/uploads",
  staticFileAuth,
  express.static(path.join(process.cwd(), "uploads")),
);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

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
// PLATFORM STATUS CHECK
// ============================================

let platformStatusCache = {
  status: "active",
  lastChecked: null,
};
const CACHE_TTL = 60000;

const checkPlatformStatus = async (req, res, next) => {
  try {
    const now = Date.now();
    if (
      req.path.includes("/super-admin") ||
      req.path.includes("/auth") ||
      req.path.includes("/health") ||
      req.path.includes("/uploads") ||
      req.path.includes("/api-docs") ||
      req.path.includes("/webhook")
    ) {
      return next();
    }

    if (
      platformStatusCache.lastChecked &&
      now - platformStatusCache.lastChecked < CACHE_TTL
    ) {
      if (platformStatusCache.status === "paused") {
        return res.status(403).json({
          success: false,
          message: "Platform is temporarily closed for maintenance",
        });
      }
      return next();
    }

    const result = await query(
      "SELECT platform_status FROM settings WHERE id = 1",
    );
    const platformStatus = result.rows[0]?.platform_status || "active";

    platformStatusCache.status = platformStatus;
    platformStatusCache.lastChecked = now;

    if (platformStatus === "paused") {
      return res.status(403).json({
        success: false,
        message: "Platform is temporarily closed for maintenance",
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

app.use("/api/auth", authLimiter, authRouts);
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
app.use(
  "/api/super-admin",
  apiMiddelware,
  clientAuth,
  superAdminAuth,
  superAdminRoutes,
);

// ============================================
// WHATSAPP ROUTES
// ============================================

app.use("/webhook", webhookRoutes);
app.use(
  "/api/assistant/whatsapp",
  apiMiddelware,
  clientAuth,
  assistantAuth,
  whatsappRoutes,
);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
