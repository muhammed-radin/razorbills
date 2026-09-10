// Development Middleware

const isDevelopment =
  (process.env.NODE_ENV || "development").trim().toLowerCase() ===
  "development";
export const devMiddleware = (req, res, next) => {
  if (isDevelopment) {
    next();
  } else {
    res.status(503).json({ message: "Development mode is not active." });
  }
};

// Production Middleware

export const prodMiddleware = (req, res, next) => {
  if (!isDevelopment) {
    next();
  } else {
    res.status(503).json({ message: "Production mode is not active." });
  }
};
