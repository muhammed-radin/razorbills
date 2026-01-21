import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { currency } from "@/utils/currency";
import {
    Star,
    Heart,
    ShoppingCart,
    ArrowRight,
    Zap,
    Award,
    TrendingUp,
    Package
} from "lucide-react";

export default function FeaturedCard({
    className,
    title = "Premium Product",
    description = "Discover amazing quality and features",
    price = 1999,
    originalPrice,
    rating = 4.8,
    reviews = 128,
    thumbnail = "/products/Headphone.jpg",
    badge = "Featured",
    accentColor = "primary", // primary, rose, amber, emerald, violet
    onAddToCart,
    onViewDetails
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const accentColors = {
        primary: {
            gradient: "from-primary/20 via-primary/10 to-transparent",
            border: "border-primary/30",
            bg: "bg-primary",
            text: "text-primary",
            glow: "shadow-primary/25"
        },
        rose: {
            gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
            border: "border-rose-500/30",
            bg: "bg-rose-500",
            text: "text-rose-500",
            glow: "shadow-rose-500/25"
        },
        amber: {
            gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
            border: "border-amber-500/30",
            bg: "bg-amber-500",
            text: "text-amber-500",
            glow: "shadow-amber-500/25"
        },
        emerald: {
            gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
            border: "border-emerald-500/30",
            bg: "bg-emerald-500",
            text: "text-emerald-500",
            glow: "shadow-emerald-500/25"
        },
        violet: {
            gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
            border: "border-violet-500/30",
            bg: "bg-violet-500",
            text: "text-violet-500",
            glow: "shadow-violet-500/25"
        }
    };

    const colors = accentColors[accentColor] || accentColors.primary;

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={cn(
                    "size-3.5",
                    index < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30"
                )}
            />
        ));
    };

    return (
        <Card
            className={cn(
                "group relative overflow-hidden",
                "min-w-[280px] sm:min-w-[320px] h-[420px] sm:h-[460px]",
                "rounded-3xl border-2",
                colors.border,
                "bg-gradient-to-br from-background via-background to-muted/30",
                "backdrop-blur-xl",
                "transition-all duration-500 ease-out",
                "hover:shadow-2xl",
                isHovered && colors.glow,
                "hover:-translate-y-2 hover:scale-[1.02]",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated Background Gradient */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                colors.gradient
            )} />

            {/* Floating Orbs */}
            <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700",
                colors.bg
            )} />
            <div className={cn(
                "absolute -bottom-20 -left-20 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700",
                colors.bg
            )} />

            {/* Top Section - Badge & Wishlist */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                <Badge
                    className={cn(
                        "px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
                        "bg-gradient-to-r shadow-lg",
                        accentColor === "primary" && "from-primary to-primary/80",
                        accentColor === "rose" && "from-rose-500 to-pink-500",
                        accentColor === "amber" && "from-amber-500 to-orange-500",
                        accentColor === "emerald" && "from-emerald-500 to-teal-500",
                        accentColor === "violet" && "from-violet-500 to-purple-500",
                        "text-white"
                    )}
                >
                    <Award className="size-3 mr-1" />
                    {badge}
                </Badge>

                <Button
                    size="icon"
                    variant="secondary"
                    className={cn(
                        "size-10 rounded-full",
                        "bg-white/80 dark:bg-black/50 backdrop-blur-md",
                        "border border-white/50 dark:border-white/20 shadow-lg",
                        "hover:scale-110 transition-all duration-300",
                        isWishlisted && "bg-rose-50 dark:bg-rose-950/50"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                >
                    <Heart
                        className={cn(
                            "size-5 transition-all duration-300",
                            isWishlisted
                                ? "fill-rose-500 text-rose-500 scale-110"
                                : "text-muted-foreground"
                        )}
                    />
                </Button>
            </div>

            {/* Image Section */}
            <div className="relative h-[55%] overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                        <Package className="size-12 text-muted-foreground/30" />
                    </div>
                )}
                <img
                    src={thumbnail}
                    alt={title}
                    className={cn(
                        "w-full h-full object-cover",
                        "transition-all duration-700 ease-out",
                        "group-hover:scale-110 group-hover:rotate-1",
                        !imageLoaded && "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Discount Tag */}
                {discount > 0 && (
                    <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                            <Zap className="size-3.5 fill-white" />
                            <span className="text-sm font-bold">{discount}% OFF</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <CardContent className="relative z-10 p-5 pt-3 space-y-3">
                {/* Title */}
                <h3 className={cn(
                    "text-lg sm:text-xl font-bold line-clamp-2 leading-tight",
                    "transition-colors duration-300",
                    `group-hover:${colors.text}`
                )}>
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                        {renderStars()}
                    </div>
                    <span className="text-sm font-medium">{rating}</span>
                    <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-2xl font-bold", colors.text)}>
                                {currency(price)}
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {currency(originalPrice)}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className={cn(
                            "rounded-full px-5 gap-2 shadow-lg",
                            "transition-all duration-300",
                            "hover:scale-105 hover:shadow-xl",
                            accentColor === "primary" && "bg-primary hover:bg-primary/90",
                            accentColor === "rose" && "bg-rose-500 hover:bg-rose-600",
                            accentColor === "amber" && "bg-amber-500 hover:bg-amber-600",
                            accentColor === "emerald" && "bg-emerald-500 hover:bg-emerald-600",
                            accentColor === "violet" && "bg-violet-500 hover:bg-violet-600"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.();
                        }}
                    >
                        <ShoppingCart className="size-4" />
                        Add
                    </Button>
                </div>
            </CardContent>

            {/* Hover Shine Effect */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100",
                "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                "translate-x-[-100%] group-hover:translate-x-[100%]",
                "transition-all duration-1000 ease-in-out"
            )} />
        </Card>
    );
}
