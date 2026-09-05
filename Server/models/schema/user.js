import mongoose, { Schema } from "mongoose";

const generateId = () =>
  CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

export const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },

    currentlyLoggedIn: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    addressBook: { type: [String], default: [] },
    address: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    preferences: { type: Schema.Types.Mixed, default: {} },
    provider: { type: String, default: "local" },

    adminPermissions: { type: [String], default: [] },
    role: { type: String, default: "user", enum: ["user", "admin", "owner"] },
    image: { type: String, default: null },
    banned: { type: Boolean, default: false },
    banExpires: { type: Date, default: null },
    banReason: { type: String, default: null },

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
    id: true, // Add a virtual 'id' getter that returns the string representation of '_id'
  },
);

export const UserModel = mongoose.model("User", UserSchema, "users");

export default { UserSchema, UserModel };
