import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/icons";
import type { Product } from "@/lib/types";
import { cn, imageSrc } from "@/lib/utils";
import { productWhatsAppUrl } from "@/lib/whatsapp";

type ProductCardProps = {
  product: Product;
  className?: string;
  /** First few cards on a page skip lazy loading for a faster LCP. */
  priority?: boolean;
};

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  const whatsappUrl = productWhatsAppUrl({
    name: product.name,
    brand: product.brand_name,
    category: product.category_name,
    sku: product.sku,
    slug: product.slug,
  });

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-steel-300 hover:shadow-card-hover",
        className,
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-steel-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={imageSrc(product.image)}
          alt={`${product.name}${product.brand_name ? ` — ${product.brand_name}` : ""}`}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 24vw"
          priority={priority}
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
        />

        {product.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-safety-500 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            <Star className="h-3 w-3 fill-current" strokeWidth={0} />
            Featured
          </span>
        )}

        {product.sku && (
          <span className="absolute right-3 top-3 rounded bg-white/92 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-700 backdrop-blur-sm">
            {product.sku}
          </span>
        )}

        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-safety-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.1em]">
          {product.brand_name && (
            <span className="text-safety-600">{product.brand_name}</span>
          )}
          {product.brand_name && product.category_name && (
            <span aria-hidden className="text-steel-300">
              /
            </span>
          )}
          {product.category_name && (
            <span className="text-steel-500">{product.category_name}</span>
          )}
        </div>

        <h3 className="mt-2 font-display text-[16px] font-bold leading-snug text-navy-900 sm:text-[17px]">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-safety-600 focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>

        {product.short_description && (
          <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-steel-600">
            {product.short_description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-steel-300 px-3 text-[13px] font-semibold text-navy-800 transition hover:border-navy-400 hover:bg-steel-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2"
          >
            View Details
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#1FA855] px-3 text-[13px] font-semibold text-white transition hover:bg-[#178c46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}

/** Loading placeholder that matches the card's real proportions. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="skeleton h-10 rounded-md" />
          <div className="skeleton h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
