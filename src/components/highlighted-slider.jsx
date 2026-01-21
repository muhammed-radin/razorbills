import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { currency } from "@/utils/currency";
import {
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    ArrowRight,
    Sparkles,
    Percent
} from "lucide-react";

const slides = [
    {
        id: 1,
        title: "Premium Wireless Audio",
        subtitle: "Experience Sound Like Never Before",
        description: "Immerse yourself in crystal-clear audio with our flagship headphones featuring active noise cancellation.",
        image: "/products/Headphone.jpg",
        price: 2999,
        originalPrice: 4999,
        badge: "Best Seller",
        theme: "violet"
    },
    {
        id: 2,
        title: "Smart LED Lighting",
        subtitle: "Transform Your Space",
        description: "Create the perfect ambiance with customizable RGB LED strips. Control via app or voice.",
        image: "/products/LedStrip.webp",
        price: 1499,
        originalPrice: 2499,
        badge: "New Arrival",
        theme: "emerald"
    },
    {
        id: 3,
        title: "Portable Power Station",
        subtitle: "Power On The Go",
        description: "Never run out of power with our high-capacity portable battery. Fast charging for all devices.",
        image: "/products/Battery.png",
        price: 3499,
        originalPrice: 4999,
        badge: "Limited Edition",
        theme: "amber"
    },
    {
        id: 4,
        title: "Premium Sound System",
        subtitle: "Concert Quality Audio",
        description: "Bring the concert home with our powerful speaker system. Deep bass, crisp highs.",
        image: "/products/Speaker.webp",
        price: 5999,
        originalPrice: 7999,
        badge: "Top Rated",
        theme: "rose"
    }
];

