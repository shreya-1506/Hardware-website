import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { GearGlyph } from "@/components/ui/icons";

export type Crumb = { label: string; href?: string };

/** Compact dark banner used at the top of every interior page. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-steel-sheen">
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint bg-grid opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(110%_80%_at_10%_0%,rgba(43,76,126,0.5),transparent_60%)]"
      />
      <GearGlyph
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-[320px] w-[320px] animate-spin-slow text-white/[0.06]"
      />

      <div className="container-x relative py-10 lg:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-white/50">
            <li>
              <Link href="/" className="transition hover:text-safety-400">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                <ChevronRight
                  className="h-3.5 w-3.5 text-white/25"
                  strokeWidth={2.4}
                />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition hover:text-safety-400"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-white/80">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <p className="eyebrow-light mt-6">
            <span aria-hidden className="h-[2px] w-6 bg-current opacity-70" />
            {eyebrow}
          </p>
        )}

        <h1 className="mt-3 max-w-3xl font-display text-[30px] font-bold leading-[1.12] text-white sm:text-[38px] lg:text-[44px]">
          {title}
        </h1>

        {intro && (
          <div className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
            {intro}
          </div>
        )}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
