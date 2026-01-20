import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";

export default function HeroVisual({ children }) {
    return (

        <div className="relative flex items-center justify-center lg:justify-end hero-animate-fade-in hero-delay-200">
            <div className="relative w-full max-w-lg lg:max-w-xl">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 blur-2xl animate-pulse" />

                {/* Main card container */}
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
                    {/* Product showcase grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Featured product cards */}
                        <div className="group col-span-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 sm:p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg sm:text-xl">Microcontrollers</h3>
                                    <p className="text-muted-foreground text-sm">Arduino, ESP32 & more</p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-muted/50 rounded-2xl p-4 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/30 flex items-center justify-center mb-3">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                            </div>
                            <h4 className="font-semibold text-sm sm:text-base">LEDs</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">All colors & sizes</p>
                        </div>

                        <div className="group bg-muted/50 rounded-2xl p-4 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/30 flex items-center justify-center mb-3">
                                <div className="w-6 h-2 sm:w-8 sm:h-2 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 rounded-full" />
                            </div>
                            <h4 className="font-semibold text-sm sm:text-base">Resistors</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">All values available</p>
                        </div>

                        <div className="group bg-muted/50 rounded-2xl p-4 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/30 flex items-center justify-center mb-3">
                                <div className="w-4 h-6 sm:w-5 sm:h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm" />
                            </div>
                            <h4 className="font-semibold text-sm sm:text-base">Capacitors</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">Ceramic & Electrolytic</p>
                        </div>

                        <div className="group bg-muted/50 rounded-2xl p-4 hover:bg-muted transition-colors duration-300 cursor-pointer">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/30 flex items-center justify-center mb-3">
                                <div className="w-5 h-3 sm:w-6 sm:h-4 border-2 border-foreground/60 rounded-sm flex items-center justify-center">
                                    <div className="w-1 h-1 bg-foreground/60 rounded-full" />
                                </div>
                            </div>
                            <h4 className="font-semibold text-sm sm:text-base">Sensors</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">Temperature, Motion & more</p>
                        </div>
                    </div>

                    {/* Stats bar */}
                    <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-primary">500+</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Products</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-primary">24h</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Delivery</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-primary">4.9★</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function HeroImage({ src, alt = "Hero Image" }) {
    return (
        <div className="relative w-full max-w-lg lg:max-w-xl hero-animate-fade-in hero-delay-200">
            <img
                src={src}
                alt={alt}
                className="w-full h-auto rounded-3xl shadow-2xl"
            />
        </div>
    );
}