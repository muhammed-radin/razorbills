import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      ref: "Product",
      index: true,
      required: true,
    },
    userId: { type: String, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "", required: true },
    userEmail: { type: String, required: true },

    content: { type: String, required: true },

    updatedAt: { type: Date, default: Date.now, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    likes: { type: Number, default: 0 }, // number of likes, count from Counter collection
    rating: { type: Number, min: 0, max: 5, default: 0 }, // rating from 0 to 5
  },
  {
    timestamps: true,
    strict: true,
  },
);

export const CommentModel = mongoose.model(
  "Comment",
  commentSchema,
  "comments",
);

export default { CommentModel, commentSchema };
