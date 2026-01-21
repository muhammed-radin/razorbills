const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");

const ReviewCommentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  comment: { type: String, required: true, default: "" },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5, required: true },
  userName: { type: String, required: true  },
  userAvatar: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("Review", ReviewCommentSchema, "reviews");

module.exports = { ReviewCommentSchema, ReviewModel };