export default function HighlightedSlider({ customSlides, autoPlay = true, interval = 5000 }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const sliderRef = useRef(null);

    const displaySlides = customSlides || slides;

    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setProgress(0);
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, displaySlides.length]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setProgress(0);
        setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, displaySlides.length]);

    const goToSlide = (index) => {
        if (isAnimating || index === currentSlide) return;
        setIsAnimating(true);
        setProgress(0);
        setCurrentSlide(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    useEffect(() => {
        if (!autoPlay) return;

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + (100 / (interval / 100));
            });
        }, 100);

        const slideTimer = setInterval(() => {
            nextSlide();
        }, interval);

        return () => {
            clearInterval(progressTimer);
            clearInterval(slideTimer);
        };
    }, [autoPlay, interval, nextSlide]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    const [mouseStart, setMouseStart] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = (e) => {
        setMouseStart(e.clientX);
        setIsDragging(true);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
    };

    const onMouseUp = (e) => {
        if (!isDragging || mouseStart === null) return;
        const distance = mouseStart - e.clientX;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
        setIsDragging(false);
        setMouseStart(null);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        setMouseStart(null);
    };

    const current = displaySlides[currentSlide];
    const discount = current.originalPrice
        ? Math.round(((current.originalPrice - current.price) / current.originalPrice) * 100)
        : 0;

    const themeColors = {
        violet: {
            accent: "from-violet-600 to-purple-600",
            glow: "bg-violet-500/30",
            text: "text-violet-400",
            badge: "from-violet-500 to-purple-500"
        },
        emerald: {
            accent: "from-emerald-600 to-teal-600",
            glow: "bg-emerald-500/30",
            text: "text-emerald-400",
            badge: "from-emerald-500 to-teal-500"
        },
        amber: {
            accent: "from-amber-600 to-orange-600",
            glow: "bg-amber-500/30",
            text: "text-amber-400",
            badge: "from-amber-500 to-orange-500"
        },
        rose: {
            accent: "from-rose-600 to-pink-600",
            glow: "bg-rose-500/30",
            text: "text-rose-400",
            badge: "from-rose-500 to-pink-500"
        }
    };

    const theme = themeColors[current.theme] || themeColors.violet;

    return (
        <section className="relative w-full my-4 sm:my-8 md:my-12 overflow-hidden max-w-7xl mx-auto">
            <div className="max-w-[98%] sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto">
                <div
                    ref={sliderRef}
                    className="relative h-[420px] xs:h-[450px] sm:h-[400px] md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                >
                    <div className="absolute inset-0">
                        {displaySlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={cn(
                                    "absolute inset-0 transition-all duration-700 ease-out",
                                    index === currentSlide
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-110"
                                )}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover pointer-events-none"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

                    <div className={cn(
                        "absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2",
                        "w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[80px] sm:blur-[100px] opacity-40",
                        "transition-colors duration-700",
                        theme.glow
                    )} />

                    <div className="relative z-10 h-full flex flex-col justify-center p-4 xs:p-5 sm:p-8 md:p-12 lg:p-14 max-w-2xl">
                        <div className={cn(
                            "inline-flex items-center gap-2 w-fit mb-3 sm:mb-4",
                            "transition-all duration-500",
                            isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                        )}>
                            <Badge className={cn(
                                "px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r text-white shadow-lg",
                                theme.badge
                            )}>
                                <Sparkles className="size-3 sm:size-3.5 mr-1 sm:mr-1.5" />
                                {current.badge}
                            </Badge>
                            {discount > 0 && (
                                <Badge className="px-2 sm:px-3 py-1 sm:py-1.5 bg-rose-500/90 text-white shadow-lg text-xs sm:text-sm">
                                    <Percent className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
                                    {discount}% OFF
                                </Badge>
                            )}
                        </div>

                        <p className={cn(
                            "text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest mb-1 sm:mb-2",
                            "transition-all duration-500 delay-100",
                            theme.text,
                            isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                        )}>
                            {current.subtitle}
                        </p>

                        <h2 className={cn(
                            "text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4",
                            "leading-tight",
                            "transition-all duration-500 delay-150",
                            isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                        )}>
                            {current.title}
                        </h2>

                        <p className={cn(
                            "text-gray-300 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3",
                            "transition-all duration-500 delay-200",
                            isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                        )}>
                            {current.description}
                        </p>

                        <div className={cn(
                            "flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6",
                            "transition-all duration-500 delay-250",
                            isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                        )}>
                            <span className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white">
                                {currency(current.price)}
                            </span>
                            {current.originalPrice && (
                                <span className="text-sm sm:text-lg text-gray-400 line-through">
                                    {currency(current.originalPrice)}
                                </span>
                            )}
                        </div>

                        <div className={cn(
                            "flex flex-wrap gap-2 sm:gap-3",
                            "transition-all duration-500 delay-300",
                            isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                        )}>
                            <Button
                                size="default"
                                className={cn(
                                    "rounded-full px-4 sm:px-6 md:px-8 gap-1.5 sm:gap-2 text-white shadow-xl text-sm sm:text-base",
                                    "bg-gradient-to-r hover:opacity-90 transition-all",
                                    "hover:scale-105 hover:shadow-2xl",
                                    theme.accent
                                )}
                            >
                                <ShoppingBag className="size-4 sm:size-5" />
                                Shop Now
                            </Button>
                            <Button
                                size="default"
                                variant="secondary"
                                className="rounded-full px-4 sm:px-6 md:px-8 gap-1.5 sm:gap-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0 text-sm sm:text-base"
                            >
                                Learn More
                                <ArrowRight className="size-3.5 sm:size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2 sm:gap-3">
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                            className="size-10 sm:size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
                        >
                            <ChevronLeft className="size-5 sm:size-6" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                            className="size-10 sm:size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
                        >
                            <ChevronRight className="size-5 sm:size-6" />
                        </Button>
                    </div>

                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
                        {displaySlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                className={cn(
                                    "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                                    index === currentSlide
                                        ? "w-6 sm:w-8 bg-white"
                                        : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>

                    {autoPlay && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-white/10">
                            <div
                                className={cn(
                                    "h-full bg-gradient-to-r transition-all duration-100",
                                    theme.accent
                                )}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
