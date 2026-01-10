import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { limitWords } from "@/utils/string"
import { Heart, ShoppingCart, Eye, Star, ImageOff } from "lucide-react"

export function HorizontalProductCard({ 
    variant, 
    className, 
    product = null,
    index = 0 
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Staggered animation on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 80);
        return () => clearTimeout(timer);
    }, [index]);

    // Default product data if not provided
    const productData = product?.[0] || product || {
        title: "Premium Wireless Headphones",
        description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation.",
        price: 99.99,
        originalPrice: 149.99,
        image: "/products/Headphone.jpg",
        rating: 4.5,
        reviews: 128
    };

    const discountPercentage = productData.originalPrice && productData.originalPrice !== productData.price
        ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
        : 0;

    let variantStyle = '';
    if (variant === 'borderless') {
        variantStyle = 'border-0 shadow-none bg-transparent';
    }

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        console.log('Add to cart:', productData.title);
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        console.log('Quick view:', productData.title);
    };

    return (
        <Card 
            className={cn(
                // Base styles
                "relative flex flex-row items-stretch overflow-hidden cursor-pointer group",
                // Sizing - responsive
                "w-full sm:w-[380px] md:w-[420px] lg:w-[450px]",
                "min-w-[280px] max-w-full",
                "h-auto min-h-[140px]",
                // Spacing
                "p-0 gap-0",
                // Border & shadow
                "rounded-xl border border-border/50",
                "shadow-sm hover:shadow-xl",
                // Background
                "bg-card/80 backdrop-blur-sm",
                // Transitions
                "transition-all duration-500 ease-out",
                // Hover effects
                "hover:border-primary/30",
                "hover:-translate-y-1",
                // Animation
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                variantStyle, 
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative w-[120px] sm:w-[140px] md:w-[160px] flex-shrink-0 overflow-hidden">
                {/* Image */}
                <img 
                    src={productData.image || productData.thumbnail || "/products/Headphone.jpg"} 
                    alt={productData.title}
                    onError={() => setImageError(true)}
                    className={cn(
                        "w-full h-full object-cover bg-muted",
                        "transition-all duration-700 ease-out",
                        "group-hover:scale-110 group-hover:rotate-1",
                        { 'hidden': imageError }
                    )}
                />
                
                {/* Image Error State */}
                {imageError && (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageOff className="w-8 h-8 text-muted-foreground" />
                    </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20",
                    "transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                )} />

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                        <div className={cn(
                            "bg-gradient-to-r from-red-500 to-pink-500",
                            "text-white text-[10px] sm:text-xs font-bold",
                            "px-2 py-0.5 rounded-full",
                            "shadow-lg shadow-red-500/25",
                            "animate-pulse"
                        )}>
                            -{discountPercentage}%
                        </div>
                    </div>
                )}

                {/* Quick View Button - Appears on Hover */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "transition-all duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                )}>
                    <button
                        onClick={handleQuickView}
                        className={cn(
                            "p-2.5 rounded-full",
                            "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
                            "shadow-lg border border-white/20",
                            "transition-all duration-300",
                            "hover:scale-110 hover:bg-white dark:hover:bg-gray-800",
                            isHovered ? "scale-100" : "scale-75"
                        )}
                    >
                        <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                </div>

                {/* Bottom Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className={cn(
                        "h-full bg-gradient-to-r from-primary via-primary to-accent",
                        "transition-all duration-500 ease-out",
                        isHovered ? "w-full" : "w-0"
                    )} />
                </div>
            </div>

            {/* Content Container */}
            <CardContent className="flex-1 flex flex-col justify-between p-3 sm:p-4 gap-2 min-w-0">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <CardTitle className={cn(
                            "text-sm sm:text-base font-semibold leading-tight",
                            "line-clamp-1",
                            "transition-colors duration-300",
                            "group-hover:text-primary"
                        )}>
                            {productData.title}
                        </CardTitle>
                        
                        {/* Rating */}
                        {productData.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-3 h-3",
                                                i < Math.floor(productData.rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : i < productData.rating
                                                    ? "fill-amber-400/50 text-amber-400"
                                                    : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    ({productData.reviews || 0})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteClick}
                        className={cn(
                            "p-1.5 sm:p-2 rounded-full flex-shrink-0",
                            "bg-muted/50 hover:bg-muted",
                            "transition-all duration-300",
                            "hover:scale-110",
                            isFavorite && "bg-red-50 dark:bg-red-950/30"
                        )}
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4 transition-all duration-300",
                                isFavorite 
                                    ? "fill-red-500 text-red-500 scale-110" 
                                    : "text-muted-foreground hover:text-red-400"
                            )}
                        />
                    </button>
                </div>

                {/* Description */}
                <CardDescription className={cn(
                    "text-xs sm:text-sm line-clamp-2 leading-relaxed",
                    "transition-opacity duration-300"
                )}>
                    {limitWords(productData.description || "Premium quality product with exceptional features.", 12)}
                </CardDescription>

                {/* Footer Row - Price & Actions */}
                <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                    {/* Price Section */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className={cn(
                                "text-base sm:text-lg font-bold",
                                "text-green-600 dark:text-green-400",
                                "transition-transform duration-300",
                                isHovered ? "scale-105" : "scale-100"
                            )}>
                                ${productData.price}
                            </span>
                            {productData.originalPrice && productData.originalPrice !== productData.price && (
                                <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                    ${productData.originalPrice}
                                </span>
                            )}
                        </div>
                        {discountPercentage > 0 && (
                            <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                                Save ${(productData.originalPrice - productData.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className={cn(
                            "gap-1.5 px-3 sm:px-4 h-8 sm:h-9",
                            "bg-gradient-to-r from-primary to-primary/90",
                            "hover:from-primary/90 hover:to-primary",
                            "shadow-md hover:shadow-lg",
                            "transition-all duration-300",
                            "hover:scale-105"
                        )}
                    >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline text-xs font-medium">Add</span>
                    </Button>
                </div>
            </CardContent>

            {/* Hover Glow Effect */}
            <div className={cn(
                "absolute inset-0 rounded-xl pointer-events-none",
                "bg-gradient-to-r from-primary/0 via-primary/5 to-accent/10",
                "transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0"
            )} />
        </Card>
    )
}

export default HorizontalProductCard;