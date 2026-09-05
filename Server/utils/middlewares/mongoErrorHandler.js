import mongoose from "mongoose";

// Helper to format structured error responses
const sendErrorResponse = (
  res,
  statusCode,
  status,
  message,
  details = null,
) => {
  return res.status(statusCode).json({
    status,
    message,
    ...(details && { details }),
  });
};

/**
 * Express Error Handling Middleware
 */
const mongoErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // --- 1. MONGODB OPERATIONAL ERRORS (NUMERIC CODES) ---

  // Code 11000: Duplicate Key / Unique Index Constraint Violation
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = Object.values(err.keyValue || {})[0] || "";
    const message = `Duplicate value error. The ${field} '${value}' already exists.`;
    return sendErrorResponse(res, 400, "fail", message, { field, value });
  }

  // Code 121: MongoDB Server-side Document Validation Failure
  if (err.code === 121) {
    const message = "Document failed MongoDB database-level validation rules.";
    return sendErrorResponse(res, 400, "fail", message, err.errInfo || null);
  }

  // Code 50: MaxTimeMSExpired (Query execution timeout)
  if (err.code === 50) {
    return sendErrorResponse(
      res,
      504,
      "fail",
      "Database operation timed out. Please try again.",
    );
  }

  // --- 2. MONGOOSE SCHEMA ERRORS (INSTANCE CHECKS) ---

  // Validation Error (Schema constraints like required, min/max, custom validators)
  if (err instanceof mongoose.Error.ValidationError) {
    const details = {};
    Object.keys(err.errors).forEach((key) => {
      details[key] = err.errors[key].message;
    });
    return sendErrorResponse(
      res,
      400,
      "fail",
      "Schema validation failed.",
      details,
    );
  }

  // Cast Error (Invalid ObjectIds, invalid data types)
  if (err instanceof mongoose.Error.CastError) {
    const message = `Invalid value '${err.value}' provided for field '${err.path}' (Expected type: ${err.kind}).`;
    return sendErrorResponse(res, 400, "fail", message, {
      path: err.path,
      value: err.value,
      expectedType: err.kind,
    });
  }

  // Server Selection Error (Database connection drop)
  if (err instanceof mongoose.Error.MongooseServerSelectionError) {
    console.error("💥 Database Connection Error:", err.message);
    return sendErrorResponse(
      res,
      503,
      "error",
      "Database service is temporarily unavailable.",
    );
  }

  // Document Not Found Error (Triggered via findOneOrFail style options)
  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return sendErrorResponse(
      res,
      404,
      "fail",
      "The requested database document could not be found.",
    );
  }

  // --- 3. GLOBAL FALLBACK ---

  // Log the unhandled error internally for debugging
  console.error("❌ Unhandled Application Error:", err);

  // In production, mask generic internal details from users
  const isProd = process.env.NODE_ENV === "production";
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "An unexpected error occurred.",
    ...(!isProd && { stack: err.stack }),
  });
};

export default mongoErrorHandler;
