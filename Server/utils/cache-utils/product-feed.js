const { FeedMold, ShowCaseTab } = require("../../models/feed");
const { ProductModel, MinimalProduct } = require("../../models/schema/product");
const { useMemory } = require("../memory");

const productFeedCache = useMemory(null, "productFeedCache", 60);

productFeedCache.toUpdate(async function populateFeed(memory) {
  const Feed = new FeedMold();

  // find 20 products
  const randomProducts = await ProductModel.aggregate([
    { $sample: { size: 20 } },
  ]);

  const minimalProucts = randomProducts.map(
    (product) => new MinimalProduct(product),
  );

  Feed.randomProducts = minimalProucts;

  // find latest
  const latestProducts = await ProductModel.find()
    .sort({ createdAt: -1 })
    .limit(20);
  const minimalLatestProducts = latestProducts.map(
    (product) => new MinimalProduct(product),
  );
  Feed.latest = minimalLatestProducts;

  // find rated
  const ratedProducts = await ProductModel.find()
    .sort({ rating: -1 })
    .limit(20);
  const minimalRatedProducts = ratedProducts.map(
    (product) => new MinimalProduct(product),
  );
  Feed.rated = minimalRatedProducts;

  // find trending by views in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const trendingProducts = await ProductModel.find({
    createdAt: { $gte: sevenDaysAgo },
  })
    .sort({ views: -1 })
    .limit(20);
  const minimalTrendingProducts = trendingProducts.map(
    (product) => new MinimalProduct(product),
  );
  Feed.trending = minimalTrendingProducts;

  // find featured by featured in specialInfo or featured in keywords
  const featuredProducts = await ProductModel.find({
    $or: [
      { "specialInfo.featured": true },
      { keywords: { $in: ["featured"] } },
    ],
  }).limit(20);
  const minimalFeaturedProducts = featuredProducts.map(
    (product) => new MinimalProduct(product),
  );
  Feed.featured = minimalFeaturedProducts;

  // find highlight by highlight in specialInfo. highlight is string contains image url in specialInfo
  const highlightProducts = await ProductModel.find({
    "specialInfo.highlight": { $exists: true, $ne: "" },
  }).limit(20);
  const minimalHighlightProducts = highlightProducts.map(
    (product) => new MinimalProduct(product),
  );
  Feed.highlight = minimalHighlightProducts;

  // update showcase card
  // find most viewed featured 3 products
  const featuredViewedProducts = await ProductModel.find({
    "specialInfo.featured": true,
  })
    .sort({ views: -1 })
    .limit(3);
  const minimalFeaturedViewedProducts = featuredViewedProducts.map(
    (product) => new MinimalProduct(product),
  );
  Feed.showcaseCard.listed = minimalFeaturedViewedProducts;

  // get tabs from admin ( now admin under development, so we will use hardcoded tabs )
  Feed.showcaseCard.tabs = [
    new ShowCaseTab(
      "MCU Controller",
      "Wireless MCU Controller",
      "Control your MCU with our wireless controller",
      "https://example.com/mcu-controller.jpg",
      "/products/mcu-controller",
      "#ff0000",
    ),
    new ShowCaseTab(
      "Gaming Mouse",
      "Ergonomic Gaming Mouse",
      "Experience precision and comfort with our ergonomic gaming mouse",
      "https://example.com/gaming-mouse.jpg",
      "/products/gaming-mouse",
      "#00ff00",
    ),
    new ShowCaseTab(
      "Mechanical Keyboard",
      "RGB Mechanical Keyboard",
      "Enhance your gaming setup with our RGB mechanical keyboard",
      "https://example.com/mechanical-keyboard.jpg",
      "/products/mechanical-keyboard",
      "#0000ff",
    ),
  ];

  // find 4 categories
  const categories = await ProductModel.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 4 },
  ]);

  Feed.grid_categories = categories.map((category) => ({
    name: category._id,
    thumbnail: `https://example.com/category-${category._id}.jpg`,
    link: `/products?tags=${category._id}`,
  }));

  memory.set(Feed);
  memory.expireTimeout(1000 * 60 * 60); // expire in 1 hour
});

module.exports = { productFeedCache };
