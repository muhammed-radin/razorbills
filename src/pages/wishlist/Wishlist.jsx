import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
export default function Wishlist() {
  return (
    <div>
       <div className="flex items-center gap-4 ml-35 my-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">Wishlist</h1>
        </div>
      <div className="flex flex-wrap gap-5 pb-5 justify-center">
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
