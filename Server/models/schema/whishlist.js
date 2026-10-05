import mongoose, { Schema } from "mongoose";

export const WishlistSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  products: {
    type: [Schema.Types.Mixed],
    default: [],
    required: true,
  },
  folder: { type: String, default: "/", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const WishlistModel = mongoose.model(
  "Wishlist",
  WishlistSchema,
  "wishlists",
);
