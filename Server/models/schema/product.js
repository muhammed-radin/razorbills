const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");
const { productStatusCache } = require("../../utils/cache/product-status");

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: true },
  tax: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  keywords: { type: [String], default: [] },
  detailedDescription: { type: String, default: "" },
  specifications: {
    type: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    default: [],
  },
  features: { type: [String], default: [] },
  images: { type: [String], default: [] },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  dimensions: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    depth: { type: Number, default: 0 },
  },
  weight: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  currency: { type: String, default: "INR" },
  owner: {
    id: { type: String, default: "admin" },
    name: { type: String, default: "Admin" },
  },
  warranty: { type: String, default: null },
  returnPolicy: { type: String, default: null },
  shippingDetails: { type: String, default: null },
  relatedProducts: { type: [String], default: [] },
  accessories: { type: [String], default: [] },
  priceHistory: { type: [Number], default: [] },
  sku: { type: String, default: "111 122 33" },
  views: { type: Number, default: 0 },
  specialInfo: { type: Schema.Types.Mixed, default: {} },
});

ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  productStatusCache.update();
  next();
});

class MinimalProduct {
  constructor({
    idOrProductObj,
    title,
    price,
    thumbnail,
    rating,
    reviewCount,
    currency,
    createdAt,
    updatedAt,
    isActive,
    description,
    views,
    specialInfo,
  }) {
    if (typeof idOrProductObj === "object" && idOrProductObj !== null) {
      const product = idOrProductObj;
      this.id = product.id;
      this.title = product.title;
      this.price = product.price;
      this.thumbnail = product.thumbnail;
      this.rating = product.rating;
      this.reviewCount = product.reviewCount;
      this.currency = product.currency;
      this.createdAt = product.createdAt;
      this.updatedAt = product.updatedAt;
      this.isActive = product.isActive;
      this.description = product.description.slice(0, 80);
      this.views = product.views;
      this.specialInfo = product.specialInfo;
    } else {
      this.id = idOrProductObj;
      this.title = title;
      this.price = price;
      this.thumbnail = thumbnail;
      this.rating = rating;
      this.reviewCount = reviewCount;
      this.currency = currency;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.isActive = isActive;
      this.description = (description || "").slice(0, 80);
      this.views = views;
      this.specialInfo = specialInfo;
    }
  }
}

ProductSchema.methods.toMinimal = function () {
  return new MinimalProduct({
    id: this.id,
    title: this.title,
    price: this.price,
    thumbnail: this.thumbnail,
    rating: this.rating,
    reviewCount: this.reviewCount,
    currency: this.currency,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isActive: this.isActive,
    description: this.description,
  });
};

const ProductModel = mongoose.model("Product", ProductSchema, "products");

module.exports = { ProductSchema, ProductModel, MinimalProduct };
