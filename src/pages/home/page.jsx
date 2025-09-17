import React from "react";
import { Button } from "@/components/ui/button";

import CategoryList from "@/components/category-tag/CategoryList";
import ProductCard from "@/components/product-card/ProductCard";
import { Hero1 } from "@/components/hero/hero1";
import SearchBar from "@/components/searchBar/SearchBar";
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
    <div className=" min-h-screen  p-3 sm:p-7">
      <br />
      <SearchBar />
      

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}