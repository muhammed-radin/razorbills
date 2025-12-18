const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");

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
    type: [{
      label: { type: String, required: true },
      value: { type: String, required: true }
    }], 
    default: [] 
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
});

const ProductModel = mongoose.model("Product", ProductSchema, "products");

module.exports = {ProductSchema, ProductModel};
