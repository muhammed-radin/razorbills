import mongoose, { Schema } from "mongoose";

export const CartSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  products: {
    type: [Schema.Types.Mixed],
    default: [],
  },
  totalAmount: { type: Number, required: true, default: 0 },
  currency: { type: String, default: "INR" },
  isGuest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const CartModel = mongoose.model("Cart", CartSchema, "carts");
export default { CartSchema, CartModel };
