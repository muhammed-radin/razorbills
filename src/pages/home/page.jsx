import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import CategoryList from "@/components/category-tag/CategoryList";
import ProductCard from "@/components/product-card/ProductCard";
import { Hero } from "@/components/hero/hero";
import SearchBar from "@/components/searchBar/SearchBar";
import CarouselSlide from "@/components/carousel";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import ListHorizontalProductCards from "@/components/horizontal-card/list-horizontal-product-cards";
import axios from "axios";
import { LoaderScreen } from "@/components/LoaderScreen";
import { api } from "@/utils/api";


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Fetch products from the API
    axios.get(api.products())
      .then(response => {
        setProducts(response.data.products || response.data);
        setLoading(false);
      }
      )
      .catch(error => {
        console.error('Error fetching products:', error);
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
        <CategoryList items={[
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
        ]} className="w-[90%] sm:w-2/3 mx-auto max-sm:flex-row max-sm:flex-nowrap max-sm:justify-start max-sm:items-center max-sm:overflow-x-auto max-sm:p-0 whitespace-nowrap" tagClassName="max-sm:rounded-md" />


        <div className="mt-6 w-[calc(100%-24px)] mx-auto">
          {loading ? (
            <LoaderScreen />
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-6 mt-6">
                {products.map((product, index) => (
                  <ProductCard key={index} product={product} index={index} />
                ))}
              </div>
              <CarouselSlide />
              <br />
              <ListHorizontalProductCards />

              <br />
              <div className="flex flex-wrap justify-center gap-6 mt-6">
                {products.map((product, index) => (
                  <ProductCard key={index} product={product} index={index} />
                ))}
              </div>
              <br />
              <ListHorizontalProductCards />
            </>
          )}
        </div>
      </div>
    </div>
  );
}