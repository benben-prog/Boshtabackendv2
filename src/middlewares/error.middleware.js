const env = require("../config/env");

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // PostgreSQL errors
  if (err.code === "23505") {
    statusCode = 409;
    message = "Duplicate data";
  } else if (err.code === "23503") {
    statusCode = 400;
    message = "Related data not found";
  } else if (err.code === "23502") {
    statusCode = 400;
    message = "Required data missing";
  } else if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid data format";
  }

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds limit";
    } else {
      message = "File upload error";
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error
  if (env.NODE_ENV === "production") {
    console.error("Error:", {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
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
    message: "Route not found",
  });
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};
