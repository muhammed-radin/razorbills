import React from "react";
import OrderCard from "@/components/order-card/Order-card";
export default function Orderhistory() {
  return (
    <div>
      <div className="flex items-center gap-4 sm:ml-35 my-4 ml-5 ">
        <h1 className="text-xl font-semibold tracking-tight">
          My Recent Orders
        </h1>
      </div>
      <div className="flex flex-wrap justify-center  p-3">
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
      </div>
    </div>
  );
}
