import express from "express";
import productsRouter from "./products.js";
import usersRouter from "./users.js";
import categoriesRouter from "./categories.js";
import { requireAuth } from "../utils/middlewares/reqiuredAuth.js";
import interactionsRouter from "./interactions.js";
import wishlistsRouter from "./whishlists.js";

const router = express.Router();

/* Product routes */
router.use("/products", productsRouter);

/* User routes */
router.use("/users", usersRouter);

/* Category routes */
router.use("/categories", categoriesRouter);

/* Interaction routes */
router.use("/interactions", interactionsRouter);

/* Wishlist routes */
router.use("/wishlists", wishlistsRouter);

export default router;
