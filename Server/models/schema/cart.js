import mongoose, { Schema } from "mongoose";
import { Product } from "../product.js";

export const CartSchema = new Schema({
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
  totalAmount: { type: Number, required: true, default: 0 },
  currency: { type: String, default: "INR" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const CartModel = mongoose.model("Cart", CartSchema, "carts");
export default { CartSchema, CartModel };