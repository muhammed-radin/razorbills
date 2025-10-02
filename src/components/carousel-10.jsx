import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
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
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
      <Carousel 
        setApi={setApi} 
        className="w-full" 
        opts={{ loop: true }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {Array.from({ length: 30 }).map((_, index) => (
            <CarouselItem 
              key={index} 
              className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <CardProduct 
                className={cn(
                  "transition-all duration-500",
                  {
                    "scale-95 opacity-90": index !== current - 1
                  }
                )} 
                title="Demo" 
                description="A headset is a combination of headphone and microphone. Headsets connect over a telephone or to a computer, allowing the user to speak and listen while keeping " 
                rating={2} 
                price={100} 
                thumbnail={'/products/Headphone.jpg'} 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
