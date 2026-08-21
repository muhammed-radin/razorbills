import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import { db, connectToDatabase } from "./utils/db.js";
import { validateApiKeys } from "./utils/key.js";
import { auth } from "./utils/auth.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.all("/api/auth/*", toNodeHandler(auth));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectToDatabase().then(() => {
  console.log("Database connection established. Starting API...");
});

function checkDatabaseConnection(req, res, next) {
  if (!db) {
    return res
      .status(503)
      .json({ message: "Database connection not established" });
  }
  next();
}

// start api after db connection is established
app.use("/api", validateApiKeys, checkDatabaseConnection, indexRouter);

if (process.argv[1] && (process.argv[1].endsWith("/app.js") || process.argv[1].endsWith("\\app.js"))) {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

export default app;
