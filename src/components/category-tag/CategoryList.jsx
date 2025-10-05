'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryTag from "./CategoryTag";
import React from "react";
import { cn } from "@/lib/utils";

export default function CategoryList(params) {
  const categories = params.items;
  const router = useRouter();

  const [active, setActive] = useState("All");
  
  const handleCategoryClick = (category) => {
    setActive(category);
    if (category === "All") {
      router.push("/search");
    } else {
      router.push(`/search?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <>
      <div className={cn("p-4 flex gap-3 flex-wrap", params.className)}>
        {categories.map((category) => (
          <CategoryTag
            key={category}
            label={category}
            selected={active === category}
            onClick={() => handleCategoryClick(category)}
            className={params.tagClassName}
          />
        ))}
      </div>
    </>
  );
}