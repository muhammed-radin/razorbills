import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { currency } from "@/utils/currency";
import {
    Star,
    Heart,
    ShoppingCart,
    Clock,
    TrendingUp,
    Sparkles,
    ArrowRight,
    Package,
    Eye,
    Zap
} from "lucide-react";

const defaultProducts = [
    {
        id: 1,
        title: "Wireless Earbuds Pro",
        price: 1499,
        originalPrice: 2499,
        rating: 4.8,
        reviews: 234,
        image: "/products/Headphone.jpg",
        isNew: true,
        category: "Audio"
    },
    {
        id: 2,
        title: "Smart LED Strip Lights",
        price: 899,
        originalPrice: 1299,
        rating: 4.6,
        reviews: 189,
        image: "/products/LedStrip.webp",
        isNew: true,
        category: "Lighting"
    },
    {
        id: 3,
        title: "Power Bank 20000mAh",
        price: 1999,
        originalPrice: 2999,
        rating: 4.9,
        reviews: 456,
        image: "/products/Battery.png",
        isNew: false,
        category: "Power"
    },
    {
        id: 4,
        title: "Bluetooth Speaker",
        price: 2499,
        originalPrice: 3499,
        rating: 4.7,
        reviews: 312,
        image: "/products/Speaker.webp",
        isNew: true,
        category: "Audio"
    },
    {
        id: 5,
        title: "Studio Headphones",
        price: 3999,
        originalPrice: 5999,
        rating: 4.9,
        reviews: 567,
        image: "/products/Headphone2.jpg",
        isNew: false,
        category: "Audio"
    }
];

