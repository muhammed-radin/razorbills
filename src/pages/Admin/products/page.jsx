import { useState, useEffect, useRef, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import ListViewAdmin from "./components/list-view.admin";
import GridViewAdmin from "./components/grid-view.admin";
import AlertDeleteProductDialog from "./components/alert-delete.admin";
import { toast, Toaster } from "sonner";
import PaginationWithPrimaryButton from "@/components/customized/pagination/pagination-02";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statics, setStatics] = useState(false);
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [totalPages, setTotalPages] = useState(5);
  const { current: itemsPerPage } = useRef(10);

  const [currentPage, setCurrentPage] = useSearchParams();

  if (!currentPage.get("page")) {
    currentPage.set("page", "1");
  }

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
      const response = await api.client.get(api.products(), {
        page: currentPage.get("page"),
        realtime: "true",
      });

      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
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

  const handleDelete = (productId) => {
    setIsOpenDeleteConfirm(productId); // Open the confirmation dialog
  };

  const deleteProduct = async (productId) => {
    try {
      toast.promise(
        () =>
          new Promise((resolveui, rejectui) => {
            api.client
              .delete(api.products(productId))
              .then((response) => {
                if (response.status !== 200) {
                  rejectui(response.data);
                  return;
                }
                resolveui("Product deleted successfully");
                fetchProducts(); // Refresh the product list after deletion
              })
              .catch((error) => {
                rejectui(error);
                console.error("There was an error!", error);
              });
          }),
        {
          loading: "Deleting product...",
          success: "Product deleted successfully",
          error: "Error deleting product",
        },
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setIsOpenDeleteConfirm(false);
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
      {/* Toaster */}

      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Header */}
        <HeroHeader />

        {/* Stats Cards */}
        <StatsCards
          totalProducts={filteredProducts.length}
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
        ) : filteredProducts.length === 0 ? (
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
                  <Link to="/auth/admin/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <GridViewAdmin
            products={filteredProducts}
            handleDelete={handleDelete}
            getStockStatus={getStockStatus}
            formatCurrency={formatCurrency}
          />
        ) : (
          /* List View */
          <ListViewAdmin
            Badge={Badge}
            products={filteredProducts}
            handleDelete={handleDelete}
            getStockStatus={getStockStatus}
            formatCurrency={formatCurrency}
          />
        )}
      </div>

      {/* Pagination */}
      <PaginationWithPrimaryButton
        className="w-full"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(pageNum) => setCurrentPage({ page: pageNum })}
        setCurrentPage={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      <AlertDeleteProductDialog
        isOpen={isOpenDeleteConfirm}
        onClose={() => setIsOpenDeleteConfirm(false)}
        onConfirm={() => deleteProduct(isOpenDeleteConfirm)}
      />
    </div>
  );
}
