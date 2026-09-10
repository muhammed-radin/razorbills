import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-4 w-32 bg-neutral-200 dark:bg-neutral-900" />

        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 bg-neutral-200 dark:bg-neutral-900" />
          <Skeleton className="h-4 w-36 bg-neutral-200 dark:bg-neutral-900" />
        </div>

        {/* Stats Skeleton */}
        <Skeleton className="h-4 w-96 bg-neutral-200 dark:bg-neutral-900" />

        {/* Toolbar Skeleton */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-center">
          <Skeleton className="h-5 w-24 bg-neutral-200 dark:bg-neutral-900" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 bg-neutral-200 dark:bg-neutral-900" />
            <Skeleton className="h-8 w-32 bg-neutral-200 dark:bg-neutral-900" />
          </div>
        </div>

        {/* List Skeleton Items */}
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="py-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex justify-between items-center"
            >
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-4 w-4 bg-neutral-200 dark:bg-neutral-900 rounded" />
                <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 bg-neutral-200 dark:bg-neutral-900 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-20 bg-neutral-200 dark:bg-neutral-900" />
                  <Skeleton className="h-5 w-44 bg-neutral-200 dark:bg-neutral-900" />
                  <Skeleton className="h-3 w-60 bg-neutral-200 dark:bg-neutral-900" />
                  <Skeleton className="h-5 w-32 bg-neutral-200 dark:bg-neutral-900 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Skeleton className="h-6 w-16 bg-neutral-200 dark:bg-neutral-900" />
                <Skeleton className="h-8 w-28 bg-neutral-200 dark:bg-neutral-900 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishlistSkeleton;
