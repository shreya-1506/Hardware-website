import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Brands are shown as a typographic plate when no logo has been uploaded yet —
 * cleaner than a broken image, and the admin can add the real logo any time.
 */
export function BrandCard({
  brand,
  className,
}: {
  brand: Brand;
  className?: string;
}) {
  return (
    <Link
      href={`/products?brand=${brand.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-steel-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="relative grid h-32 place-items-center overflow-hidden border-b border-steel-200 bg-steel-50">
        <span
          aria-hidden
          className="absolute inset-0 bg-blueprint-light bg-grid-sm opacity-70"
        />
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={200}
            height={80}
            className="relative max-h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="relative font-display text-[24px] font-bold uppercase tracking-[0.06em] text-navy-800 transition-colors group-hover:text-safety-600 sm:text-[26px]">
            {brand.name}
          </span>
        )}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-safety-500 transition-transform duration-300 group-hover:scale-x-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[15.5px] font-bold text-navy-900">
            {brand.name}
          </h3>
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-steel-400">
            {brand.product_count ?? 0} items
          </span>
        </div>

        {brand.description && (
          <p className="mt-2.5 line-clamp-4 text-[13.5px] leading-relaxed text-steel-600">
            {brand.description}
          </p>
        )}

        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-safety-600">
          View {brand.name} products
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            strokeWidth={2.4}
          />
        </span>
      </div>
    </Link>
  );
}
