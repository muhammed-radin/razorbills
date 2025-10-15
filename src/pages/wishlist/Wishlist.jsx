import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
export default function Wishlist() {
  return (
    <div className="w-full">
       <div className="flex items-center gap-4 sm:ml-35 my-4 ml-5 ">
          <h1 className="text-xl font-semibold tracking-tight">My Recent Wishlist</h1>
        </div>
      <div className="flex flex-wrap justify-center gap-5 pb-5">
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
