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

const router = express.Router();

///////////////////////////////////////////////////////////////////////
///////////   PRODUCT INTERACTIONS (VIEWS, SHARES, RATES)   /////////
///////////////////////////////////////////////////////////////////////

//////////// VIEWS ////////////
// Incremental: Buffer all views instantly in memory ( "AllViews")
const viewBuffer = {}; // { productId: rawIncrementCount }

// user interaction ( "uniqueViews" )
const userInteractionViewBuffer = {}; // example: { productId: { userId1: 1, userId2: 1 } }

// guest interaction ( "uniqueViews" )
const guestInteractionViewBuffer = {}; // example: { productId: { userId1: 1, userId2: 1 } }

const FLUSH_INTERVAL = 1000 * 60; // 1 minute
const FLUSH_BUFFER_SIZE = 30; // Flush when buffer reaches this size

const productInteractionBuffer = [];

async function flushInteractionViews(interactionBuffer) {
  // user interaction
  if (Object.keys(interactionBuffer).length > 0) {
    const bulkOps = Object.entries(interactionBuffer).map(
      ([productId, users]) => {
        // { productId: { userId: 1 } }
        // example: productId: ALsdksd83rj..... random id
        // users: { "sddfe...userid": 1, "askjds_userid": 1 }
        const totalViews = Object.keys(users).length;

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
    db.collection("products").bulkWrite(bulkOps);
    // Clear the buffer
    for (const productId in interactionBuffer) {
      delete interactionBuffer[productId];
    }
  }
}

function flushViews() {
  // all views
  if (Object.keys(viewBuffer).length > 0) {
    const bulkOps = Object.entries(viewBuffer).map(([productId, count]) => {
      const filter = {
        updateOne: {
          filter: { productId },
          update: { $inc: { "metrics.allViews": count } },
          upsert: true,
        },
      };
      return filter;
    });
    db.collection("products").bulkWrite(bulkOps);
    // Clear the buffer after flushing
    for (const productId in viewBuffer) {
      delete viewBuffer[productId];
    }
  }

  flushInteractionViews(userInteractionViewBuffer);
  flushInteractionViews(guestInteractionViewBuffer);

  // flush productInteractionBuffer to interactions collection
  if (productInteractionBuffer.length > 0) {
    InteractionModel.bulkWrite(productInteractionBuffer)
      .then(() => {
        productInteractionBuffer.length = 0; // Clear the buffer after flushing
      })
      .catch((err) => {
        console.error("Error flushing product view interactions:", err);
      });
  }
}

// viewBuffer incremental middleware
function addAllViews(req, res, next) {
  const { productId } = req.body;
  viewBuffer[productId] = (viewBuffer[productId] || 0) + 1;
  next();
}

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

const flushVisitIntervalId = setInterval(flushViews, FLUSH_INTERVAL);

/////////// SHARES ////////////

const shareBuffer = {}; // { productId: rawIncrementCount }

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

const flushShares = () => {
  if (Object.keys(shareBuffer).length === 0) {
    return;
  } else if (Object.keys(shareBuffer).length > 0) {
    const bulkOps = Object.entries(shareBuffer).map(([productId, count]) => {
      const filter = {
        updateOne: {
          filter: { productId },
          update: { $inc: { "metrics.allShares": count } },
          upsert: true,
        },
      };
      return filter;
    });
    db.collection("products").bulkWrite(bulkOps);
    // Clear the buffer after flushing
    for (const productId in shareBuffer) {
      delete shareBuffer[productId];
    }
  }
};

const shareIntervalId = setInterval(flushShares, FLUSH_INTERVAL);

///////////// RATES ////////////
// Rating data stored into db directly, no buffer needed since it's a single value per user per product

const rateBuffer = {}; // { productId: rawIncrementCount }

router.post("product/rate", requireAuth, passUserAuth, async (req, res) => {
  const { productId, rating } = req.body; // rating: 1-5
  const {
    id: userId,
    email: userEmail,
    name: userName,
    avatar: userAvatar,
  } = req.user;
  const isAuthenticated = req.user && !req.user.isAnonymous;

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

const flushRates = () => {
  if (Object.keys(rateBuffer).length === 0) {
    return;
  } else if (Object.keys(rateBuffer).length > 0) {
    const bulkOps = Object.entries(rateBuffer).map(([productId, count]) => {
      const filter = {
        updateOne: {
          filter: { productId },
          update: { $inc: { "metrics.reviewCount": count } },
          upsert: true,
        },
      };
      return filter;
    });
    db.collection("products").bulkWrite(bulkOps);
    // Clear the buffer after flushing
    for (const productId in rateBuffer) {
      delete rateBuffer[productId];
    }
  }
};

const rateIntervalId = setInterval(flushRates, FLUSH_INTERVAL);

// get product interaction (views, shares, rates) for a specific product
router.get(
  "interactions/:productId",
  requireAuth,
  passUserAuth,
  async (req, res) => {
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
  },
);

////////////////////////////////////
///////////// Wishlist /////////////
////////////////////////////////////

// Wishlist count as Liked Products

const wishlistBuffer = {}; // { productId: rawIncrementCount }

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

function flushWishlists() {
  if (Object.keys(wishlistBuffer).length === 0) {
    return;
  } else if (Object.keys(wishlistBuffer).length > 0) {
    const bulkOps = Object.entries(wishlistBuffer).map(([productId, count]) => {
      const filter = {
        updateOne: {
          filter: { productId },
          update: { $inc: { "metrics.wishlistCount": count } },
          upsert: true,
        },
      };
      return filter;
    });
    db.collection("products").bulkWrite(bulkOps);
    // Clear the buffer after flushing
    for (const productId in wishlistBuffer) {
      delete wishlistBuffer[productId];
    }
  }
}

const wishlistIntervalId = setInterval(flushWishlists, FLUSH_INTERVAL);

////////////////////////////////////
//////////// CART //////////////////
////////////////////////////////////

const cartBuffer = {}; // { productId: rawIncrementCount }

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

function flushCarts() {
  if (Object.keys(cartBuffer).length === 0) {
    return;
  } else if (Object.keys(cartBuffer).length > 0) {
    const bulkOps = Object.entries(cartBuffer).map(([productId, count]) => {
      const filter = {
        updateOne: {
          filter: { productId },
          update: { $inc: { "metrics.cartCount": count } },
          upsert: true,
        },
      };
      return filter;
    });
    db.collection("products").bulkWrite(bulkOps);
    // Clear the buffer after flushing
    for (const productId in cartBuffer) {
      delete cartBuffer[productId];
    }
  }
}

const cartIntervalId = setInterval(flushCarts, FLUSH_INTERVAL);

evt.on(Evts.FLUSH_REQUESTED, () => {
  flushViews();
  flushShares();
  flushWishlists();
  flushRates();
  flushCarts();
});

evt.on(Evts.INTERACTION_RECORDED, (interaction) => {
  // flush if buffer size exceeds threshold
  if (productInteractionBuffer.length >= FLUSH_BUFFER_SIZE) {
    flushViews();
    flushShares();
    flushRates();
    flushWishlists();
    flushCarts();
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

export default router;
