import React from "react";
import { Link } from "react-router-dom";
import { Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WishlistEmpty({ onResetDemo = () => {} }) {
  return (
    <Card className="bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 text-center py-16 px-6 mt-6 rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-0">
        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
          <Heart className="w-7 h-7 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Your Wishlist is Empty
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Looks like you haven't saved any items yet. Explore our shop to
            discover your favorite products.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap gap-3 justify-center">
          <Button
            onClick={onResetDemo}
            variant="outline"
            className="bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white text-xs font-semibold rounded-lg h-9 px-4 gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Reference Items
          </Button>
          <Button
            asChild
            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black text-xs font-semibold rounded-lg h-9 px-5 shadow-sm"
          >
            <Link to="/search">Explore Products</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default WishlistEmpty;
