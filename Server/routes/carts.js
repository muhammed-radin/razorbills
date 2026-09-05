import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { CartModel } from "../models/schema/cart.js";

const router = express.Router();

// sync price, availability, etc.
async function syncCartProducts(req, res, next) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  const cart = await CartModel.findOne({ userId });
  if (!cart || !cart.products || !Array.isArray(cart.products)) {
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
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  },
);

/* POST add product to cart */
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
  res.json(cart);
});

export default router;
