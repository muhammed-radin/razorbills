import mongoose, { Schema } from "mongoose";

export const WishlistSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  products: {
    type: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        originalPrice: { type: Number, required: true },
        sku: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        specialInfo: { type: Schema.Types.Mixed, default: {} },
      },
    ],
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
