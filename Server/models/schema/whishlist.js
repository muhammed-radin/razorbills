const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");

const WishlistSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  products: {
    type: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        Thumbnail: { type: String, required: true },
        originalPrice: { type: Number, required: true },
        sku: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    default: [],
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const WishlistModel = mongoose.model("Wishlist", WishlistSchema, "wishlists");
module.exports = { WishlistSchema, WishlistModel };
