import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, Truck, Shield, Tag } from "lucide-react";
import { currency } from "@/utils/currency";
import { cn } from "@/lib/utils";

const CartSummary = ({ 
  cart, 
  onCheckout, 
  className,
  taxRate = 0.18,
  freeShippingThreshold = 500
}) => {
  if (!cart || cart.isEmpty()) {
    return null;
  }

  const subtotal = cart.getSubtotal();
  const originalSubtotal = cart.getOriginalSubtotal();
  const totalSavings = cart.getTotalSavings();
  const tax = cart.getTax(taxRate);
  const shipping = cart.getShipping(freeShippingThreshold);
  const total = cart.getTotal(taxRate, freeShippingThreshold);
  const itemsCount = cart.getTotalItemsCount();
  
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <Card className={cn("sticky top-4", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Count */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Items ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">{currency(subtotal)}</span>
        </div>

        {/* Original Price & Savings */}
        {totalSavings > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Original Price</span>
              <span className="line-through text-gray-500">{currency(originalSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Total Savings
              </span>
              <span className="text-green-600 font-medium">-{currency(totalSavings)}</span>
            </div>
            <Separator />
          </>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Shipping
          </span>
          <div className="text-right">
            {shipping === 0 ? (
              <div className="flex items-center gap-1">
                <span className="text-green-600 font-medium">FREE</span>
                <Badge variant="secondary" className="text-xs">
                  ₹{freeShippingThreshold}+
                </Badge>
              </div>
            ) : (
              <span className="font-medium">{currency(shipping)}</span>
            )}
          </div>
        </div>

        {/* Free Shipping Progress */}
        {!isEligibleForFreeShipping && amountNeededForFreeShipping > 0 && (
          <div className="p-3 bg-blue-50 rounded-md">
            <div className="text-sm text-blue-800">
              Add {currency(amountNeededForFreeShipping)} more for FREE shipping!
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST {Math.round(taxRate * 100)}%)</span>
          <span className="font-medium">{currency(tax)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{currency(total)}</span>
        </div>

        {/* Checkout Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={onCheckout}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to Checkout
        </Button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Secure Checkout</span>
        </div>

        {/* Benefits */}
        <div className="space-y-2 pt-2">
          <div className="text-sm text-gray-600">
            ✓ Free returns within 30 days
          </div>
          <div className="text-sm text-gray-600">
            ✓ 1-year manufacturer warranty
          </div>
          <div className="text-sm text-gray-600">
            ✓ Customer support 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;