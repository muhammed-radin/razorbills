import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, TrendingUp } from "lucide-react";
import { useEffect } from "react";

function StatsCards({
  totalProducts,
  lowStockCount,
  outOfStockCount,
  inStockCount,
  isLoading,
}) {
  return isLoading ? (
    <div className="grid gap-6 md:grid-cols-4">
      <Skeleton className="h-32 rounded-xl bg-secondary" />
      <Skeleton className="h-32 rounded-xl bg-secondary" />
      <Skeleton className="h-32 rounded-xl bg-secondary" />
      <Skeleton className="h-32 rounded-xl bg-secondary" />
    </div>
  ) : (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Products
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-7xl font-bold text-primary">
            {parseInt(totalProducts).toLocaleString().padStart(2, "0")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total inventory items
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            In Stock
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-7xl font-bold text-primary">
            {parseInt(inStockCount).toLocaleString().padStart(2, "0")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Products available
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Low Stock
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertCircle className="h-5 w-5 text-accent-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-7xl font-bold text-accent-foreground">
            {parseInt(lowStockCount).toLocaleString().padStart(2, "0")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Need restocking</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Out of Stock
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-7xl font-bold text-destructive">
            {parseInt(outOfStockCount).toLocaleString().padStart(2, "0")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Requires attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsCards;
