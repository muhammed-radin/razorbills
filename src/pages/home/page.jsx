import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import CategoryList from "@/components/category-tag/CategoryList";
import ProductCard from "@/components/product-card/ProductCard";
import { Hero1 } from "@/components/hero/hero1";
import SearchBar from "@/components/searchBar/SearchBar";
import CarouselSlide from "@/components/carousel-10";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import ListHorizontalProductCards from "@/components/horizontal-card/list-horizontal-product-cards";
import axios from "axios";
import { LoaderScreen } from "@/components/LoaderScreen";

// const products = [
//   {
//     name: "Wireless Headphones",
//     category: "Electronics",
//     description: "High-quality sound and comfortable fit for all-day use.",
//     price: 99.99,
//     image: "/products/Headphone.jpg",
//   },
//   {
//     name: "Bluetooth Speaker",
//     category: "Speaker",
//     description: "Portable speaker with deep bass and long battery life.",
//     price: 49.99,
//     image: "/products/Speaker.webp",
//   },
//   {
//     name: "Rechargeable Battery Pack",
//     category: "Battery",
//     description: "Durable battery pack with fast charging support.",
//     price: 19.99,
//     image: "/products/Battery.png",
//   },
//   {
//     name: "LED Light Strip",
//     category: "LED",
//     description: "Colorful LED strip for decoration and ambient lighting.",
//     price: 14.99,
//     image: "/products/LedStrip.webp",
//   },
//   {
//     name: "Wireless Headphones",
//     category: "Electronics",
//     description: "High-quality sound and comfortable fit for all-day use.",
//     price: 99.99,
//     image: "/products/Headphone.jpg",
//   },
//   {
//     name: "Bluetooth Speaker",
//     category: "Speaker",
//     description: "Portable speaker with deep bass and long battery life.",
//     price: 49.99,
//     image: "/products/Speaker.webp",
//   },
//   {
//     name: "Rechargeable Battery Pack",
//     category: "Battery",
//     description: "Durable battery pack with fast charging support.",
//     price: 19.99,
//     image: "/products/Battery.png",
//   },
//   {
//     name: "LED Light Strip",
//     category: "LED",
//     description: "Colorful LED strip for decoration and ambient lighting.",
//     price: 14.99,
//     image: "/products/LedStrip.webp",
//   },
//   {
//     name: "Wireless Headphones",
//     category: "Electronics",
//     description: "High-quality sound and comfortable fit for all-day use.",
//     price: 99.99,
//     image: "/products/Headphone2.jpg",
//   },
//   {
//     name: "Bluetooth Speaker",
//     category: "Speaker",
//     description: "Portable speaker with deep bass and long battery life.",
//     price: 49.99,
//     image: "/products/Speaker.webp",
//   },
//   {
//     name: "Rechargeable Battery Pack",
//     category: "Battery",
//     description: "Durable battery pack with fast charging support.",
//     price: 19.99,
//     image: "/products/Battery.png",
//   },
//   {
//     name: "LED Light Strip",
//     category: "LED",
//     description: "Colorful LED strip for decoration and ambient lighting.",
//     price: 14.99,
//     image: "/products/LedStrip.jpg",
//   },
// ];

export default function HomePage() {
  const [products, setProducts] = useState([]);

  React.useEffect(() => {
    // Fetch products from the API
    axios.get('https://dummyjson.com/products/category/smartphones?limit=100')
      .then(response => {
        console.log(response);

        setProducts(response.data.products);
      }
      )
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  if (products.length === 0) {
    return <LoaderScreen />
  }

  return (
    <div className=" min-h-screen p-3 sm:p-3 w-full max-w-7xl mx-auto">
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


      <div className="mt-6 w-full">
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
      </div>

    </div>
  );
}