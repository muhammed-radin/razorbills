import React from "react";
import { Button } from "@/components/ui/button";

import CategoryList from "@/components/category-tag/CategoryList";
import ProductCard from "@/components/product-card/ProductCard";
import { Hero1 } from "@/components/hero/hero1";
import SearchBar from "@/components/searchBar/SearchBar";
import CarouselSlide from "@/components/carousel-10";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import ListHorizontalProductCards from "@/components/horizontal-card/list-horizontal-product-cards";

const products = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    description: "High-quality sound and comfortable fit for all-day use.",
    price: 99.99,
    image: "/products/Headphone.jpg",
  },
  {
    name: "Bluetooth Speaker",
    category: "Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 49.99,
    image: "/products/Speaker.webp",
  },
  {
    name: "Rechargeable Battery Pack",
    category: "Battery",
    description: "Durable battery pack with fast charging support.",
    price: 19.99,
    image: "/products/Battery.png",
  },
  {
    name: "LED Light Strip",
    category: "LED",
    description: "Colorful LED strip for decoration and ambient lighting.",
    price: 14.99,
    image: "/products/LedStrip.webp",
  },
  {
    name: "Wireless Headphones",
    category: "Electronics",
    description: "High-quality sound and comfortable fit for all-day use.",
    price: 99.99,
    image: "/products/Headphone.jpg",
  },
  {
    name: "Bluetooth Speaker",
    category: "Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 49.99,
    image: "/products/Speaker.webp",
  },
  {
    name: "Rechargeable Battery Pack",
    category: "Battery",
    description: "Durable battery pack with fast charging support.",
    price: 19.99,
    image: "/products/Battery.png",
  },
  {
    name: "LED Light Strip",
    category: "LED",
    description: "Colorful LED strip for decoration and ambient lighting.",
    price: 14.99,
    image: "/products/LedStrip.webp",
  },
  {
    name: "Wireless Headphones",
    category: "Electronics",
    description: "High-quality sound and comfortable fit for all-day use.",
    price: 99.99,
    image: "/products/Headphone2.jpg",
  },
  {
    name: "Bluetooth Speaker",
    category: "Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 49.99,
    image: "/products/Speaker.webp",
  },
  {
    name: "Rechargeable Battery Pack",
    category: "Battery",
    description: "Durable battery pack with fast charging support.",
    price: 19.99,
    image: "/products/Battery.png",
  },
  {
    name: "LED Light Strip",
    category: "LED",
    description: "Colorful LED strip for decoration and ambient lighting.",
    price: 14.99,
    image: "/products/LedStrip.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
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
        className="w-full sm:w-[90%] lg:w-2/3 mx-auto overflow-x-auto" 
        tagClassName="text-xs sm:text-sm whitespace-nowrap" 
      />

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 max-w-7xl mx-auto">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </div>
      
      <div className="mt-8 sm:mt-12">
        <CarouselSlide />
      </div>
      
      <div className="mt-8 sm:mt-12">
        <ListHorizontalProductCards />
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8 max-w-7xl mx-auto">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </div>
      
      <div className="mt-8 sm:mt-12">
        <ListHorizontalProductCards />
      </div>
    </div>
  );
}