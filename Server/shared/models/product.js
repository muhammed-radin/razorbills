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
