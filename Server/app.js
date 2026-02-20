var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cors = require("cors");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", indexRouter);

// validate keys with env vars
app.use(function (req, res, next) {
  if (
    req.headers["server-api-key"] === process.env.SERVER_API_KEY ||
    process.env.DEV_MODE === "true"
  ) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Invalid API Key" });
    return;
  }

  if (
    req.method === "POST" ||
    req.method === "PUT" ||
    req.method === "DELETE"
  ) {
    if (req.headers["actions-api-key"] === process.env.ACTION_ACESS_TOKEN) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Invalid Actions API Key" });
      return;
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
module.exports = app;
