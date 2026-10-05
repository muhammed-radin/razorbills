import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BadgePercent, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "./Reveal";
import { currency } from "@/utils/currency";

function useCountdown(hours = 26) {
  const [end] = useState(() => Date.now() + hours * 3600 * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  return {
    hh: String(Math.floor(s / 3600)).padStart(2, "0"),
    mm: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    ss: String(s % 60).padStart(2, "0"),
  };
}

// Renders the biggest live discount from the catalogue. Nothing to show → nothing rendered.
export default function OfferSection({ product }) {
  const { t } = useTranslation();
  const { hh, mm, ss } = useCountdown(31);
  if (!product) return null;
  const deal = product;
  const savings =
    deal.originalPrice != null && deal.originalPrice > deal.price
      ? deal.originalPrice - deal.price
      : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b0f1a] text-white">
          <div className="absolute -top-20 left-1/4 size-72 rounded-full bg-violet-600/40 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 right-10 size-72 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.15] hero-grid-pattern invert" />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:p-14 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-400 text-black hover:bg-amber-400 border-0">
                  <BadgePercent className="size-3.5 mr-1" /> {t("homepage.offer.badge")}
                </Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                  <Timer className="size-3.5" /> {t("homepage.offer.endsIn")} {hh}:{mm}:{ss}
                </span>
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05]">
                {t("homepage.offer.titleA")}
                <span className="block text-white/60">{t("homepage.offer.titleB")}</span>
              </h2>
              <p className="mt-3 max-w-md text-sm sm:text-base text-white/70">
                {t("homepage.offer.description")}
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold">{currency(deal.price)}</span>
                {deal.originalPrice != null && (
                  <span className="text-white/50 line-through">{currency(deal.originalPrice)}</span>
                )}
                {savings > 0 && (
                  <Badge variant="secondary" className="bg-emerald-400/15 text-emerald-300 border-emerald-300/20">
                    {t("homepage.offer.save", { amount: currency(savings) })}
                  </Badge>
                )}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="rounded-2xl bg-white text-black hover:bg-white/90" asChild>
                  <Link to={`/product/${deal.id}`}>
                    {t("homepage.offer.grab")} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
                  <Link to="/search">{t("homepage.offer.allOffers")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-6 rounded-[1.6rem] bg-gradient-to-br from-violet-500/40 to-emerald-400/30 blur-2xl" />
              <img
                src={deal.thumbnail}
                alt={deal.title}
                className="relative w-full aspect-[4/3] object-cover rounded-[1.6rem] border border-white/15 shadow-2xl animate-[hero-float_6s_ease-in-out_infinite]"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/55 backdrop-blur px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{deal.title}</p>
                  <p className="text-xs text-white/60">{t("homepage.offer.freeDelivery")}</p>
                </div>
                <div className="flex gap-1.5 text-center">
                  {[[hh, t("homepage.offer.hrs")], [mm, t("homepage.offer.min")], [ss, t("homepage.offer.sec")]].map(([v, l]) => (
                    <div key={l} className="rounded-xl bg-white/10 px-2.5 py-1.5 border border-white/10">
                      <p className="text-sm font-extrabold tabular-nums">{v}</p>
                      <p className="text-[10px] text-white/60">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
