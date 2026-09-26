import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
  requireSession,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import { InteractionModel } from "../models/schema/interactions.js";
import { evt, Evts, ProductEvent } from "../utils/events.manage.js";
import { getAgenda, useAgenda } from "../utils/agenda.js";

const router = express.Router();

///////////////////////////////////////////////////////////////////////
///////////   PRODUCT INTERACTIONS (VIEWS, SHARES, RATES)   /////////
///////////////////////////////////////////////////////////////////////

//////////// VIEWS ////////////

const FLUSH_INTERVAL = 1000 * 60; // 1 minute
const FLUSH_BUFFER_SIZE = 30; // Flush when buffer reaches this size

const productInteractionBuffer = [];

// Incremental: Buffer all views instantly in memory ( "AllViews")
const viewBuffer = {}; // { productId: rawIncrementCount }

// user interaction ( "uniqueViews" )
const userInteractionViewBuffer = {}; // example: { productId: { userId1: 1, userId2: 1 } }

// guest interaction ( "uniqueViews" )
const guestInteractionViewBuffer = {}; // example: { productId: { userId1: 1, userId2: 1 } }

const cartBuffer = {}; // { productId: rawIncrementCount }

const shareBuffer = {}; // { productId: rawIncrementCount }

const rateBuffer = {}; // { productId: rawIncrementCount }

const wishlistBuffer = {}; // { productId: rawIncrementCount }

const avgRatingBuffer = {}; // { productId: { n1: 1, n2: 1, n3: 1, n4: 1, n5: 1 } }

// agenda jobs

getAgenda().then(async ({ agenda }) => {
  await agenda.stop();
  agenda.define("flush-interactions", async (job, done) => {
    let { view, share, wishlist, rate, cart, all } = job.attrs.data;

    if ((!view && !share && !wishlist && !rate && !cart) || all === true) {
      view = true;
      share = true;
      wishlist = true;
      rate = true;
      cart = true;
    }

    if (view === true) {
      await flushBuffer(viewBuffer, "metrics.allViews", "view");
    }

    if (share === true) {
      await flushBuffer(shareBuffer, "metrics.shareCount", "share");
    }

    if (wishlist === true) {
      await flushBuffer(wishlistBuffer, "metrics.wishlistCount", "wishlist");
    }

    // if (rate === true) {
    //   await flushBuffer(rateBuffer, "metrics.reviewCount", "rate");
    // }

    if (cart === true) {
      await flushBuffer(cartBuffer, "metrics.cartCount", "cart");
    }

    if (view || share || rate || all) {
      await flushInteractions();
    }

    return done();
  });

  agenda.define("flush-and-calculate-product-rating", async (job, done) => {
    const productIdsToFlush = Object.keys(avgRatingBuffer);

    // Safely check if there is work to do. Always call done() to prevent hanging.
    if (productIdsToFlush.length === 0) {
      return done();
    }

    try {
      // FIXED: Snapshot and pull out items to isolate from incoming concurrent requests
      const snapshot = {};
      for (const productId of productIdsToFlush) {
        snapshot[productId] = avgRatingBuffer[productId];
        delete avgRatingBuffer[productId]; // Clears it safely from main buffer
      }

      const promises = Object.entries(snapshot).map(
        async ([productId, ratings]) => {
          const totalStar1 = ratings["n1"] || 0;
          const totalStar2 = ratings["n2"] || 0;
          const totalStar3 = ratings["n3"] || 0;
          const totalStar4 = ratings["n4"] || 0;
          const totalStar5 = ratings["n5"] || 0;

          // FIXED: Sum up how many new reviews were submitted in this specific batch
          const batchReviewCount =
            totalStar1 + totalStar2 + totalStar3 + totalStar4 + totalStar5;

          if (batchReviewCount === 0) return null;

          return await db.collection("products").findOneAndUpdate(
            { id: productId },
            [
              {
                $set: {
                  // FIXED: $ifNull blocks prevent upsert math breaking on brand new products
                  "metrics.stars.n5": {
                    $add: [{ $ifNull: ["$metrics.stars.n5", 0] }, totalStar5],
                  },
                  "metrics.stars.n4": {
                    $add: [{ $ifNull: ["$metrics.stars.n4", 0] }, totalStar4],
                  },
                  "metrics.stars.n3": {
                    $add: [{ $ifNull: ["$metrics.stars.n3", 0] }, totalStar3],
                  },
                  "metrics.stars.n2": {
                    $add: [{ $ifNull: ["$metrics.stars.n2", 0] }, totalStar2],
                  },
                  "metrics.stars.n1": {
                    $add: [{ $ifNull: ["$metrics.stars.n1", 0] }, totalStar1],
                  },

                  // FIXED: Simply adding the plain batch total count to the database total
                  "metrics.reviewCount": {
                    $add: [
                      { $ifNull: ["$metrics.reviewCount", 0] },
                      batchReviewCount,
                    ],
                  },
                },
              },
              {
                $set: {
                  // Step 3: Recalculate the mathematical weighted average
                  "metrics.rating": {
                    $divide: [
                      {
                        $add: [
                          { $multiply: [5, "$metrics.stars.n5"] },
                          { $multiply: [4, "$metrics.stars.n4"] },
                          { $multiply: [3, "$metrics.stars.n3"] },
                          { $multiply: [2, "$metrics.stars.n2"] },
                          { $multiply: [1, "$metrics.stars.n1"] },
                        ],
                      },
                      "$metrics.reviewCount",
                    ],
                  },
                },
              },
            ],
            { upsert: true, returnDocument: "after" }, // Native driver uses returnDocument instead of returnDocument: "after"
          );
        },
      );

      await Promise.all(promises);
      done();
    } catch (error) {
      console.error("Failed to flush product ratings batch:", error);
      throw error; // Let Agenda handle the error and retry if needed
    }
  });
  agenda.define("flush-buffer", async (job, done) => {
    const { buffer, collection, property, bufferName } = job.attrs.data;

    if (
      !buffer ||
      !collection ||
      !property ||
      !bufferName ||
      typeof buffer !== "object"
    ) {
      throw new Error(
        "Missing required parameters for flush-buffer job: buffer, collection, property, bufferName or buffer is not an object",
      );
    }

    if (Object.keys(buffer).length === 0) {
      return done();
    }

    await flushBuffer(buffer, property, bufferName, collection);
    return done();
  });

  await agenda.start();

  agenda.every("5 minutes", "flush-interactions", {
    all: true,
  });

  agenda.every("30 minutes", "flush-and-calculate-product-rating", {});
});

