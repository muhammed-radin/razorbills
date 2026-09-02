import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import FilterContent from "./filter-content";
import { useTranslation } from "react-i18next";

function FilterSidebar({
  activeFiltersCount,
  clearFilters,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  showOnlyInStock,
  setShowOnlyInStock,
  showFilters,
  setShowFilters,
}) {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:w-80">
      <Card className="py-3 border-1 border-border max-lg:border-none shadow-none max-lg:bg-transparent">
        <CardHeader className="max-lg:px-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <SlidersHorizontal size={20} />
              {t("search.filters")}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>

            <Drawer
              open={showFilters}
              onOpenChange={setShowFilters}
              swipeDirection={"left"}
              showSwipeHandle={false}
            >
              <DrawerTrigger className="lg:hidden bg-background hover:bg-background/90 border border-border rounded-md px-2 py-1 flex flex-row justify-between items-center gap-3 text-sm">
                Show Filters <SlidersHorizontal size={16} />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <div className="flex items-center justify-between">
                    <DrawerTitle className="text-lg flex items-center gap-2">
                      <SlidersHorizontal size={20} />
                      {t("search.filters")}
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </DrawerTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-2 w-full"
                    >
                      <X size={16} className="mr-1" />
                      {t("search.clearAllFilters")}
                    </Button>
                  )}
                </DrawerHeader>
                <FilterContent
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  showOnlyInStock={showOnlyInStock}
                  setShowOnlyInStock={setShowOnlyInStock}
                />
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">{t("common.close")}</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-2 w-full"
            >
              <X size={16} className="mr-1" />
              {t("search.clearAllFilters")}
            </Button>
          )}
        </CardHeader>

        <CardContent
          className={`space-y-6 ${showFilters ? "hidden" : "hidden lg:block"} px-5 py-1`}
        >
          <FilterContent
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            showOnlyInStock={showOnlyInStock}
            setShowOnlyInStock={setShowOnlyInStock}
            className="px-0"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default FilterSidebar;
