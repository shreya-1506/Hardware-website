import type { Metadata } from "next";
import Link from "next/link";

import { BrandCard } from "@/components/site/BrandCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { listBrands, listProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Brands We Supply — ANABOND, BOSS, McCoy & Golden Bullet",
  description:
    "Authorised supply of ANABOND adhesives and sealants, BOSS hand tools and lifting equipment, McCoy adhesives and PU foams, and Golden Bullet cutting and grinding wheels in Kolhapur.",
  alternates: { canonical: "/brands" },
};

/**
 * Rendered per request: the catalogue lives in SQLite and the admin panel edits
 * it at runtime, so a build-time snapshot would keep serving withdrawn products.
 */
export const dynamic = "force-dynamic";

export default function BrandsPage() {
  const brands = listBrands({ activeOnly: true });

  return (
    <>
      <PageHeader
        eyebrow="Brands & partners"
        title="Industrial brands we stock and supply"
        crumbs={[{ label: "Brands" }]}
        intro="We supply established manufacturers whose products hold their specification on the shop floor — alongside a dependable general line for everyday requirements."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          {brands.length === 0 ? (
            <EmptyState
              title="No brands listed yet"
              body="Brand information has not been published yet. Tell us which brand you need and we will confirm availability."
              context="Brand enquiry"
            />
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {brands.map((brand) => (
                <RevealItem key={brand.id} className="h-full">
                  <BrandCard brand={brand} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      {/* Per-brand product strips */}
      {brands.map((brand) => {
        const products = listProducts({ brand: brand.slug, limit: 4 });
        if (products.length === 0) return null;

        return (
          <section
            key={brand.id}
            className="border-t border-steel-200 bg-steel-50 py-14 even:bg-white lg:py-16"
          >
            <div className="container-x">
              <SectionHeading
                eyebrow={brand.name}
                title={`${brand.name} products`}
                intro={brand.description}
                action={
                  <Link
                    href={`/products?brand=${brand.slug}`}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-steel-300 bg-white px-5 text-[13.5px] font-semibold text-navy-800 transition hover:border-navy-400"
                  >
                    All {brand.product_count ?? products.length} {brand.name}{" "}
                    items
                    <span aria-hidden>&rarr;</span>
                  </Link>
                }
              />

              <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <RevealItem key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>
        );
      })}

      <WhatsAppBanner
        title="Looking for a specific brand or grade?"
        body="Tell us the brand and part number you standardise on. If we do not hold it, we will tell you honestly and suggest an equivalent."
        context="Brand enquiry"
      />
    </>
  );
}
