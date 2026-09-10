import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TrendingDown, Flame, Package } from "lucide-react";

import WishlistHeader from "./components/WishlistHeader";
import WishlistToolbar from "./components/WishlistToolbar";
import WishlistProductList from "./components/WishlistProductList";
import WishlistEmpty from "./components/WishlistEmpty";
import WishlistSkeleton from "./components/WishlistSkeleton";

// Reference dataset matching the visual specification
const DEFAULT_WISHLIST_ITEMS = [
  {
    id: "1",
    brand: "Halden",
    title: "Storm Wool Coat",
    variant: "Camel · M",
    stockStatus: "in_stock",
    stockLabel: "In stock",
    savedDate: "Saved 3 days ago",
    originalPrice: 420,
    price: 385,
    savings: 35,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop&q=80",
    badge: {
      type: "price_drop",
      label: "Price Drop Save $35",
      icon: TrendingDown,
    },
    inStock: true,
  },
  {
    id: "2",
    brand: "Marlow Goods",
    title: "Italian Penny Loafers",
    variant: "Walnut · 10",
    stockStatus: "low_stock",
    stockLabel: "Only 2 left",
    savedDate: "Saved 1 week ago",
    originalPrice: null,
    price: 295,
    savings: 0,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
    badge: {
      type: "almost_gone",
      label: "Almost Gone",
      icon: Flame,
    },
    inStock: true,
  },
  {
    id: "3",
    brand: "Wren & Field",
    title: "Cashmere V-Neck Sweater",
    variant: "Oat · M",
    stockStatus: "in_stock",
    stockLabel: "In stock",
    savedDate: "Restocked 2 days ago",
    originalPrice: null,
    price: 228,
    savings: 0,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80",
    badge: {
      type: "back_in_stock",
      label: "Back In Stock",
      icon: Package,
    },
    inStock: true,
  },
  {
    id: "4",
    brand: "Marlow Goods",
    title: "Slim Card Holder",
    variant: "Oxblood",
    stockStatus: "in_stock",
    stockLabel: "In stock",
    savedDate: "Saved 4 days ago",
    originalPrice: null,
    price: 85,
    savings: 0,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    badge: null,
    inStock: true,
  },
  {
    id: "5",
    brand: "Wren & Field",
    title: "Weekend Tote Bag",
    variant: "Tan",
    stockStatus: "out_of_stock",
    stockLabel: "Out of stock",
    savedDate: "Saved 5 days ago",
    originalPrice: null,
    price: 310,
    savings: 0,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    badge: null,
    inStock: false,
  },
];

export default function Wishlist() {
  const navigate = useNavigate();

  const [items, setItems] = useState(DEFAULT_WISHLIST_ITEMS);
  const [selectedIds, setSelectedIds] = useState(
    DEFAULT_WISHLIST_ITEMS.map((item) => item.id)
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initial render loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Compute stats dynamically from active wishlist items
  const stats = useMemo(() => {
    let priceDropCount = 0;
    let backInStockCount = 0;
    let almostGoneCount = 0;
    let totalSavings = 0;

    items.forEach((item) => {
      if (item.badge?.type === "price_drop") priceDropCount++;
      if (item.badge?.type === "back_in_stock") backInStockCount++;
      if (item.badge?.type === "almost_gone") almostGoneCount++;
      if (item.savings) totalSavings += item.savings;
    });

    return {
      priceDropCount,
      backInStockCount,
      almostGoneCount,
      totalSavings,
    };
  }, [items]);

  // Selection state
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(items.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Count of selected items that are in-stock
  const selectedInStockCount = useMemo(() => {
    return items.filter(
      (item) => selectedIds.includes(item.id) && item.inStock
    ).length;
  }, [items, selectedIds]);

  // Event Handlers
  const handleRemoveItem = (id, title) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    toast.success(`Removed "${title}" from your wishlist`);
  };

  const handleAddToCart = (item) => {
    toast.success(`Added "${item.title}" to cart`);
  };

  const handleAddSelectedToCart = () => {
    const selectedInStock = items.filter(
      (item) => selectedIds.includes(item.id) && item.inStock
    );
    if (selectedInStock.length === 0) return;

    toast.success(
      `Added ${selectedInStock.length} item${selectedInStock.length > 1 ? "s" : ""} to cart!`
    );
  };

  const handleNotifyMe = (item) => {
    toast.info(`You'll be notified when "${item.title}" is back in stock`);
  };

  const handleShareList = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!");
    } else {
      toast.success("Wishlist link ready to share!");
    }
  };

  const handleResetDemo = () => {
    setItems(DEFAULT_WISHLIST_ITEMS);
    setSelectedIds(DEFAULT_WISHLIST_ITEMS.map((item) => item.id));
    toast.info("Wishlist items restored");
  };

  if (isLoading) {
    return <WishlistSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-white selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header Section */}
        <WishlistHeader itemCount={items.length} stats={stats} />

        {/* Wishlist Main View */}
        {items.length === 0 ? (
          <WishlistEmpty onResetDemo={handleResetDemo} />
        ) : (
          <div>
            {/* Toolbar Row */}
            <WishlistToolbar
              itemCount={items.length}
              isAllSelected={isAllSelected}
              selectedInStockCount={selectedInStockCount}
              onSelectAll={handleSelectAll}
              onShareList={handleShareList}
              onAddSelectedToCart={handleAddSelectedToCart}
            />

            {/* Product List */}
            <WishlistProductList
              items={items}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onRemoveItem={handleRemoveItem}
              onAddToCart={handleAddToCart}
              onNotifyMe={handleNotifyMe}
              onNavigate={(id) => navigate(`/product/${id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
