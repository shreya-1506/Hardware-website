import type { Metadata } from "next";

import { CategoryCard } from "@/components/site/CategoryCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { countProducts, listCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Product Categories — Industrial Hardware, Tools & Safety Supplies",
  description:
    "Browse our industrial product categories: hardware, machine tools, safety materials, material handling, adhesives, consumables, fasteners, power tools, hand tools, cutting tools, measuring tools and lubricants.",
  alternates: { canonical: "/categories" },
};

/**
 * Rendered per request: the catalogue lives in SQLite and the admin panel edits
 * it at runtime, so a build-time snapshot would keep serving withdrawn products.
 */
export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const categories = listCategories({ activeOnly: true });
  const total = countProducts();

  return (
    <>
      <PageHeader
        eyebrow="Product categories"
        title="Browse the catalogue by category"
        crumbs={[{ label: "Categories" }]}
        intro={`${categories.length} categories covering ${total} listed products — from a single bottle of thread locker to complete lifting tackle. Pick a category to see what we supply.`}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          {categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              body="Categories have not been set up yet. Send us your requirement and we will help you directly."
              context="Category enquiry"
            />
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <RevealItem key={category.id} className="h-full">
                  <CategoryCard category={category} priority={index < 3} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <WhatsAppBanner
        title="Not sure which category your requirement falls under?"
        body="Describe the job or send a photo of the part. We will identify the right product and quote it."
        context="Category help"
      />
    </>
  );
}
