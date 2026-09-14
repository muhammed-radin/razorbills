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
import jobsRouter from "./jobs.js";
import { devMiddleware } from "../utils/middlewares/dev.js";
import { evt } from "../utils/events.manage.js";

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

/* Agenda Development Routes */
router.use("/jobs", devMiddleware, jobsRouter);

// Debug Logs SSE
router.get("/logs", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendLog = (log) => {
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  };

  const logListener = (log) => {
    sendLog(log);
  };

  sendLog({ message: "Connected to log stream" });
  sendLog({ message: "Listening for log events..." });

  // Subscribe to log events
  evt.onListen = logListener;

  // Clean up when the client disconnects
  req.on("close", () => {
    evt.onListen = () => {};
  });
});

export default router;
