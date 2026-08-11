import { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryTag from "./CategoryTag";
import React from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { api } from "@/utils/api";
import { Skeleton } from "../ui/skeleton";
import { Grid2X2, Grid2X2Check } from "lucide-react";

export default function CategoryList(params) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const AllCategory = {
    id: "all",
    name: "All",
    icon: "grid",
    description: "All Categories",
  };

  const fetchCategories = async () => {
    if (loading == false) setLoading(true);
    try {
      const response = await api.client.get("/api/categories?limit=20");
      const fetchedCategories = response.data;
      setCategories([AllCategory, ...fetchedCategories]);
      console.log("Fetched categories:", fetchedCategories); // Log the fetched categories
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const navigate = useNavigate();

  const [active, setActive] = useState("All");

  const handleCategoryClick = (category) => {
    setActive(category);
    if (category === "All") {
      navigate("/search");
    } else {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <>
      <div className={cn("p-4 flex gap-3 flex-wrap", params.className)}>
        {loading ? (
          <>
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-18 rounded-md" />
            <Skeleton className="h-8 w-23 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-26 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-12 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </>
        ) : (
          categories.map((category) => (
            <CategoryTag
              key={category.id}
              label={
                category.name === "All" ? (
                  <Link to={`/search?categories=all`}>All</Link>
                ) : (
                  <Link to={`/search?category=${category.name}`}>
                    {category.name}
                  </Link>
                )
              } // Use Link component with the correct route category.name}
              selected={active === category.name}
              className={params.tagClassName}
            />
          ))
        )}
      </div>
    </>
  );
}
