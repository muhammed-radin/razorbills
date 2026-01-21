import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { currency } from "@/utils/currency";
import {
    ArrowRight,
    Flame,
    Star,
    Clock,
    Zap,
    Gift,
    Truck,
    Shield,
    Sparkles,
    TrendingUp,
    Package
} from "lucide-react";
import FruitShowcaseCard from "@/components/showcase-card";
import FoodMenuCard from "@/components/menu-card";

const defaultItems = [
    {
        id: 1,
        title: "Flash Sale",
        subtitle: "Up to 70% Off",
        description: "Limited time offers on top products",
        image: "/products/Headphone.jpg",
        badge: "Ends Soon",
        icon: Zap,
        theme: "rose",
        size: "large"
    },
    {
        id: 2,
        title: "New Arrivals",
        subtitle: "Fresh Collection",
        description: "Discover the latest additions",
        image: "/products/LedStrip.webp",
        badge: "New",
        icon: Sparkles,
        theme: "violet",
        size: "medium"
    },
    {
        id: 3,
        title: "Top Rated",
        subtitle: "Customer Favorites",
        description: "Highly rated by our community",
        image: "/products/Speaker.webp",
        badge: "★ 4.9",
        icon: Star,
        theme: "amber",
        size: "medium"
    },
    {
        id: 4,
        title: "Free Shipping",
        subtitle: "On Orders $50+",
        description: "Fast & reliable delivery",
        image: null,
        badge: null,
        icon: Truck,
        theme: "emerald",
        size: "small"
    },
    {
        id: 5,
        title: "Warranty",
        subtitle: "2 Year Coverage",
        description: "Peace of mind guaranteed",
        image: null,
        badge: null,
        icon: Shield,
        theme: "blue",
        size: "small"
    },
    {
        id: 6,
        title: "Gift Cards",
        subtitle: "Perfect Present",
        description: "Give the gift of choice",
        image: null,
        badge: null,
        icon: Gift,
        theme: "pink",
        size: "small"
    }
];

