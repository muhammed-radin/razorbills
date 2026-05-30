import { useState } from "react";
import {
  Package,
  Shield,
  MapPin,
  Zap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RazorbillsAbout() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-black/10 dark:text-gray-100">
      {/* Header*/}
      <div className="relative overflow-hidden border-b dark:border-neutral-700">
        <div className="absolute inset-0"></div>

        <div className="relative max-w-7xl  mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 dark:text-white">
              About Us
            </h1>

            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl leading-relaxed dark:text-gray-300">
                Industrial-grade electronic components for engineers, makers,
                startups, and institutions.
              </p>
              <div className="flex items-center justify-center gap-3 text-amber-600">
                <MapPin className="w-5 h-5" />
                <span className=" font-medium">
                  India · Nationwide Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative border-b dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 dark:text-white">
                Built on a Simple Idea
              </h2>
              <p className="text-xl leading-relaxed mb-4 dark:text-gray-300">
                Make high-quality electronics components more{" "}
                <span className="text-amber-600 font-semibold">
                  accessible and affordable
                </span>
                .
              </p>
              <p className="leading-relaxed dark:text-gray-300">
                We noticed that many buyers faced high prices, unnecessary
                complexity, and unreliable sourcing when purchasing electronic
                parts. Our goal is to change that by offering a straightforward
                and transparent shopping experience.
              </p>
            </div>

            <div className="relative">
              <div className="relative border border-neutral-200 p-8 rounded-lg dark:border-neutral-700 dark:bg-black/10">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded dark:bg-amber-900/30">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 dark:text-white">
                        Industrial-Grade Quality
                      </h3>
                      <p className="text-sm dark:text-gray-300">
                        Sourced from reliable manufacturers and trusted supply
                        partners
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded dark:bg-amber-900/30">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 dark:text-white">
                        Quality Selection
                      </h3>
                      <p className="text-sm dark:text-gray-300">
                        Every product selected with performance in mind
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded dark:bg-amber-900/30">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1  dark:text-white">
                        Competitive Pricing
                      </h3>
                      <p className="text-sm  dark:text-gray-300">
                        Honest pricing with no hidden complications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="relative border-neutral-200 border-b dark:border-neutral-700">
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12 ">
            <h2 className="text-4xl font-bold  text-black dark:text-white">
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 ">
            {[
              {
                title: "Simple Store Experience",
                description:
                  "Clear product information without unnecessary complications",
                icon: Package,
              },
              {
                title: "Competitive Pricing",
                description: "Honest pricing with transparency at every step",
                icon: TrendingUp,
              },
              {
                title: "Clarity First",
                description:
                  "No unnecessary complications, just straight answers",
                icon: Zap,
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative bg-white border border-neutral-200 p-8 rounded-lg transition-all duration-300 dark:border-neutral-700 dark:bg-black/10 ${hoveredCard === idx ? "shadow-lg dark:shadow-amber-500/20" : ""}`}
                  style={{
                    transform:
                      hoveredCard === idx
                        ? "translateY(-8px)"
                        : "translateY(0)",
                    borderColor: hoveredCard === idx ? "#f59e0b" : "",
                  }}
                >
                  <div className="w-14 h-14 bg-amber-100 flex items-center justify-center mb-6 rounded dark:bg-amber-900/30">
                    <Icon className="w-7 h-7 text-amber-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-3  text-black dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed  text-neutral-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Trust */}
      <div className="relative border-neutral-200 border-b dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-neutral-50 border border-neutral-200 p-8 rounded-lg dark:bg-black/10 dark:border-neutral-700">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-neutral-200 border-b dark:border-neutral-700">
                    <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold  text-black dark:text-white">
                        Return Options
                      </div>
                      <div className="text-sm  text-neutral-600 dark:text-gray-300">
                        Quality assurance guaranteed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-4 border-neutral-200 border-b dark:border-neutral-700">
                    <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold  text-black dark:text-white">
                        Secure UPI Payments
                      </div>
                      <div className="text-sm  text-neutral-600 dark:text-gray-300">
                        Safe & encrypted transactions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-4 border-neutral-200 border-b dark:border-neutral-700">
                    <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold  text-black dark:text-white">
                        COD Coming Soon
                      </div>
                      <div className="text-sm  text-neutral-600 dark:text-gray-300">
                        Cash on Delivery option launching
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold  text-black dark:text-white">
                        Dedicated Support
                      </div>
                      <div className="text-sm  text-neutral-600 dark:text-gray-300">
                        Always available to assist
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-4xl font-bold mb-6  text-black dark:text-white">
                Customer Trust Matters
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-6  text-neutral-700 dark:text-gray-300">
                We build relationships through reliability, transparency, and
                responsive support.
              </p>
              <p className="leading-relaxed  text-neutral-600 dark:text-gray-300">
                Our support team is always available to assist you with your
                orders and questions. We're here to ensure your experience with
                Razorbills is smooth from start to finish.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement Banner */}
      <div className="relative overflow-hidden bg-neutral-100 dark:bg-black/10">
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl md:text-4xl font-bold mb-6 max-w-4xl mx-auto leading-tight  text-black dark:text-white">
            Supporting Innovation by Making Electronics Components Easier to
            Find, Easier to Buy, and Easier to Trust
          </h2>
          <div className="flex items-center justify-center gap-3 text-amber-600  font-medium">
            <span>BUILD WITH CONFIDENCE</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative border-neutral-200 border-t dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xl font-bold mb-2  text-black dark:text-white">
                Ready to Build Your Next Project?
              </div>
              <p className=" text-neutral-600 dark:text-gray-300">
                Thank you for choosing Razorbills.
              </p>
            </div>
            <Button className="transition-all duration-300  semibold">
              Explore Components
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
