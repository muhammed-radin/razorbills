import React from "react";
import WishlistProductRow from "./WishlistProductRow";

export function WishlistProductList({
  items = [],
  selectedIds = [],
  onToggleSelect = () => {},
  onRemoveItem = () => {},
  onAddToCart = () => {},
  onNotifyMe = () => {},
  onNavigate = () => {},
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
      {items.map((item) => (
        <WishlistProductRow
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelect={() => onToggleSelect(item.id)}
          onRemove={() => onRemoveItem(item.id, item.title)}
          onAddToCart={() => onAddToCart(item)}
          onNotifyMe={() => onNotifyMe(item)}
          onNavigate={() => onNavigate(item.id)}
        />
      ))}
    </div>
  );
}

export default WishlistProductList;
