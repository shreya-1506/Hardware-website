import type { MetadataRoute } from "next";

import { listBrands, listCategories, listProductSlugs } from "@/lib/queries";
import { site } from "@/lib/site";

// Built from the live catalogue rather than baked in at build time.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/brands`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/enquiry`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = listCategories({
    activeOnly: true,
  }).map((category) => ({
    url: `${base}/categories/${category.slug}`,
    lastModified: new Date(category.updated_at || now),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const productRoutes: MetadataRoute.Sitemap = listProductSlugs().map((row) => ({
    url: `${base}/products/${row.slug}`,
    lastModified: new Date(row.updated_at || now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const brandRoutes: MetadataRoute.Sitemap = listBrands({
    activeOnly: true,
  }).map((brand) => ({
    url: `${base}/products?brand=${brand.slug}`,
    lastModified: new Date(brand.updated_at || now),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...brandRoutes,
  ];
}
