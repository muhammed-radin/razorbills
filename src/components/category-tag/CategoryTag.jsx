import { cn } from "@/lib/utils";
import React from "react";

export default function CategoryTag({ label, selected, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
        selected
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        className
      )}
    >
      {label}
    </button>
  );
}