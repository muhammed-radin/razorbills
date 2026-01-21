import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { currency } from "@/utils/currency"
import { Star, Heart, ShoppingCart, Eye, Sparkles, Flame, Package } from "lucide-react"
import { useState } from "react"

export default function CardProduct({
    className,
    title,
    description,
    price,
    rating = 0,
    thumbnail,
    discount,
    isNew,
    isTrending,
    stock = true,
    onAddToCart,
    onViewDetails
}) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const discountedPrice = discount ? price - (price * discount / 100) : price

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1
            const isFilled = rating >= starValue
            const isHalf = rating >= starValue - 0.5 && rating < starValue

            return (
                <Star
                    key={index}
                    className={cn(
                        "size-3",
                        isFilled && "fill-amber-400 text-amber-400",
                        isHalf && "fill-amber-400/50 text-amber-400",
                        !isFilled && !isHalf && "fill-muted text-muted-foreground/30"
                    )}
                />
            )
        })
    }

    return (
        <Card
            className={cn(
                "group relative w-full min-w-[180px] overflow-hidden",
                "border border-border/40 rounded-2xl",
                "bg-card/80 backdrop-blur-sm",
                "hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
                "transition-all duration-500 ease-out",
                "hover:-translate-y-1",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Floating Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {isNew && (
                    <Badge
                        variant="default"
                        className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md gap-1 text-[10px] px-1.5 py-0"
                    >
                        <Sparkles className="size-2.5" />
                        New
                    </Badge>
                )}
                {discount > 0 && (
                    <Badge
                        variant="destructive"
                        className="bg-gradient-to-r from-rose-500 to-pink-500 shadow-md text-[10px] px-1.5 py-0 font-bold"
                    >
                        -{discount}%
                    </Badge>
                )}
                {isTrending && (
                    <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md gap-1 text-[10px] px-1.5 py-0"
                    >
                        <Flame className="size-2.5" />
                        Hot
                    </Badge>
                )}
            </div>

            {/* Wishlist Button */}
            <Button
                size="icon"
                variant="secondary"
                className={cn(
                    "absolute top-2 right-2 z-10",
                    "size-7 sm:size-8 rounded-full",
                    "bg-background/90 backdrop-blur-md shadow-md",
                    "border border-border/50",
                    "hover:scale-110 transition-all duration-300",
                    isWishlisted && "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"
                )}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsWishlisted(!isWishlisted)
                }}
            >
                <Heart
                    className={cn(
                        "size-3.5",
                        isWishlisted
                            ? "fill-rose-500 text-rose-500"
                            : "text-muted-foreground group-hover:text-rose-400"
                    )}
                />
            </Button>

            {/* Image Section */}
            <CardHeader className="p-0 relative overflow-hidden">
                <div className="relative aspect-square bg-muted/20">
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                            <Package className="size-8 text-muted-foreground/40" />
                        </div>
                    )}

                    <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                            src={thumbnail}
                            alt={title}
                            className={cn(
                                "object-cover transition-all duration-700 ease-out",
                                "group-hover:scale-110",
                                !imageLoaded && "opacity-0"
                            )}
                            onLoad={() => setImageLoaded(true)}
                        />
                        <AvatarFallback className="w-full h-full rounded-none bg-muted">
                            <Package className="size-10 text-muted-foreground/40" />
                        </AvatarFallback>
                    </Avatar>

                    {/* Out of Stock Overlay - No blur */}
                    {!stock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="destructive" className="text-xs px-3 py-1">
                                Out of Stock
                            </Badge>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    )} />

                    {/* Quick Action Buttons */}
                    <div className={cn(
                        "absolute inset-x-0 bottom-0 p-2",
                        "flex gap-1.5",
                        "transition-all duration-400 ease-out",
                        isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    )}>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 gap-1 h-8 bg-background/95 backdrop-blur-sm hover:bg-background shadow-lg text-xs"
                            onClick={(e) => {
                                e.stopPropagation()
                                onViewDetails?.()
                            }}
                        >
                            <Eye className="size-3.5" />
                            View
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 gap-1 h-8 shadow-lg text-xs"
                            onClick={(e) => {
                                e.stopPropagation()
                                onAddToCart?.()
                            }}
                            disabled={!stock}
                        >
                            <ShoppingCart className="size-3.5" />
                            Add
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Content Section - Reduced gaps */}
            <CardContent className="p-2.5 sm:p-3 space-y-1.5">
                {/* Title */}
                <CardTitle className={cn(
                    "text-sm font-semibold leading-tight",
                    "line-clamp-2",
                    "group-hover:text-primary transition-colors duration-300"
                )}>
                    {title}
                </CardTitle>

                {/* Description */}
                {description && (
                    <CardDescription className="text-xs line-clamp-2 leading-snug text-muted-foreground/80">
                        {description}
                    </CardDescription>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center">
                        {renderStars()}
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground">
                        ({rating.toFixed(1)})
                    </span>
                </div>

                {/* Price Section - No separator, inline layout */}
                <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-primary">
                            {currency(discountedPrice)}
                        </span>
                        {discount > 0 && (
                            <span className="text-[10px] text-muted-foreground line-through">
                                {currency(price)}
                            </span>
                        )}
                    </div>

                    {/* Mobile Add Button */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="sm:hidden h-7 px-2 gap-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground text-xs"
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToCart?.()
                        }}
                        disabled={!stock}
                    >
                        <ShoppingCart className="size-3" />
                        Add
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}