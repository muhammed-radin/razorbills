import React from "react";
import OrderCard from "@/components/order-card/Order-card";
export default function Orderhistory() {
  return (
    <div>
      <div className="flex justify-center items-center gap-4 sm:ml-13 my-4  ">
        <h1 className="text-2xl font-semibold tracking-tight">
          My Recent Orders
        </h1>
      </div>
      <div className="flex flex-wrap justify-center pb-5">
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