import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { WishlistModel } from "../models/schema/whishlist.js";
import { ErrorEvent, evt, Evts } from "../utils/events.manage.js";
import { ClassicEvent } from "../models/event.js";

const router = express.Router();

// sync price, availability,
async function syncWishlistProducts(wishlist) {
  if (!wishlist || !wishlist.products || !Array.isArray(wishlist.products)) {
    return wishlist;
  }

  const productIds = wishlist.products.map((product) => product.productId);

  const productsFinded = await db
    .collection("products")
    .find({ productId: { $in: productIds } });

  if (
    !productsFinded ||
    !Array.isArray(productsFinded) ||
    productsFinded.length === 0
  ) {
    return wishlist;
  }

  const products = prroductsFinded.map((product) => {
    return product?.toMinimal();
  });

  const updatedWishlist = await WishlistModel.updateOne(
    { userId: wishlist.userId, folder: wishlist.folder },
    { $set: { products, updatedAt: new Date() } },
  );

  return updatedWishlist;
}

async function syncMiddleware(req, res, next) {
  const userId = req.user?.id;
  const folder = req.body?.folder || req.query?.folder || "/";
  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  const wishlist = await WishlistModel.findOne({ userId, folder });
  if (!wishlist) {
    evt.fire(
      Evts.WISHLIST_ERROR,
      new ErrorEvent({
        type: Evts.WISHLIST_ERROR,
        error: "Wishlist not found",
        errorCode: 404,
        data: { userId, folder },
      }),
    );
    return res.status(404).json({ error: "Wishlist not found" });
  } else {
    const updatedWishlist = await syncWishlistProducts(wishlist);
    evt.fire(
      Evts.WISHLIST_UPDATED,
      new ClassicEvent(Evts.WISHLIST_UPDATED, false, "wishlist", {
        userId,
        folder,
      }),
    );
    next();
  }
}

router.get("/", requireAuth, passUserAuth, syncMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const folder = req.body?.folder || req.query?.folder || "/";

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    WishlistModel.findOne({ userId, folder })
      .then((wishlists) => {
        if (!wishlists) {
          return res.status(404).json({ error: "Wishlist not found" });
        }
        res.json(wishlists);
      })
      .catch((err) => {
        console.error("Error fetching wishlists:", err);
        res.status(500).json({ error: "Failed to fetch wishlists" });
      });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ error: "Failed to fetch wishlists" });
  }
});

// add new product to wishlist ( upsert )
router.post("/", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const { folder, products } = req.body;

    if (!products || !Array.isArray(products)) {
      evt.fire(
        Evts.WISHLIST_ERROR,
        new ErrorEvent({
          type: Evts.WISHLIST_ERROR,
          error: "Invalid wishlist data. 'name' and 'products' are required.",
          errorCode: 400,
          data: { userId, folder },
        }),
      );
      return res.status(400).json({
        error: "Invalid wishlist data. 'name' and 'products' are required.",
      });
    }

    let filteredProducts = products;

    // get existing wishlist
    const existingWishlist = await WishlistModel.findOne({ userId, folder });

    // validate products: duplicate products
    if (existingWishlist) {
      const duplicateProducts = existingWishlist.products.map((product) => {
        if (products.some((p) => p.productId === product.productId)) {
          filteredProducts = products.filter(
            (p) => p.productId !== product.productId,
          );
          return product;
        }
        return null;
      });
    }

    const newWishList = await WishlistModel.findOneAndUpdate(
      { userId, folder },
      {
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          folder: folder || "/",
          userId: userId,
          products: filteredProducts,
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    evt.fire(
      Evts.WISHLIST_ADDED,
      new ClassicEvent(Evts.WISHLIST_ADDED, false, "wishlist", {
        userId,
        folder,
        products: filteredProducts,
      }),
    );
    filteredProducts.forEach((p) => {
      evt.fire(
        Evts.PRODUCT_WISHLISTED,
        new ClassicEvent(Evts.PRODUCT_WISHLISTED, false, "wishlist", {
          userId,
          folder,
          productId: p.productId,
        }),
      );
    });

    res.json(newWishList);
  } catch (error) {
    evt.fire(
      Evts.WISHLIST_ERROR,
      new ErrorEvent({
        type: Evts.WISHLIST_ERROR,
        error: error,
        errorCode: error.code || 500,
        data: {
          userId: req.user?.id,
          folder: req.body?.folder || req.query?.folder || "/",
        },
      }),
    );
    console.error("Error creating wishlist:", error);
    res.status(500).json({ error: "Failed to create wishlist" });
  }
});

// remove wishlist product
router.delete("/", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const { folder, productId } = req.body;

    const wishlist = await WishlistModel.findOne({ userId, folder });
    if (!wishlist) {
      evt.fire(
        Evts.WISHLIST_ERROR,
        new ErrorEvent({
          type: Evts.WISHLIST_ERROR,
          error: "Wishlist not found",
          errorCode: 404,
          data: { userId, folder },
        }),
      );
      return res.status(404).json({ error: "Wishlist not found" });
    }

    const updatedWishlist = await WishlistModel.updateOne(
      { userId, folder },
      { $pull: { products: { productId } } },
    );

    evt.fire(
      Evts.WISHLIST_REMOVED,
      new ClassicEvent(Evts.WISHLIST_REMOVED, false, "wishlist", {
        userId,
        folder,
        productId,
      }),
    );
    res.json(updatedWishlist);
  } catch (error) {
    evt.fire(
      Evts.WISHLIST_ERROR,
      new ErrorEvent({
        type: Evts.WISHLIST_ERROR,
        error: error,
        errorCode: error.code || 500,
        data: {
          userId: req.user?.id,
          folder: req.body?.folder || req.query?.folder || "/",
          productId: req.body?.productId,
        },
      }),
    );
    console.error("Error deleting wishlist:", error);
    res.status(500).json({ error: "Failed to delete wishlist" });
  }
});

export default router;
