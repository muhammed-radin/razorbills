import mongoose, { Schema } from "mongoose";
import { productStatusCache } from "../../utils/cache-utils/product-status.js";

export const ProductSchema = new Schema(
  {
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
    specialInfo: { type: Schema.Types.Mixed, default: {} },

    meterics: {
      allViews: { type: Number, default: 0 },
      debouncedViews: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      cartCount: { type: Number, default: 0 },
      wishlistCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  productStatusCache.update();
  if (typeof next === "function") {
    next();
  }
});

export class MinimalProduct {
  constructor({
    id,
    title,
    price,
    thumbnail,
    currency,
    createdAt,
    updatedAt,
    isActive,
    description,
    specialInfo,
    originalPrice,
    keywords,
    tags,
    category,
    stock,
    meterics,
    owner,
  } = {}) {
    const product =
      typeof id === "object" && id !== null
        ? id
        : {
            id,
            title,
            price,
            originalPrice,
            thumbnail,
            currency,
            createdAt,
            updatedAt,
            isActive,
            description,
            specialInfo,
            keywords,
            tags,
            category,
            stock,
            meterics,
            owner,
          };

    this.id = product.id;
    this._id = product.id || product._id;
    this.title = product.title;
    this.price = product.price;
    this.originalPrice = product.originalPrice;
    this.thumbnail = product.thumbnail;
    this.currency = product.currency;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.isActive = product.isActive;
    this.description = (product.description || "").slice(0, 80);
    this.specialInfo = product.specialInfo;
    this.keywords = product.keywords;
    this.tags = product.tags;
    this.category = product.category;
    this.stock = product.stock;
    this.meterics = product.meterics;
    this.owner = product.owner;
  }
}

ProductSchema.methods.toMinimal = function () {
  return new MinimalProduct({
    id: this.id,
    title: this.title,
    price: this.price,
    thumbnail: this.thumbnail,
    currency: this.currency,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isActive: this.isActive,
    description: this.description,
    specialInfo: this.specialInfo,
    originalPrice: this.originalPrice,
    keywords: this.keywords,
    tags: this.tags,
    category: this.category,
    stock: this.stock,
    meterics: this.meterics,
    owner: this.owner,
  });
};

ProductSchema.methods.toCartProduct = function (quantity = 1) {
  return {
    id: this.id,
    title: this.title,
    price: this.price,
    thumbnail: this.thumbnail,
    currency: this.currency,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isActive: this.isActive,
    description: this.description,
    specialInfo: this.specialInfo,
    originalPrice: this.originalPrice,
    category: this.category,
    stock: this.stock,
    meterics: this.meterics,
    quantity,
  };
};

export const ProductModel = mongoose.model(
  "Product",
  ProductSchema,
  "products",
);

export default { ProductSchema, ProductModel, MinimalProduct };