// Unique Floating Card Design
function CompactProductCard({ product, variant = "default" }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const isNewArrivals = variant === "new-arrivals";
    const isTopRated = variant === "top-rated";

    return (
        <div
            className="group relative h-full perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Floating Glow Effect */}
            <div className={cn(
                "absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-all duration-500",
                "group-hover:opacity-60",
                isNewArrivals && "bg-gradient-to-br from-violet-500/40 via-primary/30 to-fuchsia-500/40",
                isTopRated && "bg-gradient-to-br from-amber-400/40 via-orange-500/30 to-rose-500/40",
                !isNewArrivals && !isTopRated && "bg-gradient-to-br from-cyan-500/40 via-blue-500/30 to-indigo-500/40"
            )} />

            {/* Main Card */}
            <Card className={cn(
                "relative overflow-hidden h-full",
                "rounded-2xl sm:rounded-3xl border-0",
                "bg-gradient-to-b from-background via-background to-muted/20",
                "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]",
                "dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]",
                "transition-all duration-500 ease-out",
                "group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]",
                "group-hover:-translate-y-2 group-hover:rotate-[0.5deg]"
            )}>
                {/* Diagonal Accent Strip */}
                <div className={cn(
                    "absolute -top-10 -right-10 w-28 h-28 rotate-45",
                    "transition-all duration-500 group-hover:scale-110",
                    isNewArrivals && "bg-gradient-to-br from-violet-500 to-fuchsia-500",
                    isTopRated && "bg-gradient-to-br from-amber-400 to-orange-500",
                    !isNewArrivals && !isTopRated && "bg-gradient-to-br from-cyan-400 to-blue-500"
                )} />

                {/* Image Container with Unique Shape */}
                <div className="relative mx-3 mt-3 overflow-hidden rounded-xl sm:rounded-2xl">
                    {/* Image Background Pattern */}
                    <div className="absolute inset-0 opacity-50">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:8px_8px]" />
                    </div>

                    {/* Loading State */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center aspect-[4/5]">
                            <div className="relative">
                                <Package className="size-10 text-muted-foreground/20" />
                                <Sparkles className="absolute -top-1 -right-1 size-4 text-muted-foreground/30 animate-pulse" />
                            </div>
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-[4/5] overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10">
                        <img
                            src={product.image}
                            alt={product.title}
                            className={cn(
                                "w-full h-full object-cover",
                                "transition-all duration-700 ease-out",
                                "group-hover:scale-110 group-hover:rotate-1",
                                !imageLoaded && "opacity-0"
                            )}
                            onLoad={() => setImageLoaded(true)}
                            draggable={false}
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        "bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    )} />

                    {/* Floating Discount Badge */}
                    {discount > 0 && (
                        <div className={cn(
                            "absolute top-3 left-3",
                            "px-2.5 py-1 rounded-full",
                            "bg-gradient-to-r from-rose-500 to-pink-500",
                            "text-white text-[10px] sm:text-xs font-bold",
                            "shadow-lg shadow-rose-500/30",
                            "flex items-center gap-1",
                            "animate-in slide-in-from-left duration-300"
                        )}>
                            <Zap className="size-3 fill-white" />
                            {discount}% OFF
                        </div>
                    )}

                    {/* Category Pill - Top Right */}
                    <div className={cn(
                        "absolute top-3 right-3 z-10",
                        "transition-all duration-300",
                        "group-hover:translate-x-0 group-hover:opacity-100",
                        isHovered ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                    )}>
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-medium",
                            "bg-white/90 dark:bg-black/70 backdrop-blur-md",
                            "text-foreground shadow-sm"
                        )}>
                            {product.category}
                        </span>
                    </div>

                    {/* New/Top Badge */}
                    {(isNewArrivals && product.isNew) || (isTopRated && product.rating >= 4.8) ? (
                        <div className={cn(
                            "absolute bottom-3 left-3",
                            "px-2 py-1 rounded-lg",
                            "backdrop-blur-md shadow-lg",
                            "flex items-center gap-1.5",
                            "animate-in fade-in slide-in-from-bottom duration-500",
                            isNewArrivals && "bg-violet-500/90 text-white",
                            isTopRated && "bg-amber-500/90 text-white"
                        )}>
                            {isNewArrivals ? (
                                <>
                                    <Sparkles className="size-3" />
                                    <span className="text-[10px] font-semibold">NEW</span>
                                </>
                            ) : (
                                <>
                                    <Star className="size-3 fill-white" />
                                    <span className="text-[10px] font-semibold">TOP RATED</span>
                                </>
                            )}
                        </div>
                    ) : null}

                    {/* Action Buttons - Floating */}
                    <div className={cn(
                        "absolute bottom-3 right-3 flex flex-col gap-2",
                        "transition-all duration-300 ease-out",
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        <Button
                            size="icon"
                            className={cn(
                                "size-9 rounded-xl shadow-lg",
                                "bg-white/90 dark:bg-black/70 backdrop-blur-md",
                                "hover:bg-white dark:hover:bg-black hover:scale-110",
                                "text-foreground",
                                "transition-all duration-200",
                                isWishlisted && "bg-rose-50 dark:bg-rose-950"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsWishlisted(!isWishlisted);
                            }}
                        >
                            <Heart className={cn(
                                "size-4",
                                isWishlisted ? "fill-rose-500 text-rose-500" : ""
                            )} />
                        </Button>
                        <Button
                            size="icon"
                            className={cn(
                                "size-9 rounded-xl shadow-lg",
                                "bg-white/90 dark:bg-black/70 backdrop-blur-md",
                                "hover:bg-white dark:hover:bg-black hover:scale-110",
                                "text-foreground",
                                "transition-all duration-200"
                            )}
                        >
                            <Eye className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-3 sm:p-4 space-y-2">
                    {/* Title */}
                    <h3 className={cn(
                        "text-sm sm:text-base font-semibold line-clamp-2 leading-tight",
                        "transition-colors duration-300",
                        "group-hover:text-transparent group-hover:bg-clip-text",
                        isNewArrivals && "group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600",
                        isTopRated && "group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500",
                        !isNewArrivals && !isTopRated && "group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500"
                    )}>
                        {product.title}
                    </h3>

                    {/* Rating - Unique Style */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full",
                            "bg-amber-50 dark:bg-amber-950/50"
                        )}>
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                {product.rating}
                            </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                            {product.reviews} reviews
                        </span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-end justify-between pt-1">
                        <div className="space-y-0.5">
                            <span className={cn(
                                "text-lg sm:text-xl font-bold",
                                isNewArrivals && "text-violet-600 dark:text-violet-400",
                                isTopRated && "text-amber-600 dark:text-amber-400",
                                !isNewArrivals && !isTopRated && "text-foreground"
                            )}>
                                {currency(product.price)}
                            </span>
                            {product.originalPrice && (
                                <p className="text-xs text-muted-foreground line-through">
                                    {currency(product.originalPrice)}
                                </p>
                            )}
                        </div>

                        {/* Add to Cart - Circular Button */}
                        <Button
                            size="icon"
                            className={cn(
                                "size-10 rounded-full shadow-md",
                                "transition-all duration-300",
                                "hover:scale-110 hover:shadow-lg",
                                isNewArrivals && "bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600",
                                isTopRated && "bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600",
                                !isNewArrivals && !isTopRated && "bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                            )}
                        >
                            <ShoppingCart className="size-4 text-white" />
                        </Button>
                    </div>
                </CardContent>

                {/* Bottom Accent Line */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1",
                    "transform scale-x-0 group-hover:scale-x-100",
                    "transition-transform duration-500 origin-left",
                    isNewArrivals && "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500",
                    isTopRated && "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500",
                    !isNewArrivals && !isTopRated && "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
                )} />
            </Card>
        </div>
    );
}

