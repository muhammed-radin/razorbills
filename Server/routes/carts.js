import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { CartModel } from "../models/schema/cart.js";
import { evt, Evts } from "../utils/events.manage.js";

const router = express.Router();

// sync price, availability, etc.
async function syncCartProducts(req, res, next) {
  const userId = req.user?.id;
  if (!userId) {
    evt.fire(Evts.CART_ERROR, {
      error: "User ID not found in request",
      errorCode: 400,
    });
    return res.status(400).json({ error: "User ID not found in request" });
  }

  const cart = await CartModel.findOne({ userId });
  if (!cart || !cart.products || !Array.isArray(cart.products)) {
    evt.fire(Evts.CART_ERROR, { error: "Cart not found", errorCode: 404 });
    return res.status(404).json({ error: "Cart not found" });
  }

  const productIds = [];
  const productQuantities = {};

  cart.products.map((product) => {
    productIds.push(product.productId);
    productQuantities[product.productId] = product.quantity;
  });

  const productsFinded = await db
    .collection("products")
    .find({ productId: { $in: productIds } });

  if (
    !productsFinded ||
    !Array.isArray(productsFinded) ||
    productsFinded.length === 0
  ) {
    evt.fire(Evts.CART_ERROR, {
      error: "No products found in the cart",
      errorCode: 404,
    });
    return res.status(404).json({ error: "No products found in the cart" });
  }

  const totalAmount = 0;
  const products = productsFinded.map((product) => {
    totalAmount += product?.price;
    return product?.toCartProduct(productQuantities[product.productId])();
  });

  const updatedCart = await CartModel.updateOne(
    { userId },
    { $set: { products, totalAmount, updatedAt: new Date() } },
  );

  next();
  evt.fire(Evts.CART_UPDATED, updatedCart);
}

/* GET users listing. */
router.get(
  "/",
  requireAuth,
  passUserAuth,
  syncCartProducts,
  async function (req, res) {
    const userId = req.user?.id;
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      evt.fire(Evts.CART_ERROR, { error: "Cart not found", errorCode: 404 });
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  },
);

/* POST add product to cart: single product */
router.post("/", requireAuth, passUserAuth, async function (req, res) {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  let cart = await CartModel.findOne({ userId });
  if (!cart) {
    cart = await CartModel.create({ userId, products: [] });
  }

  const productIndex = cart.products.findIndex(
    (p) => p.productId === productId,
  );
  if (productIndex >= 0) {
    cart.products[productIndex].quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  evt.fire(Evts.PRODUCT_CARTED, { cart, productId, quantity });
  evt.fire(Evts.CART_ITEM_ADDED, { cart, productId, quantity });
  res.json(cart);
});

/* DELETE remove product from cart: single product */
router.delete("/", requireAuth, passUserAuth, async function (req, res) {
  const userId = req.user?.id;
  const { productId } = req.body;

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    evt.fire(Evts.CART_ERROR, { error: "Cart not found", errorCode: 404 });
    return res.status(404).json({ error: "Cart not found" });
  }

  const productIndex = cart.products.findIndex(
    (p) => p.productId === productId,
  );
  if (productIndex >= 0) {
    cart.products.splice(productIndex, 1);
    await cart.save();
    evt.fire(Evts.CART_ITEM_REMOVED, { cart, productId });
    res.json(cart);
  } else {
    evt.fire(Evts.CART_ERROR, {
      error: "Product not found in cart",
      errorCode: 404,
    });
    res.status(404).json({ error: "Product not found in cart" });
  }
});

// DELETE clear all products from cart
router.delete("/clear", requireAuth, passUserAuth, async function (req, res) {
  const userId = req.user?.id;

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    cart = await CartModel.create({ userId, products: [] });
  }

  cart.products = [];
  await cart.save();
  evt.fire(Evts.CART_CLEARED, { cart });
  res.json(cart);
});

// PUT update product quantity in cart
router.put("/", requireAuth, passUserAuth, async function (req, res) {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    evt.fire(Evts.CART_ERROR, { error: "Cart not found", errorCode: 404 });
    return res.status(404).json({ error: "Cart not found" });
  }

  const productIndex = cart.products.findIndex(
    (p) => p.productId === productId,
  );
  if (productIndex >= 0) {
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    evt.fire(Evts.CART_ITEM_UPDATED, { cart, productId, quantity });
    res.json(cart);
  } else {
    evt.fire(Evts.CART_ERROR, {
      error: "Product not found in cart",
      data: { cart, productId, quantity },
      errorCode: 404,
    });
    res.status(404).json({ error: "Product not found in cart" });
  }
});

export default router;
