import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FolderOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { api } from "@/utils/api";
import HeroSection from "./components/HeroSection";
import CategoryShowcase from "./components/CategoryShowcase";
import FeaturedProducts from "./components/FeaturedProducts";
import OfferSection from "./components/OfferSection";
import WhyRazorbills from "./components/WhyRazorbills";
import RecommendationSection from "./components/RecommendationSection";
import ServiceHighlights from "./components/ServiceHighlights";
import MobileBottomNav, { DesktopSpacer } from "./components/MobileBottomNav";
import { ProductRail } from "./components/FeaturedProducts";
import { SectionHeading, Reveal } from "./components/Reveal";
import { useCartStore, useWishlistStore } from "@/stores/shop";

// Normalize a raw API product into the shape homepage components expect.
// Returns null when the record is missing the essentials (no placeholder filling).
function normalize(p) {
  if (!p) return null;
  const id = p.id || p._id || p.productId;
  const thumbnail = p.thumbnail || p.image || (Array.isArray(p.images) ? p.images[0] : null);
  if (!id || !p.title || thumbnail == null || p.price == null) return null;
  const metrics = p.metrics || p.meterics || {};
  return {
    id,
    productId: p.productId || p.id || p._id,
    title: p.title,
    price: Number(p.price),
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
    thumbnail,
    image: p.image || thumbnail,
    category: p.category || null,
    brand: p.brand || null,
    rating: Number(p.rating ?? metrics.rating ?? 0) || 0,
    reviews: Number(p.reviews ?? metrics.reviewCount ?? 0) || 0,
    stock: p.stock ?? 0,
    badge: p.badge || (p.specialInfo?.featured ? "Featured" : null),
  };
}

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    useCartStore.getState().fetch().catch(() => {});
    useWishlistStore.getState().fetch().catch(() => {});
  }, []);

  useEffect(() => {
    let live = true;
    Promise.allSettled([
      api.client.get("/api/products/feed"),
      api.client.get("/api/categories?limit=12"),
    ]).then(([feed, cats]) => {
      if (!live) return;
      if (feed.status === "fulfilled") {
        const d = feed.value.data || {};
        const l = d.latest || d.products || [];
        const f = d.featured || [];
        setLatest(l.map(normalize).filter(Boolean));
        setFeatured(f.map(normalize).filter(Boolean));
      } else {
        setLoadError(true);
      }
      if (cats.status === "fulfilled") {
        const c = cats.value.data;
        const list = Array.isArray(c) ? c : c?.categories || [];
        setCategories(list.filter((x) => x && (x.name || x.id)));
      }
      setLoading(false);
    });
    const t = setTimeout(() => {
      if (live) setLoading(false);
    }, 8000);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, []);

  // Live data only — no placeholder products.
  const trending = useMemo(
    () => (featured.length ? featured : latest),
    [featured, latest]
  );
  const newArrivals = useMemo(() => latest, [latest]);
  const dealProduct = useMemo(() => {
    const discounted = trending.filter(
      (p) => p.originalPrice != null && p.originalPrice > p.price
    );
    const pool = discounted.length ? discounted : trending;
    return [...pool].sort(
      (a, b) => (b.originalPrice || b.price) - (a.originalPrice || a.price)
    )[0];
  }, [trending]);
  const hasProducts = latest.length > 0 || featured.length > 0;

  return (
    <div className="min-h-screen w-full bg-background text-foreground pb-[env(safe-area-inset-bottom)]">
      <Helmet>
        <title>Razorbills — Kerala&apos;s Electronics Store | Phones, Laptops, Components</title>
        <meta
          name="description"
          content="Shop genuine electronics in Kerala: ESP32, Arduino, phones, laptops, audio & gaming. 24h dispatch, GST invoice, 7-day returns."
        />
      </Helmet>

      <HeroSection featured={trending} loading={loading} />

      <CategoryShowcase categories={categories} loading={loading} />

      <FeaturedProducts products={trending} loading={loading} />

      {dealProduct && <OfferSection product={dealProduct} />}

      <WhyRazorbills />

      {/* New arrivals rail — only when the feed has items */}
      {(loading || newArrivals.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals this week"
            description="The freshest stock from our catalogue."
            action={
              <Button variant="outline" className="rounded-xl" asChild>
                <Link to="/search">Shop all <ArrowRight className="size-4" /></Link>
              </Button>
            }
          />
          <Reveal delay={100}>
            <ProductRail products={newArrivals.slice(0, 10)} loading={loading} />
          </Reveal>
        </section>
      )}

      {!loading && !hasProducts ? (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <Empty className="border rounded-3xl">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>{loadError ? "Couldn't load products" : "No products yet"}</EmptyTitle>
              <EmptyDescription>
                {loadError
                  ? "We couldn't reach the catalogue. Check your connection and try again."
                  : "Our catalogue is being stocked. Contact us and we'll arrange what you need."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              {loadError ? (
                <Button onClick={() => window.location.reload()}>Retry</Button>
              ) : (
                <Button asChild><Link to="/contact">Contact store</Link></Button>
              )}
              <Button variant="outline" asChild><Link to="/search">Browse search</Link></Button>
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        trending.length > 0 && <RecommendationSection products={trending} />
      )}

      <ServiceHighlights />
      <DesktopSpacer />
      <MobileBottomNav />
    </div>
  );
}
