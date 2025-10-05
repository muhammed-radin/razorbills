import { Cart } from "@/models/cart";
import { products } from "@/app/product/[id]/sample-data";

// Create a sample cart with some products
export const sampleCart = new Cart();

// Add some sample products to cart
sampleCart.addItem(products[0], 2); // Wireless Headphones - 2 units
sampleCart.addItem(products[1], 1); // Bluetooth Speaker - 1 unit
sampleCart.addItem(products[2], 3); // Power Bank - 3 units
sampleCart.addItem(products[3], 1); // LED Light Strips - 1 unit

// Additional sample cart items for demonstration
export const createSampleCart = () => {
  const cart = new Cart();
  
  // Add various products with different quantities
  if (products.length > 0) {
    cart.addItem(products[0], 1); // First product
  }
  
  if (products.length > 1) {
    cart.addItem(products[1], 2); // Second product with quantity 2
  }
  
  if (products.length > 2) {
    cart.addItem(products[2], 1); // Third product
  }
  
  return cart;
};

// Empty cart for testing
export const emptyCart = new Cart();