import type { Metadata } from "next";
import { Suspense } from "react";

import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Pagination } from "@/components/site/Pagination";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductFilters } from "@/components/site/ProductFilters";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  countProducts,
  listBrands,
  listCategories,
  listProducts,
  type ProductFilters as Filters,
} from "@/lib/queries";

const PER_PAGE = 12;

/*
 * This page sits in a (catalog) route group purely so that its sibling
 * loading.tsx does NOT wrap /products/[slug] as well. A Suspense boundary
 * above the detail route makes Next stream the shell before the page runs,
 * which turns notFound() for a withdrawn product into a soft 404 (status 200).
 */

export const metadata: Metadata = {
  title: "Industrial Products Catalogue — Hardware, Machine Tools & Safety",
  description:
    "Browse our full catalogue of industrial hardware, machine tools, cutting tools, safety materials, material handling equipment, adhesives, fasteners and lubricants. Search, filter by category or brand, and enquire on WhatsApp.",
  alternates: { canonical: "/products" },
};

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
};

const VALID_SORTS = new Set(["newest", "oldest", "name", "name-desc"]);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const brand = params.brand ?? "";
  const sort = VALID_SORTS.has(params.sort ?? "")
    ? (params.sort as Filters["sort"])
    : "newest";
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const filters: Filters = {
    q: q || undefined,
    category: category || undefined,
    brand: brand || undefined,
    sort,
  };

  const total = countProducts(filters);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const products = listProducts({
    ...filters,
    limit: PER_PAGE,
    offset: (safePage - 1) * PER_PAGE,
  });

  const categories = listCategories({ activeOnly: true });
  const brands = listBrands({ activeOnly: true });

  const activeCategory = categories.find((item) => item.slug === category);
  const activeBrand = brands.find((item) => item.slug === brand);

  const heading = q
    ? `Search results for “${q}”`
    : activeCategory && activeBrand
      ? `${activeBrand.name} — ${activeCategory.name}`
      : (activeCategory?.name ?? activeBrand?.name ?? "Industrial Product Catalogue");

  return (
    <>
      <PageHeader
        eyebrow="Product catalogue"
        title={heading}
        crumbs={[{ label: "Products" }]}
        intro={
          activeCategory?.description ||
          activeBrand?.description ||
          "Search the catalogue or filter by category and brand. Every product page carries full specifications, applications and a one-click WhatsApp enquiry button."
        }
      />

      <section className="bg-white pb-16 lg:pb-24">
        <div className="container-x">
          <Suspense
            fallback={<div className="h-[132px] border-b border-steel-200" />}
          >
            <ProductFilters
              categories={categories.map((item) => ({
                name: item.name,
                slug: item.slug,
                product_count: item.product_count,
              }))}
              brands={brands.map((item) => ({
                name: item.name,
                slug: item.slug,
                product_count: item.product_count,
              }))}
              total={total}
            />
          </Suspense>

          <div className="pt-8">
            {products.length === 0 ? (
              <EmptyState
                context={q ? `Search: ${q}` : "Catalogue enquiry"}
                body={
                  q
                    ? `We could not find anything matching “${q}”. Try a shorter keyword, a product code, or a brand name — or ask us directly, we stock more than is listed here.`
                    : "There are no products matching these filters yet. Try clearing them, or send us your requirement — we stock more than is listed here."
                }
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
                  page={safePage}
                  totalPages={totalPages}
                  basePath="/products"
                  params={{ q, category, brand, sort: sort ?? undefined }}
                />
              </>
            )}
          </div>
        </div>
      </section>

      <WhatsAppBanner
        title="Cannot find what you are looking for?"
        body="Our counter stock is wider than this catalogue. Send us the product name, part number or a photo and we will confirm availability and price."
        context={q ? `Could not find: ${q}` : "Catalogue enquiry"}
      />
    </>
  );
}

