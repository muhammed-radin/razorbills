'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { currency } from "@/utils/currency";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CartItem = ({ 
  cartItem, 
  onQuantityChange, 
  onRemove, 
  className 
}) => {
  const { product, quantity } = cartItem;
  
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      onQuantityChange(cartItem.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(cartItem.id);
  };

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card",
      isOutOfStock && "opacity-60",
      className
    )}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-md hover:opacity-80 transition-opacity cursor-pointer"
            onError={(e) => {
              e.target.src = '/products/placeholder.png';
            }}
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="space-y-1">
            <Link href={`/product/${product.id}`}>
              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.brand}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-pink-600"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator className="sm:hidden" />

        {/* Price and Quantity Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                {currency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {currency(product.originalPrice)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Subtotal: <span className="font-semibold">{currency(cartItem.getTotalPrice())}</span>
            </div>
            {cartItem.getSavings() > 0 && (
              <div className="text-sm text-green-600 dark:text-green-400">
                You save: {currency(cartItem.getSavings())}
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Qty:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-3 text-center min-w-[2.5rem] text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        {isOutOfStock && (
          <Badge variant="destructive" className="w-fit">
            Out of Stock
          </Badge>
        )}
        {isLowStock && !isOutOfStock && (
          <Badge variant="outline" className="w-fit text-orange-600 border-orange-600 dark:text-orange-400 dark:border-orange-400">
            Only {product.stock} left in stock
          </Badge>
        )}
        {!isOutOfStock && !isLowStock && (
          <div className="text-xs text-green-600 dark:text-green-400">
            In Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;