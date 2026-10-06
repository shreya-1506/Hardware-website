import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/site/SectionHeading";
import type { Product } from "@/lib/types";
import { imageSrc } from "@/lib/utils";

/**
 * Continuous strip of catalogue imagery. The list is rendered twice so the CSS
 * marquee can loop seamlessly at -50%.
 */
export function ProductShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const strip = [...products, ...products];

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Industrial product showcase"
          title="A look across the shelves"
          intro="Adhesives, abrasives, tooling, safety gear, lifting tackle and precision instruments — a sample of what moves through our counter every week."
          align="center"
        />
      </div>

      <div
        className="edge-fade group relative mt-12 flex w-full overflow-hidden"
        aria-hidden="true"
      >
        <div className="flex shrink-0 animate-marquee gap-4 pr-4 group-hover:[animation-play-state:paused]">
          {strip.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              href={`/products/${product.slug}`}
              tabIndex={-1}
              className="relative w-[220px] shrink-0 overflow-hidden rounded-lg border border-steel-200 bg-steel-50 shadow-sm transition-shadow hover:shadow-card-hover sm:w-[260px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={imageSrc(product.image)}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="border-t border-steel-200 bg-white px-4 py-3">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-safety-600">
                  {product.category_name ?? "Industrial"}
                </p>
                <p className="mt-1 truncate text-[13.5px] font-semibold text-navy-900">
                  {product.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container-x mt-10 text-center">
        <Link
          href="/products"
          className="inline-flex h-12 items-center gap-2 rounded-md bg-navy-800 px-6 text-[14px] font-semibold text-white transition hover:bg-navy-700"
        >
          Browse the full catalogue
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
