import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import ProductCard from "./product-card/ProductCard";
import CardProduct from "./product-card";

export default function CarouselSlide() {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-[85%] w-[85%]">
      <Carousel setApi={setApi} className="w-full max-w-[90%] mx-2" opts={{ loop: true }}>
        <CarouselContent>
          {Array.from({ length: 30 }).map((_, index) => (
            <CarouselItem key={index} className="basis-[clamp(200px,20%,300px)]">
              <CardProduct className={cn("transition-all duration-500", {
                "scale-[0.9]": index !== current - 1
              })} title="Demo" description="A headset is a combination of headphone and microphone. Headsets connect over a telephone or to a computer, allowing the user to speak and listen while keeping " rating={2} price={100} thumbnail={'/products/Headphone.jpg'} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
