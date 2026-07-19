import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/utils/api";
import axios from "axios";
import { currency as formatCurrency } from "@/utils/currency";

// components
import HeroHeader from "./components/hero-header.admin";
import SearchFilters from "./components/search-filters.products.admin";
import { Preloader } from "@/components/LoaderScreen";
import StatsCards from "./components/stats-cards.admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statics, setStatics] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    fetchProducts();
    fetchProductStatics();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.client.get(api.products());

      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStatics = async () => {
    try {
      const response = await api.client.get(api.products("status"));
      setStatics(response.data);
    } catch (error) {
      console.error("Error fetching product statics:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(api.products(productId));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        variant: "destructive",
        color: "bg-destructive",
      };
    } else if (stock < 10) {
      return { label: "Low Stock", variant: "secondary", color: "bg-accent" };
    } else {
      return { label: "In Stock", variant: "default", color: "bg-primary" };
    }
  };

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock < 10,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const inStockCount = products.filter((p) => p.stock >= 10).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Header */}
        <HeroHeader />

        {/* Stats Cards */}
        <StatsCards
          totalProducts={products.length}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
          inStockCount={inStockCount}
          isLoading={!statics}
        />

        {/* Search and Filter Bar */}
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Products Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Preloader />
              <p className="text-muted-foreground font-medium">
                Loading products...
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-sm">
                {searchQuery
                  ? "Try adjusting your search query to find what you're looking for"
                  : "Get started by adding your first product to the inventory"}
              </p>
              {!searchQuery && (
                <Button asChild className="mt-6">
                  <Link to="/admin/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-destructive text-destructive-foreground border-0 shadow-lg">
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100,
                          )}
                          % OFF
                        </Badge>
                      </div>
                    )}
                    {/* Stock Status Indicator */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`h-3 w-3 rounded-full ${stockStatus.color} ring-2 ring-background shadow-lg`}
                      ></div>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shadow-lg"
                          asChild
                        >
                          <Link to={`/product/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shadow-lg"
                          asChild
                        >
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="shadow-lg"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {product.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {product.sku}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                    <div className="flex items-end justify-between pt-2 border-t">
                      <div>
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(product.price)}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${stockStatus.color}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {product.stock}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {stockStatus.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List View */
          <Card className="overflow-hidden">
            <div className="divide-y">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-6 p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{product.brand}</span>
                        <span className="font-mono">{product.sku}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(product.price)}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${stockStatus.color}`}
                      ></div>
                      <div className="text-right">
                        <div className="font-medium">{product.stock}</div>
                        <div className="text-xs text-muted-foreground">
                          {stockStatus.label}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/product/${product.id}`}
                            className="flex items-center"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
