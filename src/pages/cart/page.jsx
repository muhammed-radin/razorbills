import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { sampleCart } from "./sample-data.js";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { t } = useTranslation();
  const [cart] = useState(() => sampleCart);
  const [cartItems, setCartItems] = useState([...cart.items]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    setIsLoading(true);
    setTimeout(() => {
      const success = cart.updateItemQuantity(cartItemId, newQuantity);
      if (success) {
        setCartItems([...cart.items]);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleRemoveItem = (cartItemId) => {
    setIsLoading(true);
    setTimeout(() => {
      const success = cart.removeItem(cartItemId);
      if (success) {
        setCartItems([...cart.items]);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm(t("cart.clearConfirm"))) {
      setIsLoading(true);
      setTimeout(() => {
        cart.clear();
        setCartItems([...cart.items]);
        setIsLoading(false);
      }, 300);
    }
  };

  const handleCheckout = () => {
    alert(t("cart.checkoutDemo"));
  };

  const isEmpty = cart?.isEmpty?.() ?? true;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("product.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("cart.title")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {t("cart.title")}
              {!isEmpty && (
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({cart.getTotalItemsCount()} {cart.getTotalItemsCount() === 1 ? t("common.item") : t("common.items")})
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/search">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("cart.continueShopping")}
              </Link>
            </Button>
            {!isEmpty && (
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                disabled={isLoading}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("cart.clearCart")}
              </Button>
            )}
          </div>
        </div>

        {isEmpty ? (
          /* Empty Cart State */
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("cart.emptyCartTitle")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("cart.emptyCartDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/search">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t("cart.startShopping")}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/wishlist">
                    <Heart className="w-4 h-4 mr-2" />
                    {t("cart.viewWishlist")}
                  </Link>
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
                <h2 className="text-xl font-semibold text-foreground">
                  {t("cart.cartItems")}
                </h2>
                <div className="flex items-center gap-2">
                  {cart.getTotalSavings() > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {t("cart.totalSavings", { amount: currency(cart.getTotalSavings()) })}
                    </Badge>
                  )}
                  {isLoading && (
                    <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((cartItem) => (
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
              <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      {t("cart.needSomethingElse")}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t("cart.continueShoppingDesc")}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/search">
                      {t("cart.continueShopping")}
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
              <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t("cart.featureFreeShipping")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("cart.featureFreeShippingDesc")}
              </p>
            </Card>
            <Card className="text-center p-6">
              <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t("cart.featureEasyReturns")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("cart.featureEasyReturnsDesc")}
              </p>
            </Card>
            <Card className="text-center p-6">
              <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t("cart.featureSupport")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("cart.featureSupportDesc")}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;