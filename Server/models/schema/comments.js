import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    userEmail: { type: String, required: true },

    content: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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
