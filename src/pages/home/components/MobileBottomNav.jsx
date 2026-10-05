import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/shop";
import { Badge } from "@/components/ui/badge";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const count = useCartStore((s) => s.items.reduce((a, i) => a + (i.quantity || 1), 0));

  const items = [
    { id: "home", label: "Home", icon: Home, to: "/", active: pathname === "/" },
    { id: "categories", label: "Categories", icon: LayoutGrid, to: "/categories", active: pathname.startsWith("/categories") },
    { id: "search", label: "Search", icon: Search, to: "/search", active: pathname.startsWith("/search") },
    { id: "cart", label: "Cart", icon: ShoppingCart, to: "/cart", active: pathname.startsWith("/cart"), badge: count },
    { id: "account", label: "Account", icon: User, to: "/settings", active: pathname.startsWith("/settings") || pathname.startsWith("/order") || pathname.startsWith("/wishlist") },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 px-1 pt-1.5 pb-2">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => navigate(it.to)}
            className="group relative flex flex-col items-center gap-0.5 py-1.5 rounded-2xl active:scale-95 transition-transform"
          >
            <span
              className={cn(
                "relative grid place-items-center rounded-full px-5 py-1 transition-all duration-300",
                it.active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground group-active:bg-muted"
              )}
            >
              <it.icon className={cn("size-5 transition-transform duration-300", it.active && "scale-105")} />
              {!!it.badge && (
                <Badge className="absolute -top-1.5 -right-1 size-5 p-0 grid place-items-center text-[10px] rounded-full border-2 border-background">
                  {it.badge > 9 ? "9+" : it.badge}
                </Badge>
              )}
            </span>
            <span className={cn("text-[10px] font-semibold", it.active ? "text-foreground" : "text-muted-foreground")}>
              {it.label}
            </span>
            <span
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                it.active ? "w-5 bg-primary" : "w-0 bg-transparent"
              )}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

// Re-export a no-op for desktop safety
export function DesktopSpacer() {
  return <div className="h-[76px] md:hidden" />;
}
