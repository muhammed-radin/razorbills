import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  AtSign,
  Play,
  Share2,
  MapPin,
  Phone,
  Mail,
  Send,
  ShieldCheck,
  Truck,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Logo } from "../logo";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const columns = [
    {
      title: "Shop",
      links: [
        { title: "Phones", href: "/search?transform=phones" },
        { title: "Laptops", href: "/search?transform=laptops" },
        { title: "Audio", href: "/search?transform=audio" },
        { title: "Gaming", href: "/search?transform=gaming" },
        { title: "Components", href: "/search?transform=components" },
        { title: "All categories", href: "/categories" },
      ],
    },
    {
      title: t("footer.quickLinks"),
      links: [
        { title: t("footer.home"), href: "/" },
        { title: t("footer.wishlist"), href: "/wishlist" },
        { title: t("footer.cart"), href: "/cart" },
        { title: t("footer.profile"), href: "/settings" },
      ],
    },
    {
      title: t("footer.customerSupport"),
      links: [
        { title: t("footer.orderTracking"), href: "/order" },
        { title: t("footer.returnRefunds"), href: "/return" },
        { title: t("footer.shippingInfo"), href: "/shipping" },
        { title: t("footer.contactUs"), href: "/contact" },
      ],
    },
    {
      title: t("footer.companyInfo"),
      links: [
        { title: t("footer.aboutUs"), href: "/about" },
        { title: t("footer.privacyPolicy"), href: "/privacy" },
        { title: t("footer.termsConditions"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-muted/20 pb-20 md:pb-0">
      {/* Newsletter band */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 size-56 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <Badge className="rounded-full">Maker deals, weekly</Badge>
              <h3 className="mt-3 text-xl sm:text-2xl font-extrabold tracking-tight">
                Price drops & new stock alerts
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                One short email a week. No spam — just ESP32 restocks, audio deals and Kerala delivery updates.
              </p>
            </div>
            <form
              className="flex gap-2 rounded-2xl border bg-background p-2 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return toast.error("Enter a valid email");
                toast.success("Subscribed! Welcome to Razorbills.");
                setEmail("");
              }}
            >
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="rounded-xl shrink-0">
                <Send className="size-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Subscribe</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-10 md:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
            {t("footer.tagline")} Built for makers, students and families across Kerala.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2"><MapPin className="size-4" /> Kochi, Kerala, India</p>
            <p className="flex items-center gap-2"><Phone className="size-4" /> +91 98470 00000</p>
            <p className="flex items-center gap-2"><Mail className="size-4" /> care@razorbills.in</p>
          </div>
          <div className="mt-4 flex gap-2">
            {[
              { icon: AtSign, label: "Instagram" },
              { icon: Play, label: "YouTube" },
              { icon: Globe, label: "Website" },
              { icon: Share2, label: "Share" },
            ].map((s) => (
              <a
                key={s.label}
                aria-label={s.label}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid size-10 place-items-center rounded-2xl border bg-background transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["UPI", "Visa", "Mastercard", "COD", "GST invoice"].map((p) => (
              <Badge key={p} variant="secondary" className="rounded-full">{p}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h6 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{col.title}</h6>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.title}>
                    <Link
                      to={l.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="size-3 opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" />
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Truck className="size-3.5 text-emerald-600" /> 24h dispatch in Kerala</span>
          <span className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-600" /> 100% genuine stock</span>
          <span className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5"><BadgeCheck className="size-3.5 text-emerald-600" /> 7-day easy returns</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator className="mt-6" />
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} RazorBills. {t("footer.allRightsReserved")}</span>
          <span className="inline-flex items-center gap-3">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/shipping" className="hover:text-foreground">Shipping</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};
