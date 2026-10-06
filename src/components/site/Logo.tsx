import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Wordmark for the two partner firms. The monogram plate is drawn rather than
 * loaded as an image so it stays crisp at every size.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";

  return (
    <Link
      href="/"
      aria-label="Industrial Prime System and Vijay Enterprises — home"
      className={cn("group flex shrink-0 items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative grid h-11 w-11 place-items-center overflow-hidden rounded-[6px] transition-transform duration-300 group-hover:scale-[1.04]",
          light
            ? "bg-white text-navy-900"
            : "bg-steel-sheen text-white shadow-[0_6px_16px_-8px_rgba(13,31,55,0.7)]",
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-blueprint bg-grid-sm opacity-60"
        />
        <span className="relative font-display text-[15px] font-bold leading-none tracking-tight">
          IPS
        </span>
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-full bg-safety-500"
        />
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-bold tracking-tight sm:text-base",
            light ? "text-white" : "text-navy-900",
          )}
        >
          Industrial Prime System
        </span>
        <span
          className={cn(
            "mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
            light ? "text-white/60" : "text-steel-500",
          )}
        >
          &amp; Vijay Enterprises
        </span>
      </span>
    </Link>
  );
}
