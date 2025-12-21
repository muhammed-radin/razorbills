var express = require("express");
var router = express.Router();
const db = require("../utils/db");
const ProductModel = require("../models/schema/product").ProductModel;


/* GET */
router.get("/", async function (req, res, next) {
  const products = await db.collection("products").find({});
  res.json(await products.toArray());
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

router.get("/set/1", async function (req, res, next) {
  const ProductModel = require("../models/schema/product").ProductModel;
  const sample = new ProductModel({
    id: "1",
    title: "Wireless Headphones",
    thumbnail: "/products/Headphone.jpg",
    price: 99.99,
    originalPrice: 149.99,
    description: "High-quality wireless headphones with noise cancellation.",
    category: "Electronics",
    stock: 25,
    brand: "SoundMagic",
    tax: 5,
    tags: ["audio", "wireless", "headphones"],
    keywords: [
      "wireless headphones",
      "bluetooth headphones",
      "noise cancelling headphones",
    ],
    detailedDescription:
      "### Experience the Best Sound Quality\n" +
      "\n" +
      "Headphones are personal audio devices, small loudspeaker drivers worn on or around the head, that convert electrical signals into sound for private listening. They are electroacoustic transducers, available in styles like over-ear, on-ear, and in-ear (earbuds), and can connect to audio sources via wires or wireless Bluetooth technology. A headset is a combination of headphones and a microphone for audio and communication purposes\n" +
      "- **Advanced Noise Cancellation Technology**: Immerse yourself in your music without distractions.\n" +
      "- **Long Battery Life**: Enjoy up to 30 hours of playback on a single charge.\n" +
      "- **Comfortable Fit**: Designed for all-day listening with a lightweight and ergonomic over-ear design.\n" +
      "- **Quick Charge**: Get 2 hours of playback with just a 5-minute charge.\n" +
      "- **Voice Assistant Compatibility**: Easily integrate with your favorite voice assistants for hands-free control.\n" +
      "- **Foldable Design**: Conveniently store and carry your headphones wherever you go.\n" +
      "\n" +
      "### Physical Details\n" +
      "| Property   | Value       |\n" +
      "|------------|-------------|\n" +
      "| **Width**  | 7.5 inches  |\n" +
      "| **Height** | 8.5 inches  |\n" +
      "| **Length** | 3.5 inches  |\n" +
      "| **Weight** | 250g        |\n" +
      "| **Extra**  | Foldable design for portability |\n" +
      "\n" +
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tristique vestibulum orci sit amet 
accumsan. Nunc odio augue, egestas eget arcu sit amet, dapibus scelerisque mauris. Donec rutrum eros at justo consectetur mattis eget ut augue. Morbi tempus nulla non diam ultricies laoreet. Pellentesque congue felis enim, eget bibendum lorem molestie vitae. Donec consectetur tristique arcu nec vehicula. Donec porttitor facilisis nisl vitae maximus. Sed sit amet elit sit amet odio varius volutpat. Sed porttitor mattis tellus, ac elementum mi malesuada ac. Duis neque ex, pellentesque quis arcu et, mollis ultrices purus. Nam at posuere orci. Praesent 
auctor risus mi, at lacinia sem aliquet quis. Praesent rhoncus ultrices enim, sit amet pulvinar leo tincidunt et. Sed ultricies non lorem varius lacinia.\n`,
    specifications: [
      { label: "Connectivity", value: "Bluetooth 5.0, USB-C" },
      { label: "Battery Life", value: "30 hours playback" },
      { label: "Weight", value: "250g" },
      { label: "Driver Size", value: "40mm" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Impedance", value: "32 Ohms" },
    ],
    features: [
      "Active Noise Cancellation",
      "Quick Charge - 5 min charge for 2 hours playback",
      "Built-in Microphone for Calls",
      "Comfortable Over-Ear Design",
      "Foldable for Easy Storage",
      "Compatible with Voice Assistants",
    ],
    dimensions: { width: 0, height: 0, depth: 0 },
    weight: 0,
    images: [
      "/products/Headphone.jpg",
      "/products/Headphone2.jpg",
      "/products/Headphone.jpg",
    ],
    rating: 4,
    reviewCount: 45,
    createdAt: `2025-12-18T08:27:16.235Z`,
    updatedAt: `2025-12-18T08:27:16.235Z`,
    isActive: true,
    currency: "INR",
    owner: { id: "admin", name: "Admin" },
    warranty: null,
    returnPolicy: null,
    shippingDetails: null,
    relatedProducts: [],
    accessories: [],
    priceHistory: [],
    sku: "111 122 33",
  });
  await sample.save();
  res.json({ message: "Sample product added." });
});

module.exports = router;
