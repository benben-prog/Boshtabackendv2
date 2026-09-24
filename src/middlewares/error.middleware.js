const env = require("../config/env");

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "حدث خطأ داخلي في السيرفر";

  // Handle PostgreSQL errors
  if (err.code === "23505") {
    statusCode = 409;
    message = "البيانات موجودة مسبقاً";
  } else if (err.code === "23503") {
    statusCode = 400;
    message = "البيانات المرتبطة غير موجودة";
  } else if (err.code === "23502") {
    statusCode = 400;
    message = "بيانات مطلوبة غير موجودة";
  } else if (err.code === "22P02") {
    statusCode = 400;
    message = "صيغة البيانات غير صحيحة";
  }

  // Handle Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 413;
      message = "حجم الملف يتجاوز الحد المسموح";
    } else {
      statusCode = 400;
      message = "حدث خطأ في رفع الملف";
    }
  }

  if (err.code === "INVALID_FILE_TYPE") {
    statusCode = 415;
    message = err.message || "نوع الملف غير مدعوم";
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "توكن غير صالح";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "انتهت صلاحية التوكن";
  }

  // Handle JSON parse errors
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "صيغة JSON غير صحيحة";
  }

  // Handle Payload too large
  if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "حجم البيانات كبير جداً";
  }

  // Log error
  if (env.NODE_ENV === "production") {
    console.error("Error:", {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error("Error:", err);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "المسار غير موجود",
  });
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};
