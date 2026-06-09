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

/* Admin routes */
var adminAuthRouter = require("./admin-auth");
router.use("/admin-auth", adminAuthRouter);

/* Category routes */
var categoriesRouter = require("./categories");
router.use("/categories", categoriesRouter);

module.exports = router;
