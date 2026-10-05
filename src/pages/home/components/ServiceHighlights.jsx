import { Truck, ShieldCheck, RotateCcw, Headset, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "./Reveal";

const items = [
  { icon: Truck, title: "Fast Kerala delivery", text: "Same-day dispatch · 2–4 day statewide" },
  { icon: Wallet, title: "Secure payments", text: "UPI, cards, netbanking & COD" },
  { icon: ShieldCheck, title: "Warranty + GST bill", text: "Brand warranty on every product" },
  { icon: RotateCcw, title: "7-day returns", text: "No-question replacements" },
  { icon: Headset, title: "Malayalam support", text: "Chat & call, 9 AM – 9 PM" },
];

export default function ServiceHighlights() {
  return (
    <section className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-5">
            {items.map((s, i) => (
              <div key={s.title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-muted">
                  <s.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-tight">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{s.text}</p>
                </div>
                {i < items.length - 1 && <Separator orientation="vertical" className="ml-4 hidden md:block h-10" />}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
