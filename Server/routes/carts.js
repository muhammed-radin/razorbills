import express from "express";
import { randomUUID } from "node:crypto";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { CartModel } from "../models/schema/cart.js";
import { evt, Evts } from "../utils/events.manage.js";
import { toCartProduct } from "../models/schema/product.js";

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
    .find({ id: { $in: productIds } })
    .toArray();

  console.log(productsFinded, "products found in the cart");

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

  let totalAmount = 0;
  const products = productsFinded.map((product) => {
    totalAmount += product?.price;
    const cartProduct = toCartProduct(
      product,
      productQuantities[product.id] || 1,
    );
    cartProduct.productId = cartProduct.id; // Ensure productId is set for consistency
    cartProduct.quantity = Math.min(
      productQuantities[product.id] || 1,
      product.stock || 1,
    ); // Ensure quantity does not exceed stock
    return product.isActive ? cartProduct : null;
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
router.post("/", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId || !productId || !Number.isFinite(Number(quantity))) {
      throw {
        error: "Missing required fields: userId, productId, or quantity",
        errorCode: 400,
      };
    }

    const productExists = await db
      .collection("products")
      .findOne({ id: productId });

    if (!productExists) {
      throw { error: "Product not found", errorCode: 404 };
    }

    const minimalProduct = toCartProduct(
      {
        ...productExists,
        id: productExists?.productId || productExists?.id,
      },
      Number(quantity),
    );
    minimalProduct.quantity = Number(quantity);
    minimalProduct.productId = minimalProduct.id; // Ensure productId is set for consistency
    console.log(minimalProduct, "minimal product to be added to cart");

    const cart = await CartModel.findOne({ userId });
    const products = cart?.products || [];
    const numericQuantity = Number(quantity);

    const existingIndex = products.findIndex(
      (product) => String(product.productId) === String(productId),
    );

    const updatedProducts = [...products];

    if (existingIndex >= 0) {
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        quantity:
          Number(updatedProducts[existingIndex].quantity || 0) +
          numericQuantity,
      };
    } else {
      updatedProducts.push(minimalProduct);
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          products: updatedProducts,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          id: randomUUID(),
          userId,
          createdAt: new Date(),
          totalAmount: 0,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    evt.fire(Evts.PRODUCT_CARTED, {
      cart: updatedCart,
      productId,
      quantity: numericQuantity,
    });

    evt.fire(Evts.CART_ITEM_ADDED, {
      cart: updatedCart,
      productId,
      quantity: numericQuantity,
    });

    res.json(updatedCart);
  } catch (error) {
    evt.fire(Evts.CART_ERROR, {
      ...error,
      error,
      errorCode: error.code || 500,
    });

    res
      .status(error.errorCode || 500)
      .json({ error: error.error || "Failed to add product to cart" });
  }
});

/* DELETE remove product from cart: single product */
router.delete("/", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    const cart = await CartModel.findOne({
      userId,
      products: {
        $elemMatch: { productId },
      },
    });

    if (!cart) {
      evt.fire(Evts.CART_ERROR, {
        error: "Cart or product not found",
        errorCode: 404,
      });

      return res.status(404).json({
        error: "Cart or product not found",
      });
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      { userId },
      {
        $pull: {
          products: { productId },
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      },
    );

    evt.fire(Evts.CART_ITEM_REMOVED, {
      cart: updatedCart,
      productId,
    });

    res.json(updatedCart);
  } catch (error) {
    evt.fire(Evts.CART_ERROR, {
      error,
      errorCode: error.code || 500,
    });

    res.status(500).json({ error: "Failed to remove product from cart" });
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