export async function searchInteraction(productId, userId) {
  let interaction = null;
  if (!productId || !userId) {
    return interaction;
  }
  let buffers = productInteractionBuffer.filter((interaction) => {
    return (
      interaction.updateOne.filter.productId === productId &&
      interaction.updateOne.filter.userId === userId
    );
  });
  let mergeBuffer = buffers.reduce((acc, interaction) => {
    const bufferedData = interaction.updateOne?.update?.$set || {};
    const setOnInsertData = interaction.updateOne?.update?.$setOnInsert || {};
    const accBufferedData = acc.updateOne?.update?.$set || {};
    const accSetOnInsertData = acc.updateOne?.update?.$setOnInsert || {};

    return {
      ...accBufferedData,
      ...accSetOnInsertData,
      ...setOnInsertData,
      ...bufferedData,
    };
  }, {});
  if (Object.keys(mergeBuffer).length > 0) {
    interaction = {
      productId,
      userId,
      // Fallbacks Properties:
      hasViewed: false,
      hasShared: false,
      hasWishlisted: false,
      rating: null,
      ...mergeBuffer,
    };
    return interaction;
  }
  interaction = await InteractionModel.findOne({ productId, userId });
  return interaction ?? null;
}

function interactionUtil(interactionBuffer) {
  // user interaction
  let rawBuffer = {}; // { productId: rawIncrementCount }
  if (Object.keys(interactionBuffer).length > 0) {
    const bulkOps = Object.entries(interactionBuffer).map(
      ([productId, users]) => {
        // { productId: { userId: 1 } }
        // example id: productId: ALsdksd83rj..... random id
        // users id: { "sddfe...userid": 1, "askjds_userid": 1 }
        const totalViews = Object.keys(users).length;

        rawBuffer[productId] = totalViews;

        const filter = {
          updateOne: {
            filter: { id: productId },
            update: { $inc: { "metrics.debouncedViews": totalViews } },
            upsert: true,
          },
        };
        return filter;
      },
    );

    return {
      bulkOps: bulkOps,
      clearBuffer: () => {
        for (const productId in interactionBuffer) {
          delete interactionBuffer[productId];
        }
      },
      toRawBuffer: () => {
        return rawBuffer;
      },
    };
  } else {
    return null; // No interactions to flush
  }
}

function flushInteractions() {
  return new Promise((resolve, reject) => {
    // flush productInteractionBuffer to interactions collection
    if (productInteractionBuffer.length > 0) {
      InteractionModel.bulkWrite(productInteractionBuffer)
        .then(() => {
          resolve();
          productInteractionBuffer.length = 0; // Clear the buffer after flushing
        })
        .catch((err) => {
          reject(err);
          console.error("Error flushing product view interactions:", err);
          throw err;
        });
    } else {
      resolve();
    }
  });
}

