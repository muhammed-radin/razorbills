class Product {
  constructor(
    id,
    name,
    price,
    originalPrice,
    thumbnail,
    description,
    category,
    stock,
    brand,
    tax = 0,
    tags = [],
    keywords = [],
    detailedDescription = "",
    specifications = [],
    features = [],
    images = [],
    rating = 4.5,
    reviewsCount = 0
  ) {
    this.id = id;
    this.name = name;
    this.thumbnail = thumbnail; // URL of the thumbnail image
    this.price = price;
    this.originalPrice = originalPrice;
    this.description = description;
    this.category = category;
    this.stock = stock;
    this.brand = brand;
    this.tax = tax; // Tax percentage
    this.tags = tags; // Array of tags
    this.keywords = keywords;
    this.detailedDescription = detailedDescription;
    this.specifications = specifications;
    this.features = features;
    this.dimensions = {
      width: 0,
      height: 0,
      depth: 0,
    }
    this.weight = 0
    this.images = images; // Array of image URLs
    this.rating = rating; // Average rating out of 5
    this.reviewCount = reviewsCount; // Total number of reviews
    this.createdAt = new Date(); // Timestamp when the product is created
    this.updatedAt = new Date(); // Timestamp when the product is last updated
    this.isActive = true; // Boolean to indicate if the product is active
    this.currency = "INR"; // Default currency
    this.owner = { id: "admin", name: "Admin" }; // Owner information
    this.warranty = null; // Warranty information
    this.returnPolicy = null; // Return policy information
    this.shippingDetails = null; // Shipping details
    this.relatedProducts = []; // Array of related product IDs
    this.accessories = []; // Array of accessory product IDs
    this.priceHistory = []; // Array to track price changes over time
    this.sku = "111 122 33"
  }
}

class ProductSpecification {
  constructor(label, value) {
    this.label = label;
    this.value = value;
  }
}

class Price {
  constructor(amount, date, currency = "INR", discount = 0) {
    this.amount = amount;
    this.date = date;
    this.currency = currency;
    this.discount = discount; // Discount price
  }
}

export { Product, ProductSpecification, Price };
