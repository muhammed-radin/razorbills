import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter, SlidersHorizontal, X, Star } from 'lucide-react';



function FilterSidebar({ activeFiltersCount, clearFilters, categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, minRating, setMinRating, showOnlyInStock, setShowOnlyInStock, showFilters, setShowFilters }) {
    return (<div className="w-full lg:w-80">
        <Card className="py-3 border-none shadow-none max-sm:bg-transparent">
            <CardHeader className="max-sm:px-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter size={20} />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </CardTitle>

                    <Drawer>
                        <DrawerTrigger className="lg:hidden"><SlidersHorizontal size={16} /></DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <div className="flex items-center justify-between">
                                    <DrawerTitle className="text-lg flex items-center gap-2">
                                        <SlidersHorizontal size={20} />
                                        Filters
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
                                        Clear All Filters
                                    </Button>
                                )}
                            </DrawerHeader>
                            <div>
                                <div className={`space-y-6 px-6 ${showFilters ? 'block' : ' lg:block'}`}>
                                    {/* Category Filter */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Category</Label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price Range Filter */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">
                                            Price Range: ${priceRange[0]} - ${priceRange[1]}
                                        </Label>
                                        <Slider
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            max={300}
                                            min={0}
                                            step={10}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>$0</span>
                                            <span>$300</span>
                                        </div>
                                    </div>

                                    {/* Rating Filter */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
                                        <div className="space-y-2">
                                            {[4, 3, 2, 1, 0].map(rating => (
                                                <div key={rating} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id={`rating-${rating}`}
                                                        name="rating"
                                                        checked={minRating === rating}
                                                        onChange={() => setMinRating(rating)}
                                                        className="w-4 h-4"
                                                    />
                                                    <label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star
                                                                    key={star}
                                                                    size={16}
                                                                    className={star <= (rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm">{rating === 0 ? "All Ratings" : `${rating}+ Stars`}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Filter */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="in-stock"
                                            checked={showOnlyInStock}
                                            onChange={(e) => setShowOnlyInStock(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="in-stock" className="text-sm cursor-pointer">
                                            In Stock Only
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <DrawerFooter>
                                <DrawerClose>
                                    <Button variant="outline">Close</Button>
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
                        Clear All Filters
                    </Button>
                )}
            </CardHeader>

            <CardContent className={`space-y-6 ${showFilters ? 'hidden' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </Label>
                    <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={300}
                        min={0}
                        step={10}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>$0</span>
                        <span>$300</span>
                    </div>
                </div>

                {/* Rating Filter */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
                    <div className="space-y-2">
                        {[4, 3, 2, 1, 0].map(rating => (
                            <div key={rating} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`rating-${rating}`}
                                    name="rating"
                                    checked={minRating === rating}
                                    onChange={() => setMinRating(rating)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={star <= (rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm">{rating === 0 ? "All Ratings" : `${rating}+ Stars`}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="in-stock"
                        checked={showOnlyInStock}
                        onChange={(e) => setShowOnlyInStock(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label htmlFor="in-stock" className="text-sm cursor-pointer">
                        In Stock Only
                    </label>
                </div>
            </CardContent>
        </Card>

    </div>);
}

export default FilterSidebar;