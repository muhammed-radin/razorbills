const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");

const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", CategorySchema, "categories");
module.exports = { Category, CategorySchema };