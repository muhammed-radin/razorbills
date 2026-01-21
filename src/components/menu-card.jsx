import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { currency } from "@/utils/currency";

function FoodMenuItem({
    name,
    calories,
    price,
    image,
    onClick
}) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 p-4",
                "bg-white dark:bg-zinc-800 rounded-2xl",
                "cursor-pointer transition-all duration-300",
                "hover:shadow-md hover:scale-[1.02]"
            )}
            onClick={onClick}
        >
            {/* Food Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {name}
                </h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Flame className="size-4 text-orange-500 fill-orange-500" />
                    <span className="text-sm">{calories} Calories</span>
                </div>
                <p className="text-amber-500 font-semibold">
                    {currency(price)}
                </p>
            </div>
        </div>
    );
}

export default function FoodMenuCard({
    className,
    items = [
        {
            id: 1,
            name: "Beef Burguer",
            calories: 70,
            price: 12,
            image: "/products/burger.png"
        },
        {
            id: 2,
            name: "Pancakes",
            calories: 60,
            price: 15,
            image: "/products/pancakes.png"
        }
    ],
    onItemClick
}) {
    return (
        <Card
            className={cn(
                "overflow-hidden",
                "w-full max-w-[380px]",
                "rounded-3xl border-0",
                "bg-amber-400",
                "p-4 sm:p-6",
                "shadow-xl",
                className
            )}
        >
            <div className="space-y-3">
                {items.map((item) => (
                    <FoodMenuItem
                        key={item.id}
                        name={item.name}
                        calories={item.calories}
                        price={item.price}
                        image={item.image}
                        onClick={() => onItemClick?.(item)}
                    />
                ))}
            </div>
        </Card>
    );
}

export { FoodMenuItem };
