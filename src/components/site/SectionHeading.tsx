import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Consistent eyebrow + title + intro block used by every homepage section. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  action?: ReactNode;
  className?: string;
}) {
  const light = tone === "light";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && (
          <p className={light ? "eyebrow-light" : "eyebrow"}>
            <span
              aria-hidden
              className="h-[2px] w-6 bg-current opacity-70"
            />
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "mt-3 font-display text-[27px] font-bold leading-[1.15] sm:text-[32px] lg:text-[38px]",
            light ? "text-white" : "text-navy-900",
          )}
        >
          {title}
        </h2>
        {intro && (
          <p
            className={cn(
              "mt-4 text-[15px] leading-relaxed sm:text-base",
              light ? "text-white/65" : "text-steel-600",
            )}
          >
            {intro}
          </p>
        )}
      </Reveal>

      {action && (
        <Reveal delay={0.1} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
