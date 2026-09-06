import express from "express";
import productsRouter from "./products.js";
import usersRouter from "./users.js";
import categoriesRouter from "./categories.js";
import { requireAuth } from "../utils/middlewares/reqiuredAuth.js";
import interactionsRouter from "./interactions.js";
import wishlistsRouter from "./whishlists.js";
import cartRouter from "./carts.js";
import AddressRouter from "./address.js";
import OrderRouter from "./orders.js";
import commentsRouter from "./comments.js";

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

/* Cart routes */
router.use("/cart", cartRouter);

/* Address routes */
router.use("/address", requireAuth, AddressRouter);

/* Order routes */
router.use("/orders", requireAuth, OrderRouter);

/* Comment routes */
router.use("/comments", requireAuth, commentsRouter);

export default router;
