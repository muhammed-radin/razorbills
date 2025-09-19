import { useState } from "react";
import CategoryTag from "./CategoryTag";
import React from "react";
import { cn } from "@/lib/utils";

export default function CategoryList(params) {
  const categories = params.items;

  const [active, setActive] = useState("All");
  return (
    <>
      <div className={cn("p-4 flex gap-3 flex-wrap", params.className)}>
        {categories.map((category) => (
          <CategoryTag
            key={category}
            label={category}
            selected={active === category}
            onClick={() => setActive(category)}
            className={params.tagClassName}
          />
        ))}
      </div>
    </>
  );
}