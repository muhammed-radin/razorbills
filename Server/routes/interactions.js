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
    await db.collection("products").bulkWrite(bulkOps);
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

    res.status(200).json({ message: "View recorded successfully" });
  },
);

const flushIntervalId = setInterval(flushViews, FLUSH_INTERVAL);

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

router.post("product/rate", requireAuth, passUserAuth, (req, res) => {
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

  db.collection("interactions").bulkWrite({
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

  res.status(200).json({ message: "Rating recorded successfully" });
});

export default router;
