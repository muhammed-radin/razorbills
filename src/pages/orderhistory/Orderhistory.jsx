import React from "react";
import OrderProductCard from "@/components/order-card/Order-product-card";
import OrderCard from "@/components/order-card/Order-card";
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
export default function Orderhistory() {
  return (
    <div >
        <div className="flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">MY ORDERS</h1>
        </div>
    <div className="flex flex-wrap gap-5 justify-center p-5">
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
    </div>
    </div>
  );
}
