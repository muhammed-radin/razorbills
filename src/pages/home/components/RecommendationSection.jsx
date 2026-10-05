import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, GraduationCap, Wrench, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, SectionHeading } from "./Reveal";
import ProductCard from "./ProductCard";

export default function RecommendationSection({ products }) {
  const { t } = useTranslation();
  const [persona, setPersona] = useState("makers");

  const personas = [
    { id: "students", label: t("homepage.recommend.students"), icon: GraduationCap, hint: t("homepage.recommend.studentsHint") },
    { id: "makers", label: t("homepage.recommend.makers"), icon: Wrench, hint: t("homepage.recommend.makersHint") },
    { id: "home", label: t("homepage.recommend.home"), icon: Building2, hint: t("homepage.recommend.homeHint") },
  ];

  const picks = useMemo(() => {
    if (!products?.length) return { hero: null, rest: [] };
    let filtered = products;
    if (persona === "students") filtered = products.filter((p) => p.price < 2500);
    if (persona === "makers") filtered = products.filter((p) => /arduino|esp|raspberry|sensor|cpu|component|board|module/i.test(`${p.title} ${p.category}`));
    if (persona === "home") filtered = products.filter((p) => /audio|phone|laptop|smart|speaker|watch/i.test(`${p.title} ${p.category}`));
    if (!filtered.length) filtered = products;
    return { hero: filtered[0], rest: filtered.slice(1, 5) };
  }, [products, persona]);

  if (!products?.length || !picks.hero) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <SectionHeading
        eyebrow={t("homepage.recommend.eyebrow")}
        title={t("homepage.recommend.title")}
        description={t("homepage.recommend.description")}
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5" /> {t("homepage.recommend.livePicks")}
            </span>
          </div>
        }
      />

      <Reveal delay={80}>
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`rounded-2xl border p-3 sm:p-4 text-left transition-all duration-300 ${
                persona === p.id
                  ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                  : "bg-card hover:border-primary/40 hover:-translate-y-0.5"
              }`}
            >
              <p.icon className="size-5" />
              <p className="mt-2 text-sm font-bold">{p.label}</p>
              <p className={`text-[11px] sm:text-xs ${persona === p.id ? "opacity-80" : "text-muted-foreground"}`}>{p.hint}</p>
            </button>
          ))}
        </div>
      </Reveal>

      {picks.hero && (
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border bg-[#101828] text-white min-h-[320px] flex flex-col justify-end">
              <img src={picks.hero.thumbnail || picks.hero.image} alt={picks.hero.title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative p-5 sm:p-6">
                <Badge className="bg-white text-black hover:bg-white border-0">
                  <Sparkles className="size-3 mr-1" /> {t("homepage.recommend.topMatch", { persona: personas.find((p) => p.id === persona)?.label })}
                </Badge>
                <h3 className="mt-3 text-xl sm:text-2xl font-extrabold leading-tight line-clamp-2">{picks.hero.title}</h3>
                <Button className="mt-4 rounded-xl w-full sm:w-auto" asChild>
                  <Link to={`/product/${picks.hero.id || picks.hero.productId}`} className="inline-flex items-center justify-center gap-2">{t("homepage.recommend.shopPick")} <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {picks.rest.map((p, i) => (
              <ProductCard key={p.id || i} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
