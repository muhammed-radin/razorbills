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

import { useTranslation } from "react-i18next";
import EmptyCart from "./components/empty-cart";
import ShoppingCart1 from "@/components/shopping-cart-1.jsx";
import { cartData } from "@/pages/cart/data/shopping-cart-1-data.js";

const CartPage = () => {
  const { t } = useTranslation();


  const isEmpty = cartData?.isEmpty?.() ?? true;

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

        {!isEmpty ? (
          /* Empty Cart State */
          <EmptyCart />
        ) : (
          /* Cart with Items */
          <ShoppingCart1 />
        )}
      </div>
    </div >
  );
};

export default CartPage;