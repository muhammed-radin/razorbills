import React, { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import FeaturedCard from "./featured-card";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";

const defaultProducts = [];

export default memo(function FeaturedCarousel({
  products,
  title = "Featured Collection",
  showTitle = true,
  className,
}) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const displayProducts = products || defaultProducts;

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      className={cn(
        "relative w-full py-6 sm:py-8 md:py-12 my-2 sm:my-4 overflow-hidden max-w-7xl mx-auto",
        className,
      )}
    >
      {/* Section Header */}
      {showTitle && (
        <header className="max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto mb-6 sm:mb-8 px-2">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                  <Crown className="size-4 sm:size-5 md:size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    {title}
                  </h2>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground hidden xs:block">
                    Handpicked premium products for you
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Dots - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1.5">
              {Array.from({ length: Math.min(count, 8) }).map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2.5 p-0 rounded-full transition-all duration-300",
                    current === index + 1
                      ? "w-8 bg-primary hover:bg-primary"
                      : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                  )}
                />
              ))}
            </nav>
          </div>
        </header>
      )}

      {/* Carousel */}
      <div className="relative max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto">
        <Carousel
          setApi={setApi}
          className="w-full touch-pan-y"
          opts={{
            loop: true,
            align: "start",
            dragFree: true,
            skipSnaps: true,
            duration: 25,
            containScroll: "trimSnaps",
            inViewThreshold: 0.7,
          }}
        >
          <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-5 lg:-ml-6 [&>*]:transition-transform [&>*]:duration-300 [&>*]:ease-out">
            {displayProducts.map((product, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "pl-3 sm:pl-4 md:pl-5 lg:pl-6",
                  "basis-[88%] xs:basis-[80%] sm:basis-[57%] md:basis-[45%] lg:basis-[36%] xl:basis-[30%]",
                  "will-change-transform",
                )}
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <FeaturedCard
                  {...product}
                  productId={product.id} // Ensure each product has a unique ID
                  className={cn(
                    "transition-all duration-300 ease-out",
                    "transform-gpu",
                    current === index + 1
                      ? "scale-100 opacity-100"
                      : "scale-[0.98] opacity-90 hover:opacity-100 hover:scale-[0.99]",
                  )}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <CarouselPrevious
            className={cn(
              "hidden lg:flex",
              "absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2",
              "size-12 xl:size-14 rounded-full",
              "bg-background/95 backdrop-blur-md",
              "border-2 border-primary/20 shadow-xl",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "hover:shadow-2xl hover:scale-110",
              "transition-all duration-300",
            )}
          />
          <CarouselNext
            className={cn(
              "hidden lg:flex",
              "absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2",
              "size-12 xl:size-14 rounded-full",
              "bg-background/95 backdrop-blur-md",
              "border-2 border-primary/20 shadow-xl",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "hover:shadow-2xl hover:scale-110",
              "transition-all duration-300",
            )}
          />
        </Carousel>

        {/* Mobile Dot Indicators - Simple dots instead of buttons */}
        <div className="flex md:hidden justify-center items-center gap-1.5 mt-4 px-4">
          {Array.from({ length: Math.min(count, 6) }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                current === index + 1
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/30",
              )}
            />
          ))}
          {count > 6 && (
            <span className="text-xs text-muted-foreground ml-1">
              +{count - 6}
            </span>
          )}
        </div>
      </div>
    </section>
  );
});
