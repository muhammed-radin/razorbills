import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { currency } from "@/utils/currency";
import { useCartStore, useWishlistStore } from "@/stores/shop";
import { toast } from "sonner";
import RatingStar from "@/components/rating-star";

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const [imgOk, setImgOk] = useState(false);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.add);
  const { has, toggle } = useWishlistStore();
  const pid = product.productId ?? product.id;
  const wished = has(pid);

  const discount =
    product.originalPrice != null && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const hasRating = Number(product.rating) > 0;

  const handleAdd = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(product, 1);
      setAdded(true);
      toast.success("Added to cart");
      setTimeout(() => setAdded(false), 1400);
    } catch {
      toast.error("Could not add to cart");
    }
  };

  const handleWish = async (e) => {
    e.stopPropagation();
    try {
      await toggle(product);
      toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <Card
      onClick={() => navigate(`/product/${pid}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border-muted bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)]"
      style={{ animation: `card-in 0.6s ${Math.min(index, 8) * 60}ms both` }}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        {!imgOk && <div className="absolute inset-0 animate-pulse bg-muted" />}
        <img
          src={product.thumbnail || product.image}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImgOk(true)}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]",
            !imgOk && "opacity-0"
          )}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-rose-600 hover:bg-rose-600 text-white border-0 shadow-lg">
              -{discount}%
            </Badge>
          )}
          {product.badge && (
            <Badge variant="secondary" className="backdrop-blur bg-background/85">
              {product.badge}
            </Badge>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleWish}
                aria-label="Wishlist"
                className={cn(
                  "absolute right-3 top-3 grid size-9 place-items-center rounded-full border backdrop-blur transition active:scale-90",
                  wished
                    ? "bg-rose-500 border-rose-500 text-white shadow-lg"
                    : "bg-background/85 hover:bg-background"
                )}
              >
                <Heart className={cn("size-4", wished && "fill-current")} />
              </button>
            </TooltipTrigger>
            <TooltipContent>{wished ? "Saved" : "Add to wishlist"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {product.stock <= 0 && (
          <div className="absolute inset-0 grid place-items-center bg-black/55">
            <Badge variant="destructive">Out of stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {product.brand || product.category || "Razorbills"}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-snug">
          <Link to={`/product/${pid}`} onClick={(e) => e.stopPropagation()}>
            {product.title}
          </Link>
        </h3>
        {hasRating && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <RatingStar filled={product.rating} size="3" />
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {product.rating}
              {product.reviews ? ` (${product.reviews > 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})` : ""}
            </span>
          </div>
        )}
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <p className="text-base sm:text-lg font-extrabold tracking-tight">
              {currency(product.price)}
            </p>
            {product.originalPrice != null && product.originalPrice !== product.price && (
              <p className="text-xs text-muted-foreground line-through">
                {currency(product.originalPrice)}
              </p>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={cn(
              "rounded-xl gap-1.5 transition-all",
              added && "bg-emerald-600 hover:bg-emerald-600"
            )}
          >
            {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
            {added ? "Added" : "Add"}
          </Button>
        </div>
      </CardContent>
      <style>{`@keyframes card-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
    </Card>
  );
}
