import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AboutIntro } from "@/components/site/AboutIntro";
import { BrandCard } from "@/components/site/BrandCard";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ContactSection } from "@/components/site/ContactSection";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Hero } from "@/components/site/Hero";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GearGlyph } from "@/components/ui/icons";
import {
  countProducts,
  listBrands,
  listCategories,
  listProducts,
} from "@/lib/queries";
import { site } from "@/lib/site";

/**
 * Rendered per request: the catalogue lives in SQLite and the admin panel edits
 * it at runtime, so a build-time snapshot would keep serving withdrawn products.
 */
export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = listCategories({ activeOnly: true });
  const brands = listBrands({ activeOnly: true });
  const productCount = countProducts();

  const featured = listProducts({ featured: true, limit: 8 });
  // If nothing has been marked featured yet, fall back to the newest products
  // so the homepage is never empty.
  const showcaseFeatured =
    featured.length > 0 ? featured : listProducts({ limit: 8 });

  const showcase = listProducts({ limit: 12, sort: "newest" });

  return (
    <>
      <Hero
        productCount={productCount}
        brandNames={brands.map((brand) => brand.name)}
      />

      {/* ------------------------------------------------ categories */}
      <section className="relative bg-steel-50 py-16 lg:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-blueprint-light bg-grid opacity-60"
        />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Product categories"
            title="Everything an industrial store needs, organised by category"
            intro="Browse by category to find the exact grade, size or specification — then send a one-click WhatsApp enquiry."
            action={
              <Link
                href="/categories"
                className="group inline-flex h-12 items-center gap-2 rounded-md border border-steel-300 bg-white px-5 text-[14px] font-semibold text-navy-800 transition hover:border-navy-400"
              >
                All {categories.length} categories
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
            }
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category, index) => (
              <RevealItem key={category.id} className="h-full">
                <CategoryCard category={category} priority={index < 3} />
              </RevealItem>
            ))}
          </RevealGroup>

          {categories.length > 6 && (
            <Reveal delay={0.1} className="mt-6">
              <div className="flex flex-wrap gap-2.5">
                {categories.slice(6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-steel-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-navy-800 shadow-sm transition hover:border-safety-300 hover:text-safety-600"
                  >
                    {category.name}
                    <span className="text-[11px] tabular-nums text-steel-400">
                      {category.product_count ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ------------------------------------------ featured products */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured products"
            title="Fast-moving lines our customers order again and again"
            intro="Hand-picked items from across the catalogue. Every product page carries full specifications and a direct WhatsApp enquiry button."
            action={
              <Link
                href="/products"
                className="group inline-flex h-12 items-center gap-2 rounded-md bg-safety-500 px-5 text-[14px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,112,8,0.9)] transition hover:bg-safety-600"
              >
                View All Products
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
            }
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {showcaseFeatured.map((product, index) => (
              <RevealItem key={product.id} className="h-full">
                <ProductCard product={product} priority={index < 4} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* --------------------------------------------- trusted brands */}
      <section className="relative overflow-hidden bg-steel-50 py-16 lg:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-blueprint-light bg-grid opacity-60"
        />
        <GearGlyph
          aria-hidden
          className="pointer-events-none absolute -right-28 top-10 h-[320px] w-[320px] animate-spin-slow text-navy-900/[0.05]"
        />

        <div className="container-x relative">
          <SectionHeading
            eyebrow="Trusted brands"
            title="Brands we stock and supply"
            intro="We supply established industrial brands alongside a dependable general line — so you can specify with confidence."
            action={
              <Link
                href="/brands"
                className="group inline-flex h-12 items-center gap-2 rounded-md border border-steel-300 bg-white px-5 text-[14px] font-semibold text-navy-800 transition hover:border-navy-400"
              >
                All brands
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
            }
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <RevealItem key={brand.id} className="h-full">
                <BrandCard brand={brand} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <AboutIntro />
      <WhyChooseUs />
      <ProductShowcase products={showcase} />

      <WhatsAppBanner context="Homepage enquiry" />

      {/* ------------------------------------------------ enquiry form */}
      <section id="enquiry" className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">
                <span
                  aria-hidden
                  className="h-[2px] w-6 bg-current opacity-70"
                />
                Send an enquiry
              </p>
              <h2 className="mt-3 font-display text-[27px] font-bold leading-[1.15] text-navy-900 sm:text-[32px] lg:text-[36px]">
                Tell us what you need and we will quote it
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-steel-600">
                Fill in the form and our team will get back to you with price,
                availability and technical details. If you would rather talk
                straight away, use the WhatsApp button — the form contents come
                across with you.
              </p>

              <dl className="mt-8 space-y-5 border-l-2 border-steel-200 pl-6">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">
                    WhatsApp enquiries
                  </dt>
                  <dd className="mt-1 font-display text-[17px] font-bold text-navy-900">
                    {site.whatsapp.contactName} ·{" "}
                    {site.whatsapp.displayNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">
                    Counter address
                  </dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-steel-600">
                    {site.address.line1},
                    <br />
                    {site.address.line2}, {site.address.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">
                    Response time
                  </dt>
                  <dd className="mt-1 text-[14px] text-steel-600">
                    Same working day for enquiries received during business
                    hours.
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-lg border border-steel-200 bg-steel-50 p-6 shadow-card sm:p-8">
                <EnquiryForm source="Homepage" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
