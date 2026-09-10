import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
  requireSession,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import { InteractionModel } from "../models/schema/interactions.js";
import { evt, Evts } from "../utils/events.manage.js";
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

getAgenda().then(async (agenda) => {
  console.log("Agenda instance obtained in interactions.js");
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

    console.log("Flushing and calculating product ratings...");

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
            { upsert: true, returnDocument: "after" }, // Native driver uses returnDocument instead of new: true
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

  await agenda.start();

  agenda.every("5 minutes", "flush-interactions", {
    all: true,
  });

  agenda.every("30 minutes", "flush-and-calculate-product-rating", {});
});

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
            filter: { productId },
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
    console.log(`Flushing ${bufferName} buffer to ${collection} collection...`);
    if (Object.keys(buffer).length === 0) {
      console.log(`No ${bufferName} interactions to flush.`);
      resolve(); // Resolve the promise even if there's nothing to flush
      return;
    } else if (Object.keys(buffer).length > 0) {
      // snapshot the buffer to avoid race conditions
      const snapshot = {};
      for (const productId of Object.keys(buffer)) {
        snapshot[productId] = buffer[productId];
        delete buffer[productId]; // Clears it safely from main buffer
      }

      console.log(
        `Flushing ${Object.keys(snapshot).length} ${bufferName} interactions...`,
      );
      const bulkOps = Object.entries(snapshot).map(([productId, count]) => {
        const filter = {
          updateOne: {
            filter: { productId },
            update: { $inc: { [`${property}`]: count } },
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

      // TODO: calucalte rating and save to product collection with Agendajs
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////     VIEWS    //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post(
  "product/visit",
  passUserAuth,
  addAllViews,
  requireSession,
  (req, res) => {
    const isAuthenticated = req.user && !req.user.isAnonymous;

    const {
      id: userId,
      avatar: userAvatar,
      email: userEmail,
      name: userName,
    } = req.user;
    const { productId } = req.body;

    if (!productId || !userId || !userEmail || !userName) {
      return res.status(400).json({ error: "Missing required fields" });
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
            userName,
            userAvatar: userAvatar ? userAvatar : "",
            userEmail,
            isGuest: !isAuthenticated,
            createdAt: new Date(),
            hasViewed: true,
          },
          $set: {
            updatedAt: new Date(),
            hasViewed: true,
            isGuest: !isAuthenticated,
            userName,
            userAvatar: userAvatar ? userAvatar : "",
          },
        },
        upsert: true,
      },
    });

    evt.fire(Evts.INTERACTION_RECORDED, {
      productId,
      userId,
      userName,
      userAvatar: userAvatar ? userAvatar : "",
      userEmail,
      isGuest: !isAuthenticated,
      interactionType: "view",
      property: "hasViewed",
      timestamp: new Date(),
    });
    res.status(200).json({ message: "View recorded successfully" });
  },
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// SHARES ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("product/share", passUserAuth, requireSession, (req, res) => {
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

  const { id: userId, email: userEmail, name: userName } = req.user;
  const isAuthenticated = req.user && !req.user.isAnonymous;

  productInteractionBuffer.push({
    updateOne: {
      filter: { productId, userId },
      update: {
        $setOnInsert: {
          id: `${productId}_${userId}`,
          productId,
          userId,
          userName,
          userEmail,
          createdAt: new Date(),
          isGuest: !isAuthenticated,
          hasShared: true,
          userAvatar: req.user.avatar ? req.user.avatar : "",
        },
        $set: {
          updatedAt: new Date(),
          isGuest: !isAuthenticated,
          hasShared: true,
          userName,
          userAvatar: req.user.avatar ? req.user.avatar : "",
        },
      },
      upsert: true,
    },
  });

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    userName,
    userAvatar: userAvatar ? userAvatar : "",
    userEmail,
    isGuest: !isAuthenticated,
    interactionType: "share",
    property: "hasShared",
    timestamp: new Date(),
  });

  res.status(200).json({ message: "Share recorded successfully" });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// RATES ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Rating data stored into db directly, no buffer needed since it's a single value per user per product

