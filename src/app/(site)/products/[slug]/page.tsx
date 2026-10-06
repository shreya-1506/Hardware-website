import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Layers,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";

import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductStickyCta } from "@/components/site/ProductStickyCta";
import { SpecTable } from "@/components/site/SpecTable";
import { ButtonAnchor } from "@/components/ui/Button";
import { CaliperGlyph, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { site } from "@/lib/site";
import { formatPhone, imageSrc, telHref, truncate } from "@/lib/utils";
import { productWhatsAppUrl } from "@/lib/whatsapp";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const title =
    product.meta_title ||
    `${product.name}${product.brand_name ? ` — ${product.brand_name}` : ""}`;

  const description =
    product.meta_description ||
    truncate(
      `${product.short_description} Supplied by ${site.name} & ${site.partner}, ${
        product.category_name ?? "industrial products"
      } suppliers in MIDC Shiroli, Kolhapur.`,
      300,
    );

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/products/${product.slug}`,
      images: [{ url: imageSrc(product.image), alt: product.name }],
    },
  };
}

/**
 * Rendered per request: the catalogue lives in SQLite and the admin panel edits
 * it at runtime, so a build-time snapshot would keep serving withdrawn products.
 */
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const whatsappUrl = productWhatsAppUrl({
    name: product.name,
    brand: product.brand_name,
    category: product.category_name,
    sku: product.sku,
    slug: product.slug,
  });

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description,
    sku: product.sku || undefined,
    image: [`${site.url}${imageSrc(product.image)}`],
    brand: product.brand_name
      ? { "@type": "Brand", name: product.brand_name }
      : undefined,
    category: product.category_name ?? undefined,
    additionalProperty: product.specifications.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.name,
      value: spec.value,
    })),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      // Industrial pricing is quotation-based; price is shared on enquiry.
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        valueAddedTaxIncluded: false,
      },
      seller: {
        "@type": "Organization",
        name: `${site.name} & ${site.partner}`,
        telephone: `+91${site.contacts[0].phone}`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb strip */}
      <div className="border-b border-steel-200 bg-steel-50">
        <div className="container-x py-3.5">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-steel-500">
              <li>
                <Link href="/" className="transition hover:text-safety-600">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-steel-300" strokeWidth={2.4} />
                <Link
                  href="/products"
                  className="transition hover:text-safety-600"
                >
                  Products
                </Link>
              </li>
              {product.category_name && product.category_slug && (
                <li className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-steel-300" strokeWidth={2.4} />
                  <Link
                    href={`/categories/${product.category_slug}`}
                    className="transition hover:text-safety-600"
                  >
                    {product.category_name}
                  </Link>
                </li>
              )}
              <li className="flex min-w-0 items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-steel-300" strokeWidth={2.4} />
                <span className="truncate font-medium text-navy-800">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ------------------------------------------------- hero: image + buy */}
      <section className="bg-white py-10 lg:py-14">
        <div className="container-x">
          <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery
              name={product.name}
              image={product.image}
              gallery={product.gallery}
              sku={product.sku}
              featured={product.featured}
            />

            <Reveal direction="left">
              <div className="flex flex-wrap items-center gap-2">
                {product.brand_name && product.brand_slug && (
                  <Link
                    href={`/products?brand=${product.brand_slug}`}
                    className="inline-flex items-center gap-1.5 rounded border border-safety-200 bg-safety-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-safety-700 transition hover:bg-safety-100"
                  >
                    <Tag className="h-3 w-3" strokeWidth={2.6} />
                    {product.brand_name}
                  </Link>
                )}
                {product.category_name && product.category_slug && (
                  <Link
                    href={`/categories/${product.category_slug}`}
                    className="inline-flex items-center gap-1.5 rounded border border-steel-200 bg-steel-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-steel-600 transition hover:bg-steel-100"
                  >
                    <Layers className="h-3 w-3" strokeWidth={2.6} />
                    {product.category_name}
                  </Link>
                )}
              </div>

              <h1 className="mt-4 font-display text-[27px] font-bold leading-[1.15] text-navy-900 sm:text-[33px] lg:text-[38px]">
                {product.name}
              </h1>

              {product.sku && (
                <p className="mt-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-steel-500">
                  Product code: <span className="text-navy-800">{product.sku}</span>
                </p>
              )}

              {product.short_description && (
                <p className="mt-5 text-[15.5px] leading-relaxed text-steel-600">
                  {product.short_description}
                </p>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="mt-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-steel-500">
                    Available variants
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span
                        key={variant.name}
                        title={variant.detail}
                        className="inline-flex flex-col rounded-md border border-steel-200 bg-steel-50 px-3.5 py-2"
                      >
                        <span className="text-[13.5px] font-semibold text-navy-900">
                          {variant.name}
                        </span>
                        {variant.detail && (
                          <span className="text-[11.5px] text-steel-500">
                            {variant.detail}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary conversion block */}
              <div className="mt-8 rounded-lg border border-steel-200 bg-steel-50 p-5 shadow-card sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-safety-600">
                  Price on enquiry
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-steel-600">
                  Industrial pricing depends on quantity, grade and delivery.
                  Send an enquiry and{" "}
                  <span className="font-semibold text-navy-800">
                    {site.whatsapp.contactName}
                  </span>{" "}
                  will reply with price, availability and lead time.
                </p>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-[1.4fr_1fr]">
                  <ButtonAnchor
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    size="lg"
                    aria-label={`Enquire about ${product.name} on WhatsApp`}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Enquire / Buy on WhatsApp
                  </ButtonAnchor>

                  <ButtonAnchor
                    href={telHref(site.contacts[0].phone)}
                    variant="outline"
                    size="lg"
                  >
                    <Phone className="h-4 w-4" strokeWidth={2.4} />
                    Call now
                  </ButtonAnchor>
                </div>

                <p className="mt-3.5 text-[12.5px] text-steel-500">
                  Opens WhatsApp with this product&rsquo;s details already
                  filled in · {formatPhone(site.contacts[0].phone)}
                </p>
              </div>

              {/* Trust row */}
              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Genuine, brand-warranted stock" },
                  { icon: MessageSquareText, label: "Same-day enquiry response" },
                  { icon: Truck, label: "Delivery across Kolhapur belt" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="flex items-start gap-2.5 text-[12.5px] leading-snug text-steel-600"
                    >
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-safety-500"
                        strokeWidth={2.2}
                      />
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------- description / specs / apps */}
      <section className="border-t border-steel-200 bg-steel-50 py-14 lg:py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="min-w-0 space-y-12">
              {product.description && (
                <Reveal>
                  <h2 className="font-display text-[22px] font-bold text-navy-900 sm:text-[26px]">
                    Product Description
                  </h2>
                  <span aria-hidden className="tech-rule mt-4 block" />
                  <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-steel-600">
                    {product.description
                      .split(/\n{2,}/)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph.trim()}</p>
                      ))}
                  </div>
                </Reveal>
              )}

              {product.specifications.length > 0 && (
                <Reveal>
                  <h2 className="font-display text-[22px] font-bold text-navy-900 sm:text-[26px]">
                    Specifications
                  </h2>
                  <span aria-hidden className="tech-rule mt-4 block" />
                  <div className="mt-5">
                    <SpecTable specs={product.specifications} />
                  </div>
                  <p className="mt-3 text-[12.5px] text-steel-500">
                    Specifications are indicative. Confirm critical dimensions
                    and grades with us before ordering.
                  </p>
                </Reveal>
              )}

              {product.applications.length > 0 && (
                <Reveal>
                  <h2 className="font-display text-[22px] font-bold text-navy-900 sm:text-[26px]">
                    Applications
                  </h2>
                  <span aria-hidden className="tech-rule mt-4 block" />
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {product.applications.map((application) => (
                      <li
                        key={application}
                        className="flex items-start gap-3 rounded-md border border-steel-200 bg-white p-4 text-[14px] leading-relaxed text-steel-700 shadow-sm"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-safety-500"
                          strokeWidth={2.4}
                        />
                        {application}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              <CaliperGlyph aria-hidden className="h-8 w-40 text-steel-300" />
            </div>

            {/* Enquiry sidebar */}
            <div className="min-w-0 lg:sticky lg:top-[96px] lg:self-start">
              <Reveal direction="left">
                <div className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card">
                  <div className="relative bg-steel-sheen px-6 py-5 text-white">
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-blueprint bg-grid-sm opacity-50"
                    />
                    <p className="relative text-[11px] font-bold uppercase tracking-[0.14em] text-safety-400">
                      Product enquiry
                    </p>
                    <h2 className="relative mt-1.5 font-display text-[19px] font-bold">
                      Request a quotation
                    </h2>
                    <p className="relative mt-1.5 text-[13px] text-white/60">
                      For {product.name}
                    </p>
                  </div>

                  <div className="p-5 sm:p-6">
                    <EnquiryForm
                      defaultProduct={`${product.name}${product.sku ? ` (${product.sku})` : ""}`}
                      source={`Product: ${product.name}`}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="bg-white py-14 lg:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">
                  <span
                    aria-hidden
                    className="h-[2px] w-6 bg-current opacity-70"
                  />
                  You may also need
                </p>
                <h2 className="mt-3 font-display text-[24px] font-bold text-navy-900 sm:text-[28px]">
                  Related products
                </h2>
              </div>
              <Link
                href={
                  product.category_slug
                    ? `/categories/${product.category_slug}`
                    : "/products"
                }
                className="inline-flex h-11 items-center gap-2 rounded-md border border-steel-300 px-5 text-[13.5px] font-semibold text-navy-800 transition hover:border-navy-400 hover:bg-steel-50"
              >
                View more
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <RevealItem key={item.id} className="h-full">
                  <ProductCard product={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ------------------------------------------- big WhatsApp closer */}
      <section className="relative overflow-hidden bg-steel-sheen py-14 lg:py-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-blueprint bg-grid opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(100%_100%_at_75%_25%,rgba(249,112,8,0.16),transparent_55%)]"
        />

        <div className="container-x relative">
          <Reveal className="flex flex-col items-center gap-7 text-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/15">
              <Image
                src={imageSrc(product.image)}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="font-display text-[24px] font-bold text-white sm:text-[30px]">
                Ready to order {product.name}?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
                One tap opens WhatsApp with the product name, brand and code
                already written out. Add your quantity and send.
              </p>
            </div>

            <ButtonAnchor
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="px-8"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp — {formatPhone(site.contacts[0].phone)}
            </ButtonAnchor>
          </Reveal>
        </div>
      </section>

      <ProductStickyCta productName={product.name} whatsappUrl={whatsappUrl} />
    </>
  );
}
