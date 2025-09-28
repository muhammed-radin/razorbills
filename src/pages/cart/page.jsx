import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShoppingBag, 
  Heart,
  Trash2,
  RefreshCw 
} from "lucide-react";
import { currency } from "@/utils/currency";
import { sampleCart } from "./sample-data";
import { Cart } from "@/models/cart";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";

const CartPage = () => {
  const [cart, setCart] = useState(sampleCart);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const success = cart.updateItemQuantity(cartItemId, newQuantity);
      if (success) {
        // Force re-render by creating a new cart instance with updated data
        const updatedCart = { ...cart };
        setCart(updatedCart);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleRemoveItem = (cartItemId) => {
    setIsLoading(true);
    setTimeout(() => {
      const success = cart.removeItem(cartItemId);
      if (success) {
        // Force re-render by creating a new cart instance with updated data
        const updatedCart = { ...cart };
        setCart(updatedCart);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsLoading(true);
      setTimeout(() => {
        cart.clear();
        // Force re-render by creating a new cart instance
        const newCart = new (cart.constructor)();
        setCart(newCart);
        setIsLoading(false);
      }, 300);
    }
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to checkout
    alert("Proceeding to checkout... (This is a demo)");
  };

  const isEmpty = cart.isEmpty();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart
              {!isEmpty && (
                <span className="ml-2 text-lg font-normal text-gray-600">
                  ({cart.getTotalItemsCount()} {cart.getTotalItemsCount() === 1 ? 'item' : 'items'})
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/search">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            {!isEmpty && (
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                disabled={isLoading}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>

        {isEmpty ? (
          /* Empty Cart State */
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. 
                Start shopping to fill it up!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/search">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  View Wishlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Items Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items
                </h2>
                <div className="flex items-center gap-2">
                  {cart.getTotalSavings() > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Total Savings: {currency(cart.getTotalSavings())}
                    </Badge>
                  )}
                  {isLoading && (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.items.map((cartItem) => (
                  <CartItem
                    key={cartItem.id}
                    cartItem={cartItem}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    className={isLoading ? "pointer-events-none opacity-70" : ""}
                  />
                ))}
              </div>

              {/* Continue Shopping */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Need something else?
                    </h3>
                    <p className="text-sm text-blue-700">
                      Continue shopping to discover more products
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/search">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                cart={cart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {/* Features Section */}
        {!isEmpty && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">
                Free shipping on orders above ₹500
              </p>
            </Card>
            <Card className="text-center p-6">
              <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">
                30-day return policy for all items
              </p>
            </Card>
            <Card className="text-center p-6">
              <Heart className="w-8 h-8 text-pink-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600">
                24/7 customer support available
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;