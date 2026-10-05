import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}) {
  return (
    <Reveal
      className={cn(
        "mb-8 sm:mb-10 flex flex-col gap-3",
        align === "center" && "items-center text-center"
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {eyebrow}
        </span>
      )}
      <div
        className={cn(
          "flex flex-col gap-3 md:flex-row md:items-end md:justify-between w-full",
          align === "center" && "md:flex-col md:items-center"
        )}
      >
        <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.1]">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  );
}
