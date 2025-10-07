import React from "react";
import OrderProductCard from "@/components/order-card/Order-card";
export default function Orderhistory() {
  return (
    <div >
      <h1 className="text-2xl font-bold ml-35 mt-4">My Order</h1>
    <div className="flex flex-wrap gap-5 justify-center p-5">
      <OrderProductCard />
      <OrderProductCard />
      <OrderProductCard />
      <OrderProductCard /> 
      <OrderProductCard />
    </div>
    </div>
  );
}
