import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
  requireSession,
} from "../utils/middlewares/reqiuredAuth.js";
import { CommentModel } from "../models/schema/comments.js";
import { evt, Evts, ErrorEvent, CommentEvent } from "../utils/events.manage.js";
import { globalMemory } from "../utils/cache-utils/global-cache.js";

const router = express.Router();

let isCommentUpdated = false;

// POST /comments
router.post("/", requireAuth, passUserAuth, async (req, res) => {
  const { productId, content: commentText } = req.body;
  const { id: userId, email, name, image: avatar } = req.user;

  if (!productId || !commentText) {
    evt.fire(
      Evts.PRODUCT_COMMENT_ERROR,
      new ErrorEvent({
        type: Evts.PRODUCT_COMMENT_ERROR,
        error: "Product ID and comment text are required",
        errorCode: 400,
        data: { productId, userId },
      }),
    );
    return res
      .status(400)
      .json({ error: "Product ID and comment text are required" });
  }

  try {
    // upsert comment
    const comment = db
      .collection("comments")
      .findOneAndUpdate(
        { productId, userId },
        {
          $set: {
            content: commentText,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            productId,
            userId,
            userName: name,
            userEmail: email,
            userAvatar: avatar ? avatar : "",
            createdAt: new Date(),
          },
        },
        { upsert: true, returnDocument: "after" },
      )
      .then((result) => {
        const comment = result;

        isCommentUpdated = true;
        evt.fire(
          Evts.PRODUCT_COMMENTED,
          new CommentEvent({
            comment,
            type: Evts.PRODUCT_COMMENTED,
          }),
        );
        res.status(201).json(comment);
      });
  } catch (error) {
    evt.fire(
      Evts.PRODUCT_COMMENT_ERROR,
      new ErrorEvent({
        type: Evts.PRODUCT_COMMENT_ERROR,
        error,
        errorCode: 500,
        data: { productId, userId },
      }),
    );
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// GET /comments/:productId
router.get("/:productId", requireSession, async (req, res) => {
  if (
    globalMemory?.getLocalMemory(req.url) &&
    req.query?.realtime !== "true" &&
    isCommentUpdated === false
  ) {
    return res.json(globalMemory.getLocalMemory(req.url));
  }
  const productId = req.params.productId;
  let query = {};
  let results = {};

  let page = parseInt(req.query?.page) || parseInt(req.body?.page) || 1;
  let limit = parseInt(req.query?.limit) || parseInt(req.body?.limit) || 10;
  let sortBy = req.query?.sortBy || req.body?.sortBy || "createdAt";
  let sortOrder = req.query?.sortOrder === "asc" ? 1 : -1;
  let startIndex =
    parseInt(req.query?.startIndex) || parseInt(req.body?.startIndex) || 0;

  if (page > 1) {
    startIndex = (page - 1) * limit;
  }

  // build query based on request parameters
  query = {
    productId: productId,
  };

  let totalCount = await CommentModel.countDocuments(query);

  try {
    const comments = await CommentModel.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortBy]: sortOrder, createdAt: -1 });

    if (!comments || comments.length === 0) {
      res.status(404).json({ error: "No comments found for this product" });
      return;
    }

    results = {
      comments: comments,
      page: page,
      limit: limit,
      count: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      next: page < Math.ceil(totalCount / limit) ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
      startIndex: startIndex,
      endIndex: startIndex + comments.length - 1,
      sort: {
        by: sortBy,
        order: sortOrder,
      },
      fromCache: false,
    };

    globalMemory?.setLocalMemory(
      req.url,
      { ...results, fromCache: true },
      60 * 60 * 6,
    ); // Cache for 6 hours
    res.json(results);
  } catch (error) {
    evt.fire(
      Evts.PRODUCT_COMMENT_ERROR,
      new ErrorEvent({
        type: Evts.PRODUCT_COMMENT_ERROR,
        error,
        errorCode: 500,
        data: {},
      }),
    );
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// PUT /comments/:productId
router.put("/:productId", requireAuth, passUserAuth, async (req, res) => {
  const productId = req.params.productId;
  const { content: commentText } = req.body;
  const { id: userId } = req.user;

  if (!commentText) {
    evt.fire(
      Evts.PRODUCT_COMMENT_ERROR,
      new ErrorEvent({
        type: Evts.PRODUCT_COMMENT_ERROR,
        error: "Comment text is required",
        errorCode: 400,
        data: { userId, productId },
      }),
    );
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    const updatedComment = await db.collection("comments").findOneAndUpdate(
      { productId, userId },
      {
        $set: {
          content: commentText,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    isCommentUpdated = true;
    evt.fire(
      Evts.PRODUCT_COMMENT_UPDATED,
      new CommentEvent({
        comment: updatedComment,
        type: Evts.PRODUCT_COMMENT_UPDATED,
      }),
    );
    res.json(updatedComment);
  } catch (error) {
    evt.fire(
      Evts.PRODUCT_COMMENT_ERROR,
      new ErrorEvent({
        type: Evts.PRODUCT_COMMENT_ERROR,
        error,
        errorCode: 500,
        data: { userId, productId },
      }),
    );
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// DELETE /comments/:productId
router.delete("/:productId", requireAuth, passUserAuth, async (req, res) => {
  const productId = req.params.productId;
  const { id: userId } = req.user;

  try {
    const deletedComment = await db
      .collection("comments")
      .findOneAndDelete({ productId, userId });

    if (!deletedComment) {
      evt.fire(
        Evts.PRODUCT_COMMENT_ERROR,
        new ErrorEvent({
          type: Evts.PRODUCT_COMMENT_ERROR,
          error: "Comment not found",
          errorCode: 404,
          data: { productId, userId },
        }),
      );
      return res.status(404).json({ error: "Comment not found" });
    }

    isCommentUpdated = true;
    evt.fire(
      Evts.PRODUCT_COMMENT_DELETED,
      new CommentEvent({
        comment: deletedComment,
        type: Evts.PRODUCT_COMMENT_DELETED,
      }),
    );
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    evt.fire(
      Evts.PRODUCT_COMMENT_ERROR,
      new ErrorEvent({
        type: Evts.PRODUCT_COMMENT_ERROR,
        error,
        errorCode: 500,
        data: { productId, userId },
      }),
    );
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

function handleCommentUpdateEvent({ comment, type }) {
  isCommentUpdated = true;

  // TODO: Use good statergy to update the product comment count, instead of counting all comments every time.
  if (comment && type !== Evts.PRODUCT_COMMENT_ERROR) {
    let productId = comment?.productId;
    if (productId) {
      // count comments of the product
      db.collection("comments")
        .countDocuments({ productId })
        .then((count) => {
          // Update the product with the new comment count
          db.collection("products").updateOne(
            { id: productId },
            { $set: { "metrics.commentCount": count } },
            { upsert: true, returnDocument: "after" },
          );
        });
    }
  }
}

evt.on(Evts.PRODUCT_COMMENTED, handleCommentUpdateEvent);
evt.on(Evts.PRODUCT_COMMENT_UPDATED, handleCommentUpdateEvent);
evt.on(Evts.PRODUCT_COMMENT_DELETED, handleCommentUpdateEvent);

// FEATURE: TODO: comment interaction such as like, replay

export default router;
