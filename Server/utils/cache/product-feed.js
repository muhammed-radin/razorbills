const { FeedMold } = require("../../models/feed");
const { ProductModel, MinimalProduct } = require("../../models/schema/product");
const { useMemory } = require("../memory");

const productFeedCache = useMemory(null);

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

  // find featured by featured in specialInfo
  const featuredProducts = await ProductModel.find({
    "specialInfo.featured": true,
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

  memory.set(Feed);
});

module.exports = { productFeedCache };
