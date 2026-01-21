const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
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

  /// Additional fields for enhanced user profile
  // wishlist: { type: [String], default: [] },
  // cart: { type: [String], default: [] },

  // orderInfo { orders: 100, lastOrderDate: Date, lastOrderId: String }
  orderInfo: {
    orders: { type: Number, default: 0 },
    lastOrderDate: { type: Date, default: null },
    lastOrderId: { type: String, default: null },
  },
  totalSpent: { type: Number, default: 0 },
  AOV: { type: Number, default: 0 }, // Average Order Value
});

const UserModel = mongoose.model("User", UserSchema, "users");

module.exports = { UserSchema, UserModel };
