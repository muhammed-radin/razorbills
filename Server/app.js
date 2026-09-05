import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import rateLimit from "express-rate-limit";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import {
  db,
  connectToDatabase,
  checkDatabaseConnection,
  startDB,
} from "./utils/db.js";
import { validateApiKeys } from "./utils/key.js";
import createAuth from "./utils/auth.js";
import { dbEventNames, dbEvents } from "./utils/events.manage.js";
import mongoErrorHandler from "./utils/middlewares/mongoErrorHandler.js";

// 1. Define global relaxed limiter for standard data routes
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// 2. Define strict limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Strict limit: max 20 auth attempts per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login/signup attempts. Please try again later." },
});

async function initAuth(req, res, next) {
  if (!db) {
    await connectToDatabase();
  }
  return toNodeHandler(createAuth(db))(req, res, next);
}

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(startDB);
app.use("/api/auth/*", authLimiter);
app.all("/api/auth/*", checkDatabaseConnection, initAuth);

app.use(globalApiLimiter);
app.use(logger("dev"));
app.use(mongoErrorHandler); // Global MongoDB error handler
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (
  process.argv[1] &&
  (process.argv[1].endsWith("/app.js") || process.argv[1].endsWith("\\app.js"))
) {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:" + process.env.PORT);
  });
}

// start api after db connection is established
app.use("/api", checkDatabaseConnection, indexRouter);

export default app;
