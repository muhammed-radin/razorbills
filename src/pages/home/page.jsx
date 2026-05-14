import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import CategoryList from "@/components/category-tag/CategoryList";
import ProductCard from "@/components/product-card/ProductCard";
import { Hero } from "@/components/hero/hero";
import SearchBar from "@/components/searchBar/SearchBar";
import CarouselSlide from "@/components/carousel";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import ListHorizontalProductCards from "@/components/horizontal-card/list-horizontal-product-cards";
import FeaturedCarousel from "@/components/featured-carousel";
import HighlightedSlider from "@/components/highlighted-slider";
import ContentGrid from "@/components/content-grid";
import ModernCarousel from "@/components/modern-carousel";
import axios from "axios";
import { LoaderScreen } from "@/components/LoaderScreen";
import { api } from "@/utils/api";
import ClassicProcuctsSlider from "@/components/product-card/products-slider";

export default function HomePage() {
  const [latestProducts, setlatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Fetch products from the API
    api.client
      .get("/api/products/feed")
      .then((response) => {
        setlatestProducts(response.data.latest);
        setFeaturedProducts(response.data.featured);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      {/* <Hero /> */}

      {/* Main Content */}
      <div className="p-3 sm:p-3 w-full max-w-7xl mx-auto">
        <br />
        <SearchBar />
        <CategoryList
          items={[
            "All",
            "Resistor",
            "Diode",
            "LED",
            "Transistor",
            "Battery",
            "Fuse",
            "Potentiometer",
            "Speaker",
            "Microphone",
            "Crystal Oscillator",
            "Connector",
            "Sensor",
            "Microcontroller",
          ]}
          className="w-[90%] sm:w-2/3 mx-auto max-sm:flex-row max-sm:flex-nowrap max-sm:justify-start max-sm:items-center max-sm:overflow-x-auto max-sm:p-0 whitespace-nowrap"
          tagClassName="max-sm:rounded-md"
        />
      </div>

      <div className="w-full">
        {loading ? (
          <LoaderScreen />
        ) : (
          <>
            {/* Highlighted Image Slider - Full Width Hero Style */}
            <HighlightedSlider className="" />

            {/* Featured Products Carousel - Premium Cards */}
            <FeaturedCarousel
              title="Featured Collection"
              products={latestProducts.slice(0, 5)} // Show first 5 products as featured
            />

            {/* Content Grid - Categories & Offers */}
            <ContentGrid title="Explore Categories" />

            {/* New Arrivals - Regular Carousel Design */}
            <CarouselSlide
              title="New Arrivals"
              variant="new-arrivals"
              products={latestProducts}
            />

            {/* Product Grid */}
            <div className="max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto py-6 sm:py-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-2">
                All Products
              </h2>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                {latestProducts.map((product, index) => (
                  <ProductCard key={index} product={product} index={index} />
                ))}
              </div>
            </div>

            {/* Another Featured Carousel with Different Title */}
            <FeaturedCarousel
              title="Best Sellers"
              products={latestProducts.slice(0, 5)}
            />

            {/* Horizontal Product Cards */}
            <ListHorizontalProductCards products={latestProducts} />

            {/* Top Rated - Modern Carousel Design */}
            <ModernCarousel
              title="Top Rated"
              variant="top-rated"
              products={latestProducts}
            />

            {/* Regular Carousel - Trending */}
            <CarouselSlide title="Trending Now" products={latestProducts} />

            {/* Second Product Grid */}
            <ClassicProcuctsSlider
              title="Recomended For You"
              products={latestProducts.slice(0, 10)} // Show first 10 products as recommended
            />

            {/* More Horizontal Cards */}
            <ListHorizontalProductCards products={latestProducts} />
          </>
        )}
      </div>
    </div>
  );
}
