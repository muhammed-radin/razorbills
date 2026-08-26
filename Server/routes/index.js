import express from "express";
import productsRouter from "./products.js";
import usersRouter from "./users.js";
import categoriesRouter from "./categories.js";
import { requireAuth } from "../utils/middlewares/reqiuredAuth.js";

const router = express.Router();

/* Product routes */
router.use("/products", productsRouter);

/* User routes */
router.use("/users", requireAuth, usersRouter);
router.use("/usersdev", usersRouter);

/* Category routes */
router.use("/categories", categoriesRouter);

export default router;
