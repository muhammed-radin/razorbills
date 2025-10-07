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
