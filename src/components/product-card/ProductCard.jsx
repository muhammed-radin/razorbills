
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Preloader } from "../LoaderScreen";
import { ImageIcon, ImageOff, Heart, Eye, ShoppingCart } from "lucide-react";

const ProductCard = ({ product, index }) => {
    const navigate = useNavigate();
    const [imageLoaded, setLoadedState] = useState(false);
    const [imageErr, setImageErr] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Staggered animation on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    const handleProductClick = () => {
        const productId = product.id;
        navigate(`/product/${productId}`);
    };

    function onImageLoad() {
        setLoadedState(true);
    }

    function onImageError() {
        setImageErr(true);
    }

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        // Quick view functionality can be implemented here
        console.log('Quick view:', product.id);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        // Add to cart functionality can be implemented here
        console.log('Add to cart:', product.id);
    };

    // Calculate discount percentage
    const discountPercentage = product.originalPrice && product.originalPrice !== product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Calculate savings amount
    const savingsAmount = product.originalPrice && product.originalPrice !== product.price
        ? (product.originalPrice - product.price).toFixed(2)
        : 0;

    return (
        <Card
            className={cn(
                "w-35 sm:w-45 h-55 border shadow-none border-none rounded-none p-0 bg-transparent gap-3 cursor-pointer group relative",
                "transition-all duration-[600ms] ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            onClick={handleProductClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardHeader className="h-40 border-1 max-sm:border-2 rounded-2xl p-0 m-0 overflow-hidden bg-center relative">
                {/* Image */}
                <img
                    src={product.image || product.thumbnail}
                    alt={product.title}
                    className={cn(
                        "w-full h-40 object-cover bg-background transition-all duration-500 ease-out",
                        "group-hover:scale-110 group-hover:rotate-1",
                        { 'hidden': (!imageLoaded || imageErr) }
                    )}
                    onLoad={onImageLoad}
                    onError={onImageError}
                />
                
                {/* Loading State */}
                <div className={cn(
                    "w-full h-40 bg-background flex items-center justify-center",
                    { 'hidden': (imageLoaded || imageErr) }
                )}>
                    <Preloader />
                </div>
                
                {/* Error State */}
                <div className={cn(
                    "w-full h-40 bg-background flex items-center justify-center",
                    { 'hidden': (imageLoaded || !imageErr) }
                )}>
                    <ImageOff />
                </div>

                {/* Gradient Overlay on Hover */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent",
                    "transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                )} />

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                            -{discountPercentage}%
                        </div>
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    className={cn(
                        "absolute top-2 right-2 z-10 p-2 rounded-full",
                        "backdrop-blur-md bg-white/30 dark:bg-black/30",
                        "transition-all duration-200 hover:scale-110",
                        "shadow-lg border border-white/20"
                    )}
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-all duration-200",
                            isFavorite 
                                ? "fill-red-500 text-red-500 scale-110" 
                                : "text-white dark:text-gray-200"
                        )}
                    />
                </button>

                {/* Quick Action Buttons */}
                <div className={cn(
                    "absolute bottom-4 left-1/2 -translate-x-1/2 z-10",
                    "flex gap-2 transition-all duration-300",
                    isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}>
                    <button
                        onClick={handleQuickView}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform duration-200"
                    >
                        <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform duration-200"
                    >
                        <ShoppingCart className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                </div>

                {/* Progress Bar at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                        className={cn(
                            "h-full bg-gradient-to-r from-blue-500 to-purple-500",
                            "transition-all duration-500 ease-out",
                            isHovered ? "w-full" : "w-0"
                        )}
                    />
                </div>
            </CardHeader>

            <CardContent className="p-0 m-0">
                {/* Title with 2 line clamp */}
                <h2 className="text-sm font-semibold line-clamp-2 mb-1">
                    {product.title}
                </h2>
                
                {/* Enhanced Price Section */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Current Price */}
                        <span className={cn(
                            "text-base font-bold text-green-600 dark:text-green-400",
                            "transition-transform duration-200",
                            isHovered ? "scale-105" : "scale-100"
                        )}>
                            ${product.price}
                        </span>
                        
                        {/* Original Price */}
                        {product.originalPrice && product.originalPrice !== product.price && (
                            <span className="text-xs text-red-950 dark:text-red-300 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>
                    
                    {/* Savings Badge */}
                    {savingsAmount > 0 && (
                        <div className="inline-flex w-fit">
                            <span className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                Save ${savingsAmount}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;