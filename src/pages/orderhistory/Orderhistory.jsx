import React from "react";
import OrderCard from "@/components/order-card/Order-card";
export default function Orderhistory() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden ">
      <div className="max-w-5xl flex flex-col mx-auto items-center px-4">
        <div className="flex justify-center items-center gap-4 my-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            My Recent Orders
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-5 w-full min-w-0">
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        </div>
      </div>
    </div>
  );
}