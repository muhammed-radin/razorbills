var express = require("express");
var router = express.Router();
const db = require("../utils/db");
const { productStatusCache } = require("../utils/cache-utils/product-status");
const { FeedMold } = require("../models/feed");
const { MinimalProduct } = require("../models/schema/product");
const { productFeedCache } = require("../utils/cache-utils/product-feed");
const ProductModel = require("../models/schema/product").ProductModel;

/* GET */
router.get("/", async function (req, res, next) {
  let limit = parseInt(req.query.limit) || parseInt(req.body.limit) || 40;
  let search = req.query.search || req.body.search || "";
  let category = req.query.category || req.body.category || "";
  let priceMin =
    parseFloat(req.query.priceMin) || parseFloat(req.body.priceMin) || 0;
  let priceMax =
    parseFloat(req.query.priceMax) ||
    parseFloat(req.body.priceMax) ||
    Number.MAX_VALUE;
  let keywords = req.query.keywords || req.body.keywords || "";
  let tags = req.query.tags || req.body.tags || "";
  let sortBy = req.query.sortBy || req.body.sortBy || "createdAt";
  let sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  let ratingMin =
    parseFloat(req.query.ratingMin) || parseFloat(req.body.ratingMin) || 0;
  let ratingMax =
    parseFloat(req.query.ratingMax) || parseFloat(req.body.ratingMax) || 5;
  let inStock = req.query.inStock || req.query.inStock || false;

  let query = {};

  if (search) {
    // find in title, category, keywords, tags and description
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { keywords: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }
  if (keywords) {
    query.keywords = { $regex: keywords, $options: "i" };
  }
  if (tags) {
    query.tags = { $regex: tags, $options: "i" };
  }
  if (inStock) {
    query.inStock = inStock === "true";
  }
  query.price = { $gte: priceMin, $lte: priceMax };
  query.rating = { $gte: ratingMin, $lte: ratingMax };

  const products = await db
    .collection("products")
    .find(query)
    // .sort({ [sortBy]: sortOrder, createdAt: -1 })
    .limit(limit);
  res.json(await products.toArray());
});

router.get("/status", async function (req, res) {
  // if (productStatusCache.get() !== null && req.query.realtime !== "true") {
  //   return res.json(productStatusCache.get());
  // }

  await productStatusCache.update(req.query.lowThreshold || 5);
  res.json(productStatusCache.get());
});

router.get("/feed", async function (req, res) {
  if (productFeedCache.get() !== null && req.query.realtime !== "true") {
    return res.json(productFeedCache.get());
  }

  await productFeedCache.update();
  res.json(productFeedCache.get());
});

router.get("/:productid", async function (req, res) {
  const productid = req.params.productid;
  const { title, price, tags, keywords, originalPrice } = req.query;
  if (!productid) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  // const product = await db.collection("products").findOne({ id: productid });

  const query = { id: productid };

  if (title) {
    query.title = { $regex: title, $options: "i" }; // Case-insensitive title match
  }

  if (price) {
    query.price = parseFloat(price); // Match exact price
  }

  if (originalPrice) {
    query.originalPrice = parseFloat(originalPrice); // Match exact price
  }

  if (tags) {
    query.tags = { $in: tags.split(",") }; // Match any of the tags
  }

  if (keywords) {
    query.keywords = { $in: keywords.split(",") }; // Match any of the keywords
  }

  const product = await ProductModel.findOne(query);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(await product);
});

router.post("/new/:productId", async function (req, res) {
  const productId = req.params.productId;

  const product = await db.collection("products").findOne({ id: productId });
  if (product) {
    return res
      .status(403)
      .json({ error: "Product aleready found in ID: " + productId });
  }

  const newProduct = req.body;

  const created = await ProductModel.create(newProduct);
  res.json(created);
});

router.put("/:productid", async function (req, res) {
  const productid = req.params.productid;
  const product = req.body;
  const updated = await ProductModel.updateOne({ id: productid }, product);
  res.json(updated);
});

router.delete("/:productid", async function (req, res) {
  const productid = req.params.productid;
  const deleted = await ProductModel.deleteOne({ id: productid });
  res.json(deleted);
});

module.exports = router;
