import { Truck, ShieldCheck, RotateCcw, Headset, Wallet, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

export default function ServiceHighlights() {
  const { t } = useTranslation();
  const items = [
    { icon: Truck, title: t("homepage.services.deliveryTitle"), text: t("homepage.services.deliveryText") },
    { icon: Wallet, title: t("homepage.services.secureTitle"), text: t("homepage.services.secureText") },
    { icon: ShieldCheck, title: t("homepage.services.warrantyTitle"), text: t("homepage.services.warrantyText") },
    { icon: RotateCcw, title: t("homepage.services.returnsTitle"), text: t("homepage.services.returnsText") },
    { icon: Headset, title: t("homepage.services.supportTitle"), text: t("homepage.services.supportText") },
  ];

  return (
    <section className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Reveal>
          {/* Mobile: snap-scroll card strip · Desktop (lg): 5 columns, 1 row */}
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0">
            {items.map((s) => (
              <div
                key={s.title}
                className="min-w-[228px] snap-start rounded-3xl border bg-card p-4 shadow-sm lg:min-w-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md lg:bg-muted lg:text-foreground lg:shadow-none">
                    <s.icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-snug">{s.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.text}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground lg:hidden" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
