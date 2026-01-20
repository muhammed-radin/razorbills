import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";

export default function HeroVisual({ children }) {
    return (

        <div className="relative flex items-center justify-center lg:justify-end hero-animate-fade-in hero-delay-200">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 blur-2xl sm:blur-3xl animate-pulse" />

                {/* Main card container */}
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 shadow-xl sm:shadow-2xl">
                    {/* Product showcase grid */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
                        {/* Featured product cards */}
                        <div className="group col-span-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl truncate">Microcontrollers</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg truncate">Arduino, ESP32 & more</p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-muted/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-md sm:rounded-lg bg-accent/30 flex items-center justify-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-red-500 shadow-md sm:shadow-lg shadow-red-500/50" />
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl truncate">LEDs</h4>
                            <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm lg:text-base truncate">All colors & sizes</p>
                        </div>

                        <div className="group bg-muted/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-md sm:rounded-lg bg-accent/30 flex items-center justify-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                                <div className="w-5 h-1.5 sm:w-6 sm:h-2 md:w-8 md:h-2 lg:w-10 lg:h-2.5 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 rounded-full" />
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl truncate">Resistors</h4>
                            <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm lg:text-base truncate">All values available</p>
                        </div>

                        <div className="group bg-muted/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-md sm:rounded-lg bg-accent/30 flex items-center justify-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                                <div className="w-3 h-5 sm:w-4 sm:h-6 md:w-5 md:h-8 lg:w-6 lg:h-10 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm" />
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl truncate">Capacitors</h4>
                            <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm lg:text-base truncate">Ceramic & Electrolytic</p>
                        </div>

                        <div className="group bg-muted/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-md sm:rounded-lg bg-accent/30 flex items-center justify-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                                <div className="w-4 h-2.5 sm:w-5 sm:h-3 md:w-6 md:h-4 lg:w-7 lg:h-5 border-2 border-foreground/60 rounded-sm flex items-center justify-center">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-foreground/60 rounded-full" />
                                </div>
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl truncate">Sensors</h4>
                            <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm lg:text-base truncate">Temperature, Motion & more</p>
                        </div>
                    </div>

                    {/* Stats bar */}
                    <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 pt-4 sm:pt-5 md:pt-6 lg:pt-7 border-t border-border/50 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-center">
                        <div>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">500+</p>
                            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground">Products</p>
                        </div>
                        <div>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">24h</p>
                            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground">Delivery</p>
                        </div>
                        <div>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">4.9★</p>
                            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground">Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function HeroImage({ src, alt = "Hero Image" }) {
    return (
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl hero-animate-fade-in hero-delay-200">
            <img
                src={src}
                alt={alt}
                className="w-full h-auto rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl"
            />
        </div>
    );
}