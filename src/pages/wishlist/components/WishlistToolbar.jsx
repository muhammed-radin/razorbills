import React from "react";
import { Share2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function WishlistToolbar({
  itemCount = 0,
  isAllSelected = false,
  selectedInStockCount = 0,
  onSelectAll = () => {},
  onShareList = () => {},
  onAddSelectedToCart = () => {},
}) {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800/80 pt-4 pb-4 flex items-center justify-between gap-4">
      {/* Select All Checkbox & Count */}
      <div className="flex items-center gap-1">
        <Checkbox
          id="select-all-header"
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
          className="border-neutral-300 dark:border-neutral-600 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black shrink-0 w-4 h-4 rounded-sm"
        />
        <label
          htmlFor="select-all-header"
          className="text-sm font-semibold text-neutral-900 dark:text-white cursor-pointer select-none"
        >
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </label>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          onClick={onShareList}
          className="bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white text-xs font-semibold rounded-lg h-8 px-1.5 gap-1 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share List
        </Button>
        <Button
          onClick={onAddSelectedToCart}
          disabled={selectedInStockCount === 0}
          className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 text-xs font-semibold rounded-lg h-8 px-1.5 sm:px-4 gap-1 shadow-sm disabled:opacity-40 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add {selectedInStockCount} To Cart
        </Button>
      </div>
    </div>
  );
}

export default WishlistToolbar;
