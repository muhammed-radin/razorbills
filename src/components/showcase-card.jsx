import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FruitShowcaseCard({
    className,
    items = [
        {
            id: "lime",
            name: "Lime",
            title: "The Power of Fruits",
            description: "Sed lectus dolor, fringilla ac dapibus nec, molestie ac neque. Vestibulum efficitur magna nec risus tincidunt venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus sem, dictum vel ultricies at, faucibus sit amet nisl. Cras sodales mauris sit amet egestas posuere.",
            image: "/products/headphone.png",
            color: "#84cc16" // lime green
        },
        {
            id: "grapes",
            name: "Grapes",
            title: "The Power of Fruits",
            description: "Discover the amazing health benefits of fresh grapes. Rich in antioxidants and vitamins, perfect for a healthy lifestyle.",
            image: "/products/grapes.png",
            color: "#8b5cf6" // purple
        },
        {
            id: "grapefruit",
            name: "Grapefruit",
            title: "The Power of Fruits",
            description: "Experience the tangy freshness of grapefruit. Packed with vitamin C and perfect for boosting your immune system.",
            image: "/products/grapefruit.png",
            color: "#f97316" // orange
        }
    ],
    onMoreInfo
}) {
    const [activeTab, setActiveTab] = useState(items[0]?.id || "lime");
    const activeItem = items.find(item => item.id === activeTab) || items[0];

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "w-full max-w-[600px] h-[280px] sm:h-[320px]",
                "rounded-3xl border-0",
                "bg-white dark:bg-zinc-900",
                "shadow-xl",
                "flex flex-col",
                className
            )}
        >
            {/* Gradient Background on right side */}
            <div
                className="absolute max-sm:left-0 sm:right-0 top-0 bottom-0 max-sm:w-full sm:w-[45%] transition-colors duration-500"
                style={{
                    background: `linear-gradient(135deg, ${activeItem.color}40 0%, ${activeItem.color}80 50%, ${activeItem.color} 100%)`
                }}
            />

            {/* Product Name Label - Top Right */}
            <div className="absolute top-4 sm:right-6 max-sm:left-6 z-10">
                <span
                    className="text-xl sm:text-2xl font-bold tracking-wider uppercase transition-colors duration-300"
                    style={{ color: activeItem.color }}
                >
                    {activeItem.name}
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex">
                {/* Left Content */}
                <div className="w-[55%] p-6 sm:p-8 flex flex-col justify-between">
                    {/* Tabs */}
                    <div className="flex items-center gap-4">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "text-sm font-medium transition-all duration-300",
                                    "pb-1 border-b-2",
                                    activeTab === item.id
                                        ? "border-current text-foreground"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                                style={{
                                    color: activeTab === item.id ? activeItem.color : undefined,
                                    borderColor: activeTab === item.id ? activeItem.color : "transparent"
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3 flex-1 flex flex-col justify-center mt-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            {activeItem.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-5 max-sm:line-clamp-4 mb-3">
                            {activeItem.description}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Button
                        className="w-fit rounded-full px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                        onClick={() => onMoreInfo?.(activeItem)}
                    >
                        More Info
                    </Button>
                </div>

                {/* Right Image */}
                <div className="w-[45%] relative flex items-center justify-center p-4">
                    <img
                        src={activeItem.image}
                        alt={activeItem.name}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
                    />
                </div>
            </div>
        </Card>
    );
}