export default function ModernCarousel({
    products,
    title = "New Arrivals",
    variant = "new-arrivals", // "new-arrivals" | "top-rated"
    showTitle = true
}) {
    const [api, setApi] = useState();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const displayProducts = products || defaultProducts;

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const isNewArrivals = variant === "new-arrivals";
    const isTopRated = variant === "top-rated";

    const Icon = isNewArrivals ? Sparkles : isTopRated ? TrendingUp : Clock;
    const accentColor = isNewArrivals ? "primary" : isTopRated ? "amber-500" : "primary";

    return (
        <section className="relative w-full py-6 sm:py-8 md:py-10 overflow-hidden max-w-7xl mx-auto">
            <div className="max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto">
                {/* Section Header */}
                {showTitle && (
                    <header className="flex items-center justify-between mb-4 sm:mb-6 px-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className={cn(
                                "p-1.5 sm:p-2 rounded-lg",
                                isNewArrivals && "bg-primary/10",
                                isTopRated && "bg-amber-500/10"
                            )}>
                                <Icon className={cn(
                                    "size-4 sm:size-5",
                                    isNewArrivals && "text-primary",
                                    isTopRated && "text-amber-500"
                                )} />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                                    {title}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">
                                    {isNewArrivals && "Fresh additions to our collection"}
                                    {isTopRated && "Highest rated by customers"}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs sm:text-sm hidden sm:flex"
                        >
                            View All
                            <ArrowRight className="size-3.5 sm:size-4" />
                        </Button>
                    </header>
                )}

                {/* Carousel */}
                <Carousel
                    setApi={setApi}
                    className="w-full touch-pan-y"
                    opts={{
                        loop: true,
                        align: "start",
                        dragFree: true,
                        skipSnaps: true,
                        containScroll: "trimSnaps"
                    }}
                >
                    <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-5 lg:-ml-6" >
                        {displayProducts.map((product, index) => (
                            <CarouselItem
                                key={product.id || index}
                                className={cn(
                                    "pl-3 sm:pl-4 md:pl-5 lg:pl-6",
                                    "basis-[58%] xs:basis-[45%] sm:basis-[35%] md:basis-[30%] lg:basis-[25%] xl:basis-[22%] 2xl:basis-[20%]"
                                )}
                            >
                                <CompactProductCard
                                    product={product}
                                    variant={variant}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <CarouselPrevious
                        className={cn(
                            "hidden md:flex",
                            "absolute -left-3 lg:-left-4 top-1/2 -translate-y-1/2",
                            "size-9 lg:size-10 rounded-full",
                            "bg-background border shadow-md",
                            "hover:bg-accent hover:scale-105",
                            "transition-all duration-200"
                        )}
                    />
                    <CarouselNext
                        className={cn(
                            "hidden md:flex",
                            "absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2",
                            "size-9 lg:size-10 rounded-full",
                            "bg-background border shadow-md",
                            "hover:bg-accent hover:scale-105",
                            "transition-all duration-200"
                        )} />
                </Carousel>

                {/* Mobile Dot Indicators */}
                <div className="flex md:hidden justify-center items-center gap-1 mt-3 px-4">
                    {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "rounded-full transition-all duration-300",
                                current === index + 1
                                    ? cn(
                                        "w-5 h-1.5",
                                        isNewArrivals && "bg-primary",
                                        isTopRated && "bg-amber-500"
                                    )
                                    : "w-1.5 h-1.5 bg-muted-foreground/30"
                            )}
                        />
                    ))}
                </div> 
            </div>
        </section>
    );
}


// End of src/components/modern-carousel.jsx