// viewBuffer incremental middleware
function addAllViews(req, res, next) {
  const { productId } = req.body;
  viewBuffer[productId] = (viewBuffer[productId] || 0) + 1;
  next();
}

// Flush Function
function flushBuffer(buffer, property, bufferName, collection = "products") {
  return new Promise((resolve, reject) => {
    if (Object.keys(buffer).length === 0) {
      resolve(); // Resolve the promise even if there's nothing to flush
      return;
    } else if (Object.keys(buffer).length > 0) {
      // snapshot the buffer to avoid race conditions
      const snapshot = {};
      for (const productId of Object.keys(buffer)) {
        snapshot[productId] = buffer[productId];
        delete buffer[productId]; // Clears it safely from main buffer
      }

      const bulkOps = Object.entries(snapshot).map(([productId, count]) => {
        console.log(
          `Flushing ${bufferName} buffer for productId: ${productId}, count: ${count}`,
        );
        const filter = {
          updateOne: {
            filter: { id: productId },
            update: { $inc: { [property]: count } },
            upsert: true,
          },
        };

        return filter;
      });

      db.collection(collection)
        .bulkWrite(bulkOps)
        .then(() => {
          resolve(); // Resolve the promise after flushing
        })
        .catch((err) => {
          // Restore the snapshot back to the buffer in case of an error
          for (const productId in snapshot) {
            buffer[productId] = snapshot[productId];
          }
          reject(err); // Reject the promise if there's an error
          console.error(`Error flushing ${bufferName} buffer:`, err);
        });

      if (bufferName === "view") {
        let userInteractions = interactionUtil(userInteractionViewBuffer);
        let guestInteractions = interactionUtil(guestInteractionViewBuffer);

        if (userInteractions && userInteractions.toRawBuffer) {
          const userRawBuffer = userInteractions.toRawBuffer();
          flushBuffer(userRawBuffer, "metrics.debouncedViews", "userView");
        }

        if (guestInteractions && guestInteractions.toRawBuffer) {
          const guestRawBuffer = guestInteractions.toRawBuffer();
          flushBuffer(guestRawBuffer, "metrics.debouncedViews", "guestView");
        }
      }
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////     VIEWS    //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post(
  "/product/visit",
  passUserAuth,
  addAllViews,
  requireSession,
  (req, res) => {
    const isAuthenticated = req.user && !req.user.isAnonymous;

    const { id: userId } = req.user;
    const { productId } = req.body;

    if (!productId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const previousInteraction = searchInteraction(productId, userId);
    if (previousInteraction && previousInteraction.hasViewed == true) {
      console.log(
        `User ${userId} has already viewed product ${productId}. No action taken.`,
      );
      return res.status(200).json({
        message: "View already recorded. No action taken.",
      });
    }

    if (isAuthenticated) {
      userInteractionViewBuffer[productId] =
        userInteractionViewBuffer[productId] || {};
      userInteractionViewBuffer[productId][userId] =
        (userInteractionViewBuffer[productId][userId] || 0) + 1;
    } else {
      guestInteractionViewBuffer[productId] =
        guestInteractionViewBuffer[productId] || {};
      guestInteractionViewBuffer[productId][userId] =
        (guestInteractionViewBuffer[productId][userId] || 0) + 1;
    }

    productInteractionBuffer.push({
      updateOne: {
        filter: { productId, userId },
        update: {
          $setOnInsert: {
            id: `${productId}_${userId}`,
            productId,
            userId,
            isGuest: !isAuthenticated,
            createdAt: new Date(),
          },
          $set: {
            updatedAt: new Date(),
            hasViewed: true,
          },
        },
        upsert: true,
      },
    });

    evt.fire(Evts.INTERACTION_RECORDED, {
      productId,
      userId,
      isGuest: !isAuthenticated,
      interactionType: "view",
      property: "hasViewed",
      timestamp: new Date(),
    });
    evt.fire(
      Evts.PRODUCT_VIEWED,
      new ProductEvent({
        type: Evts.PRODUCT_VIEWED,
        product: null,
        response: { productId, userId },
        isReq: true,
      }),
    );
    res.status(200).json({ message: "View recorded successfully" });
  },
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// SHARES ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/product/share", passUserAuth, requireSession, (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  if (!req.user || !req.user.id || !req.user.email || !req.user.name) {
    return res.status(400).json({
      error: "User information is required. At least guest user is required",
    });
  }

  shareBuffer[productId] = (shareBuffer[productId] || 0) + 1;

  const { id: userId } = req.user;
  const isAuthenticated = req.user && !req.user.isAnonymous;

  const previousInteraction = searchInteraction(productId, userId);
  if (previousInteraction && previousInteraction.hasShared == true) {
    console.log(
      `User ${userId} has already shared product ${productId}. No action taken.`,
    );
    return res.status(200).json({
      message: "Share already recorded. No action taken.",
    });
  }

  productInteractionBuffer.push({
    updateOne: {
      filter: { productId, userId },
      update: {
        $setOnInsert: {
          id: `${productId}_${userId}`,
          productId,
          userId,
          createdAt: new Date(),
          isGuest: !isAuthenticated,
        },
        $set: {
          updatedAt: new Date(),
          hasShared: true,
          hasViewed: true,
        },
      },
      upsert: true,
    },
  });

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    isGuest: !isAuthenticated,
    interactionType: "share",
    property: "hasShared",
    timestamp: new Date(),
  });

  evt.fire(
    Evts.PRODUCT_SHARED,
    new ProductEvent({
      type: Evts.PRODUCT_SHARED,
      product: null,
      response: { productId, userId },
      isReq: true,
    }),
  );

  res.status(200).json({ message: "Share recorded successfully" });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// RATES ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Rating data stored into db directly, no buffer needed since it's a single value per user per product

router.post("/product/rate", requireAuth, passUserAuth, async (req, res) => {
  let { productId, rating } = req.body; // rating: 1-5
  const { id: userId } = req.user;
  const isAuthenticated = req.user && !req.user.isAnonymous;

  rating = Math.floor(Math.abs(parseInt(rating)));

  if (!isAuthenticated) {
    return res.status(400).json({
      error:
        "User information is required. guest users cannot rate products. Please log in to rate.",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "Invalid rating. Please provide a rating between 1 and 5.",
    });
  }

  if (!productId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let previousInteraction = await searchInteraction(productId, userId);

  if (!avgRatingBuffer[productId]) {
    avgRatingBuffer[productId] = {
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
    };
  }

  if (previousInteraction && typeof previousInteraction.rating === "number") {
    const previousRating = previousInteraction.rating;
    avgRatingBuffer[productId]["n" + previousRating] -= 1;
  }
  avgRatingBuffer[productId]["n" + rating] =
    (avgRatingBuffer[productId]["n" + rating] || 0) + 1;

  productInteractionBuffer.push({
    updateOne: {
      filter: { productId, userId },
      update: {
        $setOnInsert: {
          id: `${productId}_${userId}`,
          productId,
          userId,
          isGuest: !isAuthenticated,
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
          rating,
          hasViewed: true,
        },
      },
      upsert: true,
    },
  });

  rateBuffer[productId] = (rateBuffer[productId] || 0) + 1;
  if (previousInteraction && typeof previousInteraction.rating === "number") {
    rateBuffer[productId] -= 1;
  }

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    isGuest: !isAuthenticated,
    interactionType: "rate",
    property: "rating",
    timestamp: new Date(),
  });

  evt.fire(
    Evts.PRODUCT_RATED,
    new ProductEvent({
      type: Evts.PRODUCT_RATED,
      product: null,
      response: { productId, userId },
      isReq: true,
    }),
  );

  res.status(200).json({ message: "Rating recorded successfully" });
});

router.delete("/product/rate", requireAuth, passUserAuth, async (req, res) => {
  let { productId } = req.body;
  const { id: userId } = req.user;
  const isAuthenticated = req.user && !req.user.isAnonymous;

  if (!isAuthenticated) {
    return res.status(400).json({
      error:
        "User information is required. guest users cannot rate products. Please log in to rate.",
    });
  }

  if (!productId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let previousInteraction = await searchInteraction(productId, userId);

  if (!avgRatingBuffer[productId]) {
    avgRatingBuffer[productId] = {
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
    };
  }

  if (previousInteraction && typeof previousInteraction.rating === "number") {
    const previousRating = previousInteraction.rating;
    avgRatingBuffer[productId]["n" + previousRating] -= 1;
  }

  rateBuffer[productId] = (rateBuffer[productId] || 0) - 1;

  productInteractionBuffer.push({
    updateOne: {
      filter: { productId, userId },
      update: {
        $setOnInsert: {
          id: `${productId}_${userId}`,
          productId,
          userId,
          isGuest: !isAuthenticated,
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
          rating: null,
          hasViewed: true,
        },
      },
      upsert: true,
    },
  });

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    isGuest: !isAuthenticated,
    interactionType: "rate",
    property: "rating",
    timestamp: new Date(),
  });

  evt.fire(
    Evts.PRODUCT_UNRATED,
    new ProductEvent({
      type: Evts.PRODUCT_UNRATED,
      product: null,
      response: { productId, userId },
      isReq: true,
    }),
  );

  res.status(200).json({ message: "Rating deleted successfully" });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// Wishlist /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Wishlist count as Liked Products

function setWishlistProductInteraction(
  productId,
  userId,
  folder,
  toAdd = true,
) {
  if (!productId || !userId) {
    console.error("Missing required fields for wishlist event");
    return;
  }

  const previousInteraction = searchInteraction(productId, userId);
  if (
    previousInteraction &&
    previousInteraction.hasWishlisted == true &&
    toAdd
  ) {
    console.log(
      `User ${userId} has already wishlisted product ${productId}. No action taken.`,
    );
    return;
  }

  if (toAdd) {
    wishlistBuffer[productId] = (wishlistBuffer[productId] || 0) + 1;
  } else {
    wishlistBuffer[productId] = (wishlistBuffer[productId] || 0) - 1;
  }

  productInteractionBuffer.push({
    updateOne: {
      filter: { productId, userId },
      update: {
        $setOnInsert: {
          id: `${productId}_${userId}`,
          productId,
          userId,
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
          hasWishlisted: !!toAdd,
          folder: folder || "/",
          hasViewed: true,
        },
      },
      upsert: true,
    },
  });
}

evt.on(Evts.PRODUCT_WISHLISTED, async (event) => {
  const { productId, userId, folder } = event;
  if (!event || !event.productId || !event.userId) {
    return;
  }

  setWishlistProductInteraction(productId, userId, folder, true);

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    interactionType: "wishlist",
    property: "metrics.wishlistCount",
    timestamp: new Date(),
  });
});

