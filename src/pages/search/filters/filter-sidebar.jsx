import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter, SlidersHorizontal, X, Star } from 'lucide-react';
import FilterContent from './filter-content';



function FilterSidebar({ activeFiltersCount, clearFilters, categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, minRating, setMinRating, showOnlyInStock, setShowOnlyInStock, showFilters, setShowFilters }) {
    return (
        <div className="w-full lg:w-80">
            <Card className="py-3 border-none shadow-none lg:border lg:shadow-sm">
                <CardHeader className="px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                            <Filter size={18} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </CardTitle>

                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button variant="outline" size="sm" className="lg:hidden">
                                    <SlidersHorizontal size={16} />
                                    <span className="ml-2">Filter</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <div className="flex items-center justify-between">
                                        <DrawerTitle className="text-lg flex items-center gap-2">
                                            <SlidersHorizontal size={20} />
                                            Filters
                                            {activeFiltersCount > 0 && (
                                                <Badge variant="secondary" className="ml-2 text-xs">
                                                    {activeFiltersCount}
                                                </Badge>
                                            )}
                                        </DrawerTitle>
                                    </div>
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="mt-2 w-full"
                                        >
                                            <X size={16} className="mr-1" />
                                            Clear All Filters
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
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full">Close</Button>
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
                            className="mt-2 w-full hidden lg:flex"
                        >
                            <X size={16} className="mr-1" />
                            Clear All Filters
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="hidden lg:block px-4">
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