router.post("product/rate", requireAuth, passUserAuth, async (req, res) => {
  let { productId, rating } = req.body; // rating: 1-5
  const {
    id: userId,
    email: userEmail,
    name: userName,
    avatar: userAvatar,
  } = req.user;
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

  if (!productId || !userId || !userEmail || !userName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!avgRatingBuffer[productId]) {
    avgRatingBuffer[productId] = {
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
    };
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
          userName,
          userAvatar: userAvatar ? userAvatar : "",
          userEmail,
          isGuest: !isAuthenticated,
          rating,
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
          isGuest: !isAuthenticated,
          rating,
          hasViewed: true,
          userName,
          userAvatar: userAvatar ? userAvatar : "",
        },
      },
      upsert: true,
    },
  });

  rateBuffer[productId] = (rateBuffer[productId] || 0) + 1;

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId,
    userId,
    userName,
    userAvatar: userAvatar ? userAvatar : "",
    userEmail,
    isGuest: !isAuthenticated,
    interactionType: "rate",
    property: "rating",
    timestamp: new Date(),
  });

  res.status(200).json({ message: "Rating recorded successfully" });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// Wishlist /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Wishlist count as Liked Products

evt.on(Evts.WISHLIST_ADDED, async (wishlist) => {
  if (!wishlist || !wishlist.products || !Array.isArray(wishlist.products)) {
    return;
  }

  function productWishlisted(
    productId,
    userId,
    userEmail,
    userName,
    userAvatar,
    isGuest,
    folder,
  ) {
    if (!productId || !userId || !userEmail || !userName || !isGuest) {
      console.error("Missing required fields for wishlist event");
      return;
    }

    wishlistBuffer[productId] = (wishlistBuffer[productId] || 0) + 1;

    productInteractionBuffer.push({
      updateOne: {
        filter: { productId, userId },
        update: {
          $setOnInsert: {
            id: `${productId}_${userId}`,
            productId,
            userId,
            userName,
            userAvatar: userAvatar ? userAvatar : "",
            userEmail,
            isGuest: isGuest,
            createdAt: new Date(),
            folder: folder || "/",
            hasWishlisted: true,
          },
          $set: {
            updatedAt: new Date(),
            isGuest: isGuest,
            hasWishlisted: true,
            userName,
            userAvatar: userAvatar ? userAvatar : "",
            folder: folder || "/",
          },
        },
        upsert: true,
      },
    });
  }

  wishlist.products.forEach((product) => {
    productWishlisted(
      product.productId,
      wishlist.userId,
      wishlist.userEmail,
      wishlist.userName,
      wishlist.userAvatar,
      wishlist.isGuest,
      wishlist.folder,
    );
  });

  evt.fire(Evts.INTERACTION_RECORDED, {
    productId: wishlist.products.map((p) => p.productId),
    userId: wishlist.userId,
    userName: wishlist.userName,
    userAvatar: wishlist.userAvatar ? wishlist.userAvatar : "",
    userEmail: wishlist.userEmail,
    isGuest: wishlist.isGuest,
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
    userName: cart.userName,
    userAvatar: cart.userAvatar ? cart.userAvatar : "",
    userEmail: cart.userEmail,
    isGuest: cart.isGuest,
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
    (interaction.type === "wishlist" || interaction.type === "cart") &&
    (wishlistBuffer.length >= FLUSH_BUFFER_SIZE ||
      cartBuffer.length >= FLUSH_BUFFER_SIZE)
  ) {
    flushWishlists();
    flushCarts();
  }
});

// get product interaction (views, shares, rates) for a specific product
router.get("/p/:productId", requireAuth, passUserAuth, async (req, res) => {
  const user = req.user;
  const { productId } = req.params;

  evt.fire(Evts.FLUSH_REQUESTED, true); // Try to Flush all buffers before fetching interactions

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
    res.status(200).json({ interaction });
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
