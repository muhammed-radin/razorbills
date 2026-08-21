import express from "express";
import productsRouter from "./products.js";
import usersRouter from "./users.js";
import authRouter from "./auth.js";
import adminAuthRouter from "./admin-auth.js";
import categoriesRouter from "./categories.js";

const router = express.Router();

/* Product routes */
router.use("/products", productsRouter);

/* User routes */
router.use("/users", usersRouter);

/* Auth routes */
router.use("/auth", authRouter);

/* Admin routes */
router.use("/admin-auth", adminAuthRouter);

/* Category routes */
router.use("/categories", categoriesRouter);

export default router;
