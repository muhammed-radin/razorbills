import React from "react";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
export default function Wishlist() {
  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-4 sm:ml-13 my-4  ">
        <h1 className="text-2xl font-semibold tracking-tight">
          My Recent Wishlist
        </h1>
      </div>
      <div className="flex flex-wrap justify-center items-center p-5 gap-5 pb-5">
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
      </div>
    </div>
  );
}
