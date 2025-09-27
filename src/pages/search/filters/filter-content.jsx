import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

function FilterContent({ showFilters, categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, minRating, setMinRating, showOnlyInStock, setShowOnlyInStock, className }) {
    return (<div>
        <div className={cn(`space-y-6 px-6 ${showFilters ? 'block' : ' lg:block'}`, className)}>
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
                    dualThumb={true}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$300</span>
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
                <RadioGroup
                    value={minRating}
                    onValueChange={setMinRating}
                    className="space-y-2"
                >
                    {[4, 3, 2, 1, 0].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                            <RadioGroupItem value={rating} id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1">
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
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* In Stock Filter */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="in-stock"
                    checked={showOnlyInStock}
                    onCheckedChange={setShowOnlyInStock}
                />
                <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                    In Stock Only
                </Label>
            </div>
        </div>
    </div>);
}

export default FilterContent;