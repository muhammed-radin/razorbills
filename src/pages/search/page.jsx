import React, { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product-card/ProductCard";
import { cn } from "@/lib/utils";

// Extended product data with more realistic electronics products
const allProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    description: "High-quality sound and comfortable fit for all-day use.",
    price: 99.99,
    rating: 4.5,
    brand: "AudioTech",
    image: "/products/Headphone.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Portable Bluetooth Speaker",
    category: "Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 49.99,
    rating: 4.2,
    brand: "SoundWave",
    image: "/products/Speaker.webp",
    inStock: true,
  },
  {
    id: 3,
    name: "Rechargeable Li-ion Battery Pack",
    category: "Battery",
    description: "Durable battery pack with fast charging support.",
    price: 19.99,
    rating: 4.0,
    brand: "PowerCell",
    image: "/products/Battery.png",
    inStock: true,
  },
  {
    id: 4,
    name: "RGB LED Light Strip",
    category: "LED",
    description: "Colorful LED strip for decoration and ambient lighting.",
    price: 14.99,
    rating: 4.3,
    brand: "LightMax",
    image: "/products/LedStrip.webp",
    inStock: true,
  },
  {
    id: 5,
    name: "Carbon Film Resistor 1K Ohm",
    category: "Resistor",
    description: "High precision carbon film resistor for electronic circuits.",
    price: 0.99,
    rating: 4.1,
    brand: "ElectroComps",
    image: "/products/Resistor.jpg",
    inStock: true,
  },
  {
    id: 6,
    name: "Silicon Diode 1N4007",
    category: "Diode",
    description: "Standard silicon diode for rectification circuits.",
    price: 0.25,
    rating: 4.4,
    brand: "SemiTech",
    image: "/products/Diode.jpg",
    inStock: true,
  },
  {
    id: 7,
    name: "NPN Transistor BC547",
    category: "Transistor",
    description: "General purpose NPN transistor for switching and amplification.",
    price: 0.15,
    rating: 4.2,
    brand: "SemiTech",
    image: "/products/Transistor.jpg",
    inStock: true,
  },
  {
    id: 8,
    name: "Fast Blow Fuse 5A",
    category: "Fuse",
    description: "Fast acting glass fuse for circuit protection.",
    price: 1.50,
    rating: 4.0,
    brand: "SafeGuard",
    image: "/products/Fuse.jpg",
    inStock: false,
  },
  {
    id: 9,
    name: "Linear Potentiometer 10K",
    category: "Potentiometer",
    description: "Variable resistor for voltage control applications.",
    price: 2.99,
    rating: 4.3,
    brand: "VarTech",
    image: "/products/Potentiometer.jpg",
    inStock: true,
  },
  {
    id: 10,
    name: "Condenser Microphone",
    category: "Microphone",
    description: "High sensitivity condenser microphone for audio recording.",
    price: 75.99,
    rating: 4.6,
    brand: "AudioPro",
    image: "/products/Microphone.jpg",
    inStock: true,
  },
  {
    id: 11,
    name: "Crystal Oscillator 16MHz",
    category: "Crystal Oscillator",
    description: "Precision crystal oscillator for microcontroller circuits.",
    price: 3.50,
    rating: 4.5,
    brand: "FreqTech",
    image: "/products/Crystal.jpg",
    inStock: true,
  },
  {
    id: 12,
    name: "USB-C Connector",
    category: "Connector",
    description: "High-speed USB Type-C connector for data and power.",
    price: 4.99,
    rating: 4.1,
    brand: "ConnectMax",
    image: "/products/Connector.jpg",
    inStock: true,
  },
  {
    id: 13,
    name: "Temperature Sensor DS18B20",
    category: "Sensor",
    description: "Digital temperature sensor with high accuracy.",
    price: 8.99,
    rating: 4.4,
    brand: "SensorTech",
    image: "/products/Sensor.jpg",
    inStock: true,
  },
  {
    id: 14,
    name: "Arduino Uno R3 Compatible",
    category: "Microcontroller",
    description: "Arduino Uno compatible microcontroller board.",
    price: 24.99,
    rating: 4.7,
    brand: "MicroDev",
    image: "/products/Arduino.jpg",
    inStock: true,
  },
];

const categories = [
  "All",
  "Electronics",
  "Speaker", 
  "Battery",
  "LED",
  "Resistor",
  "Diode",
  "Transistor",
  "Fuse",
  "Potentiometer",
  "Microphone",
  "Crystal Oscillator",
  "Connector",
  "Sensor",
  "Microcontroller",
];

const brands = ["All", "AudioTech", "SoundWave", "PowerCell", "LightMax", "ElectroComps", "SemiTech", "SafeGuard", "VarTech", "AudioPro", "FreqTech", "ConnectMax", "SensorTech", "MicroDev"];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "name", label: "Name A-Z" },
];

export default function ProductSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [selectedBrands, setSelectedBrands] = useState(["All"]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      // Search term filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.includes("All") || 
        selectedCategories.includes(product.category);

      // Brand filter
      const matchesBrand = selectedBrands.includes("All") || 
        selectedBrands.includes(product.brand);

      // Price range filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Rating filter
      const matchesRating = product.rating >= minRating;

      // Stock filter
      const matchesStock = !showInStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock;
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
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategories, selectedBrands, priceRange, minRating, showInStockOnly, sortBy]);

  const handleCategoryChange = (category, checked) => {
    if (category === "All") {
      setSelectedCategories(checked ? ["All"] : []);
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.filter(cat => cat !== "All");
        if (checked) {
          return [...newCategories, category];
        } else {
          return newCategories.filter(cat => cat !== category);
        }
      });
    }
  };

  const handleBrandChange = (brand, checked) => {
    if (brand === "All") {
      setSelectedBrands(checked ? ["All"] : []);
    } else {
      setSelectedBrands(prev => {
        const newBrands = prev.filter(br => br !== "All");
        if (checked) {
          return [...newBrands, brand];
        } else {
          return newBrands.filter(br => br !== brand);
        }
      });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories(["All"]);
    setSelectedBrands(["All"]);
    setPriceRange([0, 100]);
    setMinRating(0);
    setShowInStockOnly(false);
    setSortBy("relevance");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked)}
              />
              <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-3">
          <Slider
            value={[minRating]}
            onValueChange={(value) => setMinRating(value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            {minRating} stars & up
          </div>
        </div>
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={showInStockOnly}
          onCheckedChange={setShowInStockOnly}
        />
        <label htmlFor="in-stock" className="text-sm cursor-pointer">
          In Stock Only
        </label>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearAllFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Product Search</h1>
          <p className="text-muted-foreground">Find the perfect electronics for your needs</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for products, categories, or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="h-5 w-5" />
                  <h2 className="font-semibold">Filters</h2>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-sm text-muted-foreground">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div 
                className={cn(
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                )}
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className={viewMode === "list" ? "w-full" : ""}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}