evt.on(Evts.WISHLIST_REMOVED, async (event) => {
  const { productId, userId, folder } = event;
  if (!event || !event.productId || !event.userId) {
    return;
  }

  setWishlistProductInteraction(productId, userId, folder, false);

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    interactionType: "wishlist",
    property: "metrics.wishlistCount",
    timestamp: new Date(),
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// CART ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

evt.on(Evts.CART_ITEM_ADDED, async ({ cart, productId, quantity }) => {
  if (!cart || !productId || !quantity || quantity <= 0) {
    return;
  }

  cartBuffer[productId] = (cartBuffer[productId] || 0) + quantity;

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId: cart.userId,
    interactionType: "cart",
    property: "metrics.cartCount",
    timestamp: new Date(),
  });
});

evt.on(Evts.FLUSH_REQUESTED, () => {
  useAgenda().now("flush-interactions", { all: true });
});

evt.on(Evts.INTERACTION_RECORDED, (interaction) => {
  // flush if buffer size exceeds threshold
  if (productInteractionBuffer.length >= FLUSH_BUFFER_SIZE) {
    evt.fire(Evts.FLUSH_REQUESTED, true);
  }

  if (
    interaction &&
    (interaction.interactionType === "wishlist" ||
      interaction.interactionType === "cart") &&
    (Object.keys(wishlistBuffer).length >= FLUSH_BUFFER_SIZE ||
      Object.keys(cartBuffer).length >= FLUSH_BUFFER_SIZE)
  ) {
    evt.fire(Evts.FLUSH_REQUESTED, true);
  }
});

// get product interaction (views, shares, rates) for a specific product
router.get("/p/:productId", requireAuth, passUserAuth, async (req, res) => {
  const user = req.user;
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  try {
    const interaction = await InteractionModel.findOne({
      productId,
      userId: user.id,
    });
    if (!interaction) {
      return res.status(404).json({ error: "Interaction not found" });
    }
    // get buffer
    const bufferedInteraction = productInteractionBuffer.find(
      (interaction) =>
        interaction.updateOne.filter.productId === productId &&
        interaction.updateOne.filter.userId === user.id,
    );
    // merge bufferedInteraction with interaction
    if (bufferedInteraction) {
      const bufferedData = bufferedInteraction.updateOne.update.$set;
      interaction.hasViewed = bufferedData.hasViewed || interaction.hasViewed;
      interaction.hasShared = bufferedData.hasShared || interaction.hasShared;
      interaction.hasWishlisted =
        bufferedData.hasWishlisted || interaction.hasWishlisted;
      interaction.rating = bufferedData.rating || interaction.rating;
    }

    evt.fire(Evts.FLUSH_REQUESTED, true); // Try to Flush all buffers before fetching interactions
    return res.status(200).json(interaction);
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
