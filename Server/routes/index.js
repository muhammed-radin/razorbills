var express = require("express");
var router = express.Router();

/* Product routes */
var productsRouter = require("./products");
router.use("/products", productsRouter);

/* User routes */
var usersRouter = require("./users");
router.use("/users", usersRouter);

/* Auth routes */
var authRouter = require("./auth");
router.use("/auth", authRouter);

module.exports = router;
