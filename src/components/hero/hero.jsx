import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import HeroVisual, { HeroImage } from "./hero-visual";

const Hero1 = ({
  heading = "Power Your Innovation",
  subheading = "Premium Electronic Components",
  description = "Discover high-quality resistors, diodes, LEDs, sensors, and microcontrollers. Build your next project with confidence.",
  buttons = {
    primary: {
      text: "Shop Now",
      url: "/search",
    },
    secondary: {
      text: "Browse Categories",
      url: "/search",
    },
  },
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20 dark:to-accent/10">
      {/* Animated background elements - using transform for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles with transform positioning */}
        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ top: '5%', left: '2%' }} />
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] bg-accent/20 rounded-full blur-3xl animate-pulse hero-delay-1000" style={{ bottom: '5%', right: '2%' }} />
        <div className="absolute top-1/2 left-1/2 w-[50vw] sm:w-[45vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] max-w-[600px] h-[50vw] sm:h-[45vw] md:h-[40vw] lg:h-[35vw] xl:h-[30vw] max-h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse hero-delay-500" style={{ transform: 'translate(-50%, -50%)' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20 lg:grid-cols-2 items-center">
          {/* Content Section */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium hero-animate-fade-in">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Quality Electronics Store</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-tight hero-animate-slide-up">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                  {heading}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary hero-animate-slide-up hero-delay-100">
                {subheading}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-xl lg:max-w-2xl hero-animate-slide-up hero-delay-200 leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 w-full xs:w-auto sm:w-auto hero-animate-slide-up hero-delay-300 pt-2 sm:pt-3 md:pt-4">
              {buttons.primary && (
                <Button
                  asChild
                  size="lg"
                  className="group px-5 sm:px-6 md:px-7 lg:px-8 py-5 sm:py-6 md:py-6 lg:py-7 text-sm sm:text-base md:text-lg lg:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full xs:w-auto"
                >
                  <Link to={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              )}
              {buttons.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-5 sm:px-6 md:px-7 lg:px-8 py-5 sm:py-6 md:py-6 lg:py-7 text-sm sm:text-base md:text-lg lg:text-xl font-semibold hover:bg-accent/50 transition-all duration-300 hover:scale-105 w-full xs:w-auto"
                >
                  <Link to={buttons.secondary.url}>
                    {buttons.secondary.text}
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5 md:gap-6 lg:gap-7 pt-3 sm:pt-4 md:pt-5 lg:pt-6 hero-animate-fade-in hero-delay-500">
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary fill-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">Top Rated</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual Section */}
          <HeroVisual />

        </div>
      </div>
    </section>
  );
};

export { Hero1 };