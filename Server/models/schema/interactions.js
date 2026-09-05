import mongoose, { Schema } from "mongoose";

export const InteractionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    // Basic
    userId: { type: String, required: true, index: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      index: true,
      required: true,
    },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    userEmail: { type: String, required: true },

    // Interactions
    rating: { type: Number, default: null }, // Nullable: 1 per user ( 1-5 stars )
    isGuest: { type: Boolean, default: true },
    hasViewed: { type: Boolean, default: false },
    hasShared: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    strict: true,
  },
);
InteractionSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const InteractionModel = mongoose.model(
  "Interaction",
  InteractionSchema,
  "interactions",
);
