'use client';

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card/ProductCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  X,
  CircleX
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import FilterSidebar from "./filters/filter-sidebar";

// Mock data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: "Wireless Headphones Premium",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 199.99,
    originalPrice: 249.99,
    image: "/products/Headphone.jpg",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    tags: ["wireless", "premium", "noise-cancelling"]
  },
  {
    id: 2,
    name: "Bluetooth Speaker Pro",
    category: "Speaker",
    description: "Portable Bluetooth speaker with deep bass and long battery life.",
    price: 89.99,
    originalPrice: 119.99,
    image: "/products/Speaker.webp",
    rating: 4.2,
    reviews: 95,
    inStock: true,
    tags: ["bluetooth", "portable", "waterproof"]
  },
  {
    id: 3,
    name: "Rechargeable Battery Pack 10000mAh",
    category: "Battery",
    description: "High-capacity power bank with fast charging support.",
    price: 39.99,
    originalPrice: 59.99,
    image: "/products/Battery.png",
    rating: 4.1,
    reviews: 203,
    inStock: true,
    tags: ["powerbank", "fast-charging", "portable"]
  },
  {
    id: 4,
    name: "RGB LED Light Strip 5m",
    category: "LED",
    description: "Smart RGB LED strip with app control and multiple effects.",
    price: 29.99,
    originalPrice: 39.99,
    image: "/products/LedStrip.webp",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    tags: ["rgb", "smart", "app-controlled"]
  },
  {
    id: 5,
    name: "Professional Microphone",
    category: "Microphone",
    description: "Studio-grade condenser microphone for recording.",
    price: 149.99,
    originalPrice: 199.99,
    image: "/products/Headphone.jpg", // placeholder
    rating: 4.7,
    reviews: 87,
    inStock: false,
    tags: ["studio", "condenser", "professional"]
  },
  {
    id: 6,
    name: "Arduino Compatible Board",
    category: "Microcontroller",
    description: "Open-source microcontroller board for electronics projects.",
    price: 24.99,
    originalPrice: 34.99,
    image: "/products/Battery.png", // placeholder
    rating: 4.6,
    reviews: 341,
    inStock: true,
    tags: ["arduino", "microcontroller", "diy"]
  },
  {
    id: 7,
    name: "Precision Resistor Set",
    category: "Resistor",
    description: "Complete set of precision resistors for electronic projects.",
    price: 19.99,
    originalPrice: 29.99,
    image: "/products/LedStrip.jpg", // placeholder
    rating: 4.3,
    reviews: 76,
    inStock: true,
    tags: ["precision", "electronic-components", "diy"]
  },
  {
    id: 8,
    name: "High-Brightness LED Diodes",
    category: "Diode",
    description: "Pack of high-efficiency LED diodes in various colors.",
    price: 12.99,
    originalPrice: 18.99,
    image: "/products/LedStrip.webp", // placeholder
    rating: 4.0,
    reviews: 45,
    inStock: true,
    tags: ["led", "high-brightness", "components"]
  }
];

const categories = [
  "All",
  "Electronics",
  "Speaker",
  "Battery",
  "LED",
  "Microphone",
  "Microcontroller",
  "Resistor",
  "Diode",
  "Transistor",
  "Fuse",
  "Potentiometer",
  "Crystal Oscillator",
  "Connector",
  "Sensor"
];

const sortOptions = [
  { value: "relevance", label: "Best Match" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest First" }
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [minRating, setMinRating] = useState(0);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize search query and category from URL parameters
  useEffect(() => {
    const queryFromUrl = searchParams.get("q") || "";
    const categoryFromUrl = searchParams.get("category") || "All";
    
    setSearchQuery(queryFromUrl);
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Text search
      const searchMatches = searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const categoryMatches = selectedCategory === "All" || product.category === selectedCategory;

      // Price range filter
      const priceMatches = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Rating filter
      const ratingMatches = product.rating >= minRating;

      // Stock filter
      const stockMatches = !showOnlyInStock || product.inStock;

      return searchMatches && categoryMatches && priceMatches && ratingMatches && stockMatches;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        // For demo, just reverse the order
        filtered.reverse();
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating, showOnlyInStock]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("relevance");
    setPriceRange([0, 300]);
    setMinRating(0);
    setShowOnlyInStock(false);
  };

  const activeFiltersCount = [
    selectedCategory !== "All",
    priceRange[0] > 0 || priceRange[1] < 300,
    minRating > 0,
    showOnlyInStock
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen p-3 sm:p-7 max-sm:p-4 max-sm:mt-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Search Products</h1>
          <p className="text-gray-600">Find the perfect electronic components and gadgets</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" size={20} />
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
            categories={categories} clearFilters={clearFilters}
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
                  {filteredAndSortedProducts.length} Products Found
                </h2>
                {searchQuery && (
                  <p className="text-gray-600">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-sm whitespace-nowrap">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={{
                      name: product.name,
                      category: product.category,
                      description: product.description,
                      price: product.price,
                      image: product.image
                    }}
                  />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-16">
                <div className="mb-4">
                  <Search size={64} className="mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
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
      </div>
    </div>
  );
}