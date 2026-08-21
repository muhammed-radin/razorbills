var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cors = require("cors");

const { db, connectToDatabase } = require("./utils/db");
const { validateApiKeys } = require("./utils/key");

const { auth } = require("./utils/auth");

var app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.all("/api/*", toNodeHandler(auth));
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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
module.exports = app;
