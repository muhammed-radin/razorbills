class Product {
    constructor(id, name, price, description, category, stock, brand, discount = 0, tax = 0, tags = []) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.stock = stock;
        this.brand = brand;
        this.discount = discount; // Discount percentage
        this.tax = tax; // Tax percentage
        this.tags = tags; // Array of tags
    }

    updateStock(quantity) {
        this.stock += quantity;
    }

    applyDiscount(discountPercentage) {
        this.discount = discountPercentage;
        this.price -= (this.price * discountPercentage) / 100;
    }

    calculateFinalPrice() {
        const discountedPrice = this.price - (this.price * this.discount) / 100;
        const finalPrice = discountedPrice + (discountedPrice * this.tax) / 100;
        return finalPrice;
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
    }

    getDetails() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            category: this.category,
            stock: this.stock,
            brand: this.brand,
            discount: this.discount,
            tax: this.tax,
            tags: this.tags,
            finalPrice: this.calculateFinalPrice(),
        };
    }
}
