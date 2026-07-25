import { cn } from "@/lib/utils";
import React from "react";

const CategoryTag = React.memo(function CategoryTag({ label, selected, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
        selected
          ? "bg-primary text-primary-foreground hover:brightness-120"
          : "bg-muted text-muted-foreground hover:brightness-90",
        className
      )}
    >
      {label}
    </button>
  );
});

export default CategoryTag;