export default function ContentGrid({ items, title = "Explore More", showTitle = true }) {
    const displayItems = items || defaultItems;

    const themeColors = {
        rose: {
            gradient: "from-rose-500 to-pink-600",
            bg: "bg-rose-500/10",
            border: "border-rose-500/30",
            text: "text-rose-500",
            glow: "group-hover:shadow-rose-500/20"
        },
        violet: {
            gradient: "from-violet-500 to-purple-600",
            bg: "bg-violet-500/10",
            border: "border-violet-500/30",
            text: "text-violet-500",
            glow: "group-hover:shadow-violet-500/20"
        },
        amber: {
            gradient: "from-amber-500 to-orange-600",
            bg: "bg-amber-500/10",
            border: "border-amber-500/30",
            text: "text-amber-500",
            glow: "group-hover:shadow-amber-500/20"
        },
        emerald: {
            gradient: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/30",
            text: "text-emerald-500",
            glow: "group-hover:shadow-emerald-500/20"
        },
        blue: {
            gradient: "from-blue-500 to-cyan-600",
            bg: "bg-blue-500/10",
            border: "border-blue-500/30",
            text: "text-blue-500",
            glow: "group-hover:shadow-blue-500/20"
        },
        pink: {
            gradient: "from-pink-500 to-fuchsia-600",
            bg: "bg-pink-500/10",
            border: "border-pink-500/30",
            text: "text-pink-500",
            glow: "group-hover:shadow-pink-500/20"
        }
    };

    const GridCard = ({ item, index }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [imageLoaded, setImageLoaded] = useState(false);
        const theme = themeColors[item.theme] || themeColors.violet;
        const Icon = item.icon || Package;

        const isLarge = item.size === "large";
        const isMedium = item.size === "medium";
        const isSmall = item.size === "small";

        return (
            <Card
                className={cn(
                    "group relative overflow-hidden cursor-pointer",
                    "rounded-2xl border",
                    theme.border,
                    "bg-gradient-to-br from-background to-muted/20",
                    "transition-all duration-500 ease-out",
                    "hover:-translate-y-1 hover:shadow-2xl",
                    theme.glow,
                    // Grid sizing
                    isLarge && "col-span-2 row-span-2 min-h-[320px]",
                    isMedium && "col-span-1 row-span-1 min-h-[200px]",
                    isSmall && "col-span-1 row-span-1 min-h-[160px]"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background Image for Large/Medium Cards */}
                {item.image && (isLarge || isMedium) && (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-muted animate-pulse" />
                        )}
                        <img
                            src={item.image}
                            alt={item.title}
                            className={cn(
                                "absolute inset-0 w-full h-full object-cover",
                                "transition-all duration-700 ease-out",
                                "group-hover:scale-110",
                                !imageLoaded && "opacity-0"
                            )}
                            onLoad={() => setImageLoaded(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                    </>
                )}

                {/* Icon Background for Small Cards */}
                {isSmall && (
                    <div className={cn(
                        "absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    )}>
                        <Icon className="size-40" />
                    </div>
                )}

                {/* Content */}
                <CardContent className={cn(
                    "relative z-10 h-full flex flex-col justify-end p-5",
                    isSmall && "justify-center items-center text-center"
                )}>
                    {/* Badge */}
                    {item.badge && (
                        <Badge
                            className={cn(
                                "absolute top-4 left-4 px-3 py-1 text-xs font-semibold",
                                "bg-gradient-to-r text-white shadow-lg",
                                theme.gradient
                            )}
                        >
                            {item.badge}
                        </Badge>
                    )}

                    {/* Icon for Small Cards */}
                    {isSmall && (
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
                            "bg-gradient-to-br shadow-lg",
                            theme.gradient
                        )}>
                            <Icon className="size-7 text-white" />
                        </div>
                    )}

                    {/* Title & Subtitle */}
                    <div className={cn(isSmall && "text-center")}>
                        <h3 className={cn(
                            "font-bold mb-1 transition-colors duration-300",
                            isLarge ? "text-2xl sm:text-3xl text-white" : "",
                            isMedium ? "text-xl text-white" : "",
                            isSmall ? "text-base" : ""
                        )}>
                            {item.title}
                        </h3>
                        <p className={cn(
                            "font-medium mb-2",
                            isLarge ? "text-lg text-gray-200" : "",
                            isMedium ? "text-sm text-gray-300" : "",
                            isSmall ? "text-sm text-muted-foreground" : ""
                        )}>
                            {item.subtitle}
                        </p>
                        {(isLarge || isMedium) && (
                            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* CTA for Large Cards */}
                    {isLarge && (
                        <Button
                            className={cn(
                                "w-fit rounded-full px-6 gap-2 text-white shadow-lg",
                                "bg-gradient-to-r hover:opacity-90 transition-all",
                                "hover:scale-105",
                                theme.gradient
                            )}
                        >
                            Shop Now
                            <ArrowRight className="size-4" />
                        </Button>
                    )}
                </CardContent>

                {/* Hover Glow Effect */}
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    "bg-gradient-to-t from-transparent via-transparent",
                    isLarge && "to-white/5",
                    (isMedium || isSmall) && "to-white/10"
                )} />
            </Card>
        );
    };

    return (
        <section className="relative w-full py-8 sm:py-12 max-w-7xl mx-auto">
            <div className="max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto">
                {/* Section Header */}
                {showTitle && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-6 text-primary" />
                                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {title}
                                </h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Discover categories and special offers
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-full gap-2 hidden sm:flex">
                            View All
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                )}

                {/* Showcase Cards Row */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <FruitShowcaseCard
                        className="flex-1"
                        items={[
                            {
                                id: "electronics",
                                name: "Electronics",
                                title: "Power Your Projects",
                                description: "Discover our wide range of electronic components including resistors, capacitors, LEDs, and microcontrollers. Perfect for hobbyists and professionals alike.",
                                image: "/products/Battery.png",
                                color: "#3b82f6"
                            },
                            {
                                id: "audio",
                                name: "Audio",
                                title: "Premium Sound",
                                description: "Experience crystal clear audio with our selection of speakers, headphones, and audio accessories. Designed for immersive listening.",
                                image: "/products/Speaker.webp",
                                color: "#8b5cf6"
                            },
                            {
                                id: "lighting",
                                name: "Lighting",
                                title: "Illuminate Your Space",
                                description: "Transform any environment with our LED strips, bulbs, and smart lighting solutions. Energy efficient and vibrant colors.",
                                image: "/products/LedStrip.webp",
                                color: "#10b981"
                            }
                        ]}
                    />
                    <FoodMenuCard
                        className="lg:max-w-[380px] bg-gradient-to-br from-violet-500 to-purple-600"
                        items={[
                            {
                                id: 1,
                                name: "Wireless Headphones",
                                calories: 120,
                                price: 49.99,
                                image: "/products/Headphone.jpg"
                            },
                            {
                                id: 2,
                                name: "LED Strip Lights",
                                calories: 85,
                                price: 24.99,
                                image: "/products/LedStrip.webp"
                            }
                        ]}
                    />
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-auto">
                    {displayItems.map((item, index) => (
                        <GridCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
