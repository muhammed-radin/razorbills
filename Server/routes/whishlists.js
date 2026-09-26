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
      new ClassicEvent({
        type: Evts.WISHLIST_UPDATED,
        isMajor: false,
        sector: "wishlist",
        content: { userId, folder, wishlist: updatedWishlist },
        userId: userId,
        wishlist: updatedWishlist,
        wishlistId: updatedWishlist?._id || null,
        actorId: userId,
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

// add new single product to wishlist ( upsert )
router.post("/", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const { product } = req.body;
    let folder = req.body?.folder || req.query?.folder || "/";

    if (!product) {
      evt.fire(
        Evts.WISHLIST_ERROR,
        new ErrorEvent({
          type: Evts.WISHLIST_ERROR,
          error: "Invalid wishlist data. 'product' is required.",
          errorCode: 400,
          data: { userId, folder },
        }),
      );
      return res.status(400).json({
        error: "Invalid wishlist data. 'product' is required.",
      });
    }

    let filteredProducts = [product];

    // get existing wishlist
    const existingWishlist = await WishlistModel.findOne({ userId, folder });

    // validate products: remove duplicate products and push filtered products.
    if (existingWishlist) {
      existingWishlist.products.forEach((existingProduct) => {
        const isDuplicate = filteredProducts.some(
          (p) => p.productId === existingProduct.productId,
        );
        if (!!isDuplicate) {
          filteredProducts.push(existingProduct);
        }
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

    console.log("Wishlist updated/created:", newWishList);

    evt.fire(
      Evts.WISHLIST_ADDED,
      new ClassicEvent({
        type: Evts.WISHLIST_ADDED,
        isMajor: false,
        sector: "wishlist",
        content: newWishList,
        userId: userId,
        folder: folder,
        products: filteredProducts,
        wishlistId: newWishList._id,
        actorId: userId,
      }),
    );
    evt.fire(
      Evts.PRODUCT_WISHLISTED,
      new ClassicEvent({
        type: Evts.PRODUCT_WISHLISTED,
        isMajor: true,
        sector: "wishlist",
        content: newWishList,
        userId: userId,
        productId: product.id || product.productId,
        wishlistId: newWishList._id,
        actorId: userId,
      }),
    );

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
      new ClassicEvent({
        type: Evts.WISHLIST_REMOVED,
        isMajor: false,
        sector: "wishlist",
        content: { userId, folder, productId },
        userId: userId,
        productId: productId,
        wishlistId: wishlist._id,
        actorId: userId,
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
