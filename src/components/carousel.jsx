import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import ProductCard from "./product-card/ProductCard";
import CardProduct from "./carousel-product-card";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function CarouselSlide({ title = "Featured Products", showTitle = true }) {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="relative w-full py-6 sm:py-10 md:py-14 my-3 max-w-7xl mx-auto overflow-hidden">

      {/* Section Header */}
      {showTitle && (
        <header className="max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto mb-6 sm:mb-8 px-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 sm:size-6 text-primary animate-pulse" />
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Discover our handpicked collection
              </p>
            </div>

            {/* Pagination Dots */}
            <nav className="hidden sm:flex items-center gap-1.5" aria-label="Carousel pagination">
              {Array.from({ length: Math.min(count, 10) }).map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 p-0 rounded-full transition-all duration-300",
                    current === index + 1
                      ? "w-6 bg-primary hover:bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </nav>
          </div>
        </header>
      )}

      {/* Carousel Container */}
      <div className="relative max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto">
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "pl-3 sm:pl-4",
                  // Responsive basis for proper card width
                  "basis-[85%] xs:basis-[70%] sm:basis-[45%] md:basis-[32%] lg:basis-[24%] xl:basis-[20%]"
                )}
              >
                <CardProduct
                  className={cn(
                    "transition-all duration-500 ease-out h-full",
                    current === index + 1
                      ? "scale-100 opacity-100"
                      : "scale-[0.98] opacity-90 hover:opacity-100 hover:scale-100"
                  )}
                  title="Premium Wireless Headphones"
                  description="Experience crystal-clear audio with active noise cancellation and premium build quality."
                  rating={4.5}
                  price={2499}
                  discount={index % 3 === 0 ? 20 : 0}
                  isNew={index === 0}
                  isTrending={index === 1 || index === 2}
                  stock={index === 3 ? false : true}
                  thumbnail="/products/Headphone.jpg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Desktop Navigation */}
          <CarouselPrevious
            className={cn(
              "hidden lg:flex",
              "absolute -left-3 xl:-left-5 top-1/2 -translate-y-1/2",
              "size-11 xl:size-12 rounded-full",
              "bg-background/95 backdrop-blur-md",
              "border border-border/50 shadow-lg",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "hover:shadow-xl hover:scale-105",
              "transition-all duration-300",
              "disabled:opacity-40"
            )}
          />

          <CarouselNext
            className={cn(
              "hidden lg:flex",
              "absolute -right-3 xl:-right-5 top-1/2 -translate-y-1/2",
              "size-11 xl:size-12 rounded-full",
              "bg-background/95 backdrop-blur-md",
              "border border-border/50 shadow-lg",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "hover:shadow-xl hover:scale-105",
              "transition-all duration-300",
              "disabled:opacity-40"
            )}
          />
        </Carousel>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden justify-center items-center gap-4 mt-5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
            className="size-10 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <ChevronLeft className="size-5" />
          </Button>

          {/* Mobile Progress */}
          <span className="text-sm text-muted-foreground font-medium tabular-nums">
            <span className="text-primary font-bold">{current}</span>
            <span className="mx-1">/</span>
            <span>{count}</span>
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
            className="size-10 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
