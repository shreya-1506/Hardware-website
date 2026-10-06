import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Pagination } from "@/components/site/Pagination";
import { ProductCard } from "@/components/site/ProductCard";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  countProducts,
  getCategoryBySlug,
  listCategories,
  listProducts,
} from "@/lib/queries";
import { site } from "@/lib/site";
import { truncate } from "@/lib/utils";
import { categoryWhatsAppUrl } from "@/lib/whatsapp";

const PER_PAGE = 12;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} Suppliers in Kolhapur`,
    description: truncate(
      category.description ||
        `${category.name} supplied by ${site.name} & ${site.partner}, MIDC Shiroli, Kolhapur.`,
      300,
    ),
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

/**
 * Rendered per request: the catalogue lives in SQLite and the admin panel edits
 * it at runtime, so a build-time snapshot would keep serving withdrawn products.
 */
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const category = getCategoryBySlug(slug);
  if (!category || !category.active) notFound();

  const filters = { category: category.slug };
  const total = countProducts(filters);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageParam ?? 1) || 1), totalPages);

  const products = listProducts({
    ...filters,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    sort: "name",
  });

  const siblings = listCategories({ activeOnly: true }).filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={category.name}
        crumbs={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
        intro={category.description}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor
            href={categoryWhatsAppUrl(category.name)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="md"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Enquire about {category.name}
          </ButtonAnchor>
          <Link
            href={`/products?category=${category.slug}`}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-white/25 bg-white/[0.06] px-5 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10"
          >
            Search &amp; filter within this category
          </Link>
        </div>
      </PageHeader>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x">
          <p className="mb-8 text-[13.5px] font-semibold text-steel-600">
            {total} {total === 1 ? "product" : "products"} in {category.name}
          </p>

          {products.length === 0 ? (
            <EmptyState
              title={`No ${category.name} listed yet`}
              body={`We have not published our ${category.name.toLowerCase()} range online yet, but we do supply it. Send us your requirement and we will quote from counter stock.`}
              context={`Category: ${category.name}`}
            />
          ) : (
            <>
              <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <RevealItem key={product.id} className="h-full">
                    <ProductCard product={product} priority={index < 4} />
                  </RevealItem>
                ))}
              </RevealGroup>

              <Pagination
                page={page}
                totalPages={totalPages}
                basePath={`/categories/${category.slug}`}
                params={{}}
              />
            </>
          )}

          {/* Sibling categories */}
          {siblings.length > 0 && (
            <div className="mt-16 border-t border-steel-200 pt-10">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-steel-500">
                Other categories
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {siblings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/categories/${item.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-steel-200 bg-steel-50 px-4 py-2.5 text-[13.5px] font-semibold text-navy-800 transition hover:border-safety-300 hover:bg-white hover:text-safety-600"
                  >
                    {item.name}
                    <span className="text-[11px] tabular-nums text-steel-400">
                      {item.product_count ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <WhatsAppBanner
        title={`Need a ${category.name.replace(/s$/, "").toLowerCase()} we have not listed?`}
        body="Our counter range is wider than the online catalogue. Send us the specification, part number or a photo and we will confirm price and availability."
        context={`Category: ${category.name}`}
      />
    </>
  );
}
