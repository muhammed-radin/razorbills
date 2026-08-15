import React, {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/product-card/ProductCard";
import { Search } from "lucide-react";
import FilterSidebar from "./filters/filter-sidebar";
import PaginationWithPrimaryButton from "@/components/customized/pagination/pagination-02";
import { api } from "@/utils/api";
import { create } from "zustand";
import { Preloader } from "@/components/LoaderScreen";

const sortOptions = [
  { value: "relevance", label: "Best Match" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest First" },
];

// migrating to zustand for state management
const useStore = create((set) => ({
  searchQuery: "",
  selectedCategory: null,
  sortBy: "relevance",
  priceRange: [0, 50000],
  minRating: 0,
  showOnlyInStock: false,
  showFilters: false,
  fixedPriceRange: [0, 50000],
  setShowFilters: (show) => set({ showFilters: show }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setPriceRange: (range) => set({ priceRange: range }),
  setMinRating: (rating) => set({ minRating: rating }),
  setShowOnlyInStock: (inStock) => set({ showOnlyInStock: inStock }),
  setFixedPriceRange: (range) => set({ fixedPriceRange: range }),
}));

export { useStore };

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(5); // For demo purposes, set a fixed total pages
  const [totalProducts, setTotalProducts] = useState(0);

  const {
    searchQuery,
    selectedCategory,
    sortBy,
    priceRange,
    minRating,
    showOnlyInStock,
    showFilters,
    fixedPriceRange,
    setShowFilters,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setPriceRange,
    setMinRating,
    setShowOnlyInStock,
    setFixedPriceRange,
  } = useStore();

  const deferedSearchQuery = useDeferredValue(searchQuery);
  const [preloaderEnabled, setPreloader] = useState(false);

  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState(
    [],
  );

  useEffect(() => {
    // if (deferedSearchQuery) {
    searchParams.set("q", deferedSearchQuery);
    setPreloader(true);

    let timeout = setTimeout(() => {
      setSearchParams(searchParams);

      api.client
        .get("/api/products", {
          search: deferedSearchQuery,
          params: {
            search: deferedSearchQuery,
            category: selectedCategory !== null ? selectedCategory : undefined,
            priceMin: priceRange[0],
            priceMax: priceRange[1],
            ratingMin: minRating,
            inStock: showOnlyInStock,
            sortBy:
              sortBy === "relevance"
                ? "createdAt"
                : sortBy === "name"
                  ? "title"
                  : sortBy === "newest"
                    ? "createdAt"
                    : sortBy === "price-low"
                      ? "price"
                      : sortBy === "price-high"
                        ? "price"
                        : sortBy === "rating"
                          ? "rating"
                          : undefined,
            sortOrder:
              sortBy === "price-low"
                ? "asc"
                : sortBy === "price-high"
                  ? "desc"
                  : sortBy === "rating"
                    ? "desc"
                    : sortBy === "name"
                      ? "desc"
                      : sortBy === "newest"
                        ? "desc"
                        : undefined,
            page: searchParams.get("page") || 1,
          },
        })
        .then((response) => {
          const fetched = response.data;
          setPreloader(false);
          setTotalPages(fetched.totalPages);
          setTotalProducts(fetched.count);
          // Update the products state with the fetched data
          setFilteredAndSortedProducts(fetched.products);
        });
    }, 1000);

    return () => clearTimeout(timeout);
    // }
  }, [
    deferedSearchQuery,
    selectedCategory,
    priceRange,
    minRating,
    showOnlyInStock,
    sortBy,
    searchParams,
  ]);

  const handlePageChange = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  // Initialize search query and category from URL parameters
  useEffect(() => {
    const queryFromUrl = searchParams.get("q") || "";
    const categoryFromUrl = searchParams.get("category");

    if (!searchParams.get("page")) {
      searchParams.set("page", "1");
      setSearchParams(searchParams);
    }

    setSearchQuery(queryFromUrl);
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    // load categories from API
    api.client.get("/api/categories?limit=100").then((response) => {
      const fetchedCategories = response.data;
      setCategories(fetchedCategories);
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortBy("relevance");
    setPriceRange([0, 50000]);
    setMinRating(0);
    setShowOnlyInStock(false);
  }, []);

  const activeFiltersCount = [
    selectedCategory !== null,
    priceRange[0] > 0 || priceRange[1] < 50000,
    minRating > 0,
    showOnlyInStock,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen p-3 sm:p-7 max-sm:p-4 max-sm:mt-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Search Products</h1>
          <p className="text-gray-600">
            Find the perfect electronic components and gadgets
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative w-full max-w-2xl">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search products, categories, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-base"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <FilterSidebar
            activeFiltersCount={activeFiltersCount}
            categories={categories}
            clearFilters={clearFilters}
            minRating={minRating}
            priceRange={priceRange}
            selectedCategory={selectedCategory}
            showOnlyInStock={showOnlyInStock}
            showFilters={showFilters}
            setMinRating={setMinRating}
            setPriceRange={setPriceRange}
            setSelectedCategory={setSelectedCategory}
            setShowFilters={setShowFilters}
            setShowOnlyInStock={setShowOnlyInStock}
          />

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {totalProducts} Products Found
                </h2>
                {searchQuery && (
                  <p className="text-gray-600">Results for "{searchQuery}"</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-sm whitespace-nowrap">
                  Sort by:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {preloaderEnabled ? (
              <div className="w-full h-1/2 flex justify-center items-center">
                <Preloader />
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-16">
                <div className="mb-4">
                  <Search size={64} className="mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* Pagination */}
        <div className="mt-6 sm:p-1">
          <PaginationWithPrimaryButton
            className="w-full"
            currentPage={searchParams}
            totalPages={totalPages}
            onPageChange={(pageNum) => handlePageChange(pageNum)}
          />
        </div>
      </div>
    </div>
  );
}
