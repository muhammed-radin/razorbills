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
    Package
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

// Compact Product Card for this carousel
function CompactProductCard({ product, variant = "default" }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const isNewArrivals = variant === "new-arrivals";
    const isTopRated = variant === "top-rated";

    return (
        <Card className={cn(
            "group relative overflow-hidden h-full",
            "rounded-xl sm:rounded-2xl border",
            "bg-card hover:bg-accent/5",
            "transition-all duration-300 ease-out",
            "hover:shadow-lg hover:-translate-y-1",
            isNewArrivals && "border-primary/20 hover:border-primary/40",
            isTopRated && "border-amber-500/20 hover:border-amber-500/40"
        )}>
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-muted/30">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                        <Package className="size-8 text-muted-foreground/30" />
                    </div>
                )}
                <img
                    src={product.image}
                    alt={product.title}
                    className={cn(
                        "w-full h-full object-cover",
                        "transition-transform duration-500",
                        "group-hover:scale-110",
                        !imageLoaded && "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    draggable={false}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isNewArrivals && product.isNew && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 gap-0.5">
                            <Sparkles className="size-2.5" />
                            New
                        </Badge>
                    )}
                    {isTopRated && product.rating >= 4.8 && (
                        <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 gap-0.5">
                            <Star className="size-2.5 fill-white" />
                            Top
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <Button
                    size="icon"
                    variant="secondary"
                    className={cn(
                        "absolute top-2 right-2 size-7 sm:size-8 rounded-full",
                        "bg-background/80 backdrop-blur-sm shadow-sm",
                        "opacity-0 group-hover:opacity-100 transition-all duration-300",
                        "hover:scale-110",
                        isWishlisted && "opacity-100 bg-rose-50 dark:bg-rose-950"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                >
                    <Heart className={cn(
                        "size-3.5 sm:size-4",
                        isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                    )} />
                </Button>

                {/* Quick Add Button */}
                <div className={cn(
                    "absolute bottom-2 left-2 right-2",
                    "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
                    "transition-all duration-300"
                )}>
                    <Button
                        size="sm"
                        className="w-full gap-1.5 rounded-lg text-xs h-8 shadow-lg"
                    >
                        <ShoppingCart className="size-3.5" />
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-2.5 sm:p-3 space-y-1.5">
                {/* Category */}
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    {product.category}
                </span>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-medium line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "size-3",
                                    i < Math.floor(product.rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-muted text-muted-foreground/30"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        ({product.reviews})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1.5 pt-1">
                    <span className={cn(
                        "text-sm sm:text-base font-bold",
                        isNewArrivals && "text-primary",
                        isTopRated && "text-amber-600 dark:text-amber-500"
                    )}>
                        {currency(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                            {currency(product.originalPrice)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
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
        <section className="relative w-full py-6 sm:py-8 md:py-10 overflow-hidden">
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
                        dragFree: false,
                        containScroll: "trimSnaps"
                    }}
                >
                    <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
                        {displayProducts.map((product, index) => (
                            <CarouselItem
                                key={product.id || index}
                                className={cn(
                                    "pl-2 sm:pl-3 md:pl-4",
                                    "basis-[45%] xs:basis-[40%] sm:basis-[32%] md:basis-[25%] lg:basis-[20%] xl:basis-[16.66%]"
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
                        )}
                    />
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
