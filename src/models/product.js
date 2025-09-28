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
    reviewsCount = 0,
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
    this.images = images; // Array of image URLs
    this.rating = rating; // Average rating out of 5
    this.reviewCount = reviewsCount; // Total number of reviews
    this.createdAt = new Date(); // Timestamp when the product is created
    this.updatedAt = new Date(); // Timestamp when the product is last updated
    this.isActive = true; // Boolean to indicate if the product is active
    this.currency = "INR"; // Default currency
  }
}

class ProductSpecification {
  constructor(label, value) {
    this.label = label;
    this.value = value;
  }
}

export { Product, ProductSpecification };