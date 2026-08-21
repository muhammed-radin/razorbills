import mongoose, { Schema } from "mongoose";
import { Product } from "../product.js";

export const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: "user" },
    profilePicture: { type: String, default: null },
    currentlyLoggedIn: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    addressBook: { type: [String], default: [] },
    address: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    preferences: { type: Schema.Types.Mixed, default: {} },
    provider: { type: String, default: "local" },
    adminPermissions: {
      read: { type: Boolean, default: true },
      write: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
    },

    // orderInfo { orders: 100, lastOrderDate: Date, lastOrderId: String }
    orderInfo: {
      orders: { type: Number, default: 0 },
      lastOrderDate: { type: Date, default: null },
      lastOrderId: { type: String, default: null },
    },
    totalSpent: { type: Number, default: 0 },
    AOV: { type: Number, default: 0 }, // Average Order Value
  },
  {
    timestamps: true,
    strict: true, // Allow additional fields not defined in the schema
    collection: "users", // Specify the collection name
  },
);

export const UserModel = mongoose.model("User", UserSchema, "users");

export default { UserSchema, UserModel };
