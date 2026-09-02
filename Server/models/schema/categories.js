import mongoose, { Schema } from "mongoose";
import { Product } from "../product.js";

export const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: "" },
  Logo: { type: String, default: "" },
  description: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Category = mongoose.model("Category", CategorySchema, "categories");
export default { Category, CategorySchema };
