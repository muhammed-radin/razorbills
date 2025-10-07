import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { limitWords } from "@/utils/string";

export function OrderProductCard({ variant, className }) {
  let varientStyle = "";
  if (variant === "borderless") {
    varientStyle = "border-0 shadow-none";
  }

  return (
    <Card
      className={cn(
        "w-[400px] min-w-[300px] max-sm:max-w-[300px] relative flex flex-row items-start justify-start p-4 pl-0 gap-3",
        varientStyle,
        className
      )}
    >
      <div className="mx-2">
        <img
          src="/products/Headphone.jpg"
          alt="Product Image"
          className="w-[70px] min-w-[60px] rounded-md bg-background"
        />
      </div>
      <CardContent className="m-0 p-0">
        <CardTitle>Delivered on sep 24</CardTitle>
        <CardDescription>
          {limitWords(
            "Product description goes here. It provides a brief overview of the product features.",
            10
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default OrderProductCard;
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import OrderProductCard from "./Order-product-card";

export default function OrderCard() {
  return (
    <div>
      <main className="container max-w-3xl  p-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <Badge
                variant="outline"
                className="px-6 py-2 text-base font-semibold"
              >
                FULFILLED - PAID
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">ORDER ID</p>
                <p className="text-lg font-semibold">#252701</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Jul 21, 2025 9:53 PM
                </p>
                <p className="text-lg font-semibold">TOTAL : ₹476.72</p>
              </div>
            </div>

            <Separator />
          </CardHeader>

          <CardContent>
            <OrderProductCard />
            <OrderProductCard />
            <OrderProductCard />
            <OrderProductCard />
            <OrderProductCard />
          </CardContent>

          <CardFooter>
            <div className="flex gap-3 w-full">
              <Button variant="secondary" className="flex-1 h-11">
                Track Shipment
              </Button>
              <Button className="flex-1 h-11 bg-black hover:bg-black/90 text-white">
                Reorder
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
