import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  deleteProductAction,
  duplicateProductAction,
  toggleProductFeaturedAction,
  toggleProductPublishedAction,
} from "@/app/admin/actions";
import { AdminPage, Panel } from "@/components/admin/AdminPage";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { Badge } from "@/components/ui/Badge";
import { listBrands, listCategories, listProducts } from "@/lib/queries";
import { formatDate, imageSrc } from "@/lib/utils";

export const metadata = { title: "Products" };

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  status?: string;
  featured?: string;
};

const iconButton =
  "grid h-9 w-9 place-items-center rounded-md border border-steel-200 text-steel-500 transition hover:border-navy-400 hover:text-navy-900";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categories = listCategories();
  const brands = listBrands();

  let products = listProducts({
    q: params.q,
    category: params.category,
    brand: params.brand,
    includeUnpublished: true,
    sort: "newest",
  });

  if (params.status === "published") {
    products = products.filter((product) => product.published);
  } else if (params.status === "draft") {
    products = products.filter((product) => !product.published);
  }

  if (params.featured === "1") {
    products = products.filter((product) => product.featured);
  }

  return (
    <AdminPage
      title="Products"
      description="Add, edit, duplicate and publish catalogue items. Changes appear on the website immediately."
      crumbs={[{ label: "Products" }]}
      actions={
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-safety-500 px-5 text-[14px] font-semibold text-white transition hover:bg-safety-600"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} />
          Add product
        </Link>
      }
    >
      <div className="mb-5">
        <Suspense fallback={<div className="h-11" />}>
          <AdminSearchBar
            basePath="/admin/products"
            placeholder="Search by name, code, brand, category or description…"
            filters={[
              {
                name: "category",
                label: "Category",
                options: [
                  { value: "", label: "All categories" },
                  ...categories.map((category) => ({
                    value: category.slug,
                    label: category.name,
                  })),
                ],
              },
              {
                name: "brand",
                label: "Brand",
                options: [
                  { value: "", label: "All brands" },
                  ...brands.map((brand) => ({
                    value: brand.slug,
                    label: brand.name,
                  })),
                ],
              },
              {
                name: "status",
                label: "Status",
                options: [
                  { value: "", label: "All statuses" },
                  { value: "published", label: "Published only" },
                  { value: "draft", label: "Drafts only" },
                ],
              },
            ]}
          />
        </Suspense>
      </div>

      <Panel
        title={`${products.length} ${products.length === 1 ? "product" : "products"}`}
        description="Newest first"
      >
        {products.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-[15px] font-semibold text-navy-900">
              No products match these filters
            </p>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-steel-500">
              Clear the search and filters, or add your first product to get
              started.
            </p>
            <Link
              href="/admin/products/new"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-safety-500 px-5 text-[14px] font-semibold text-white transition hover:bg-safety-600"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              Add product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-steel-200 bg-white text-[11px] font-bold uppercase tracking-[0.12em] text-steel-500">
                  <th scope="col" className="px-5 py-3">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Brand
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Updated
                  </th>
                  <th scope="col" className="px-5 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-steel-200">
                {products.map((product) => (
                  <tr key={product.id} className="align-middle hover:bg-steel-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded border border-steel-200 bg-steel-100">
                          <Image
                            src={imageSrc(product.image)}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="block truncate text-[14px] font-semibold text-navy-900 hover:text-safety-600"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-0.5 truncate text-[12px] text-steel-500">
                            {product.sku ? `${product.sku} · ` : ""}
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[13px] text-steel-600">
                      {product.category_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-steel-600">
                      {product.brand_name ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.published ? (
                          <Badge tone="success">Published</Badge>
                        ) : (
                          <Badge tone="muted">Draft</Badge>
                        )}
                        {product.featured && <Badge tone="safety">Featured</Badge>}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[12.5px] text-steel-500">
                      {formatDate(product.updated_at || product.created_at)}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          className={iconButton}
                        >
                          <Pencil className="h-4 w-4" strokeWidth={2.2} />
                        </Link>

                        <form action={toggleProductPublishedAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <SubmitButton
                            className={iconButton}
                            title={
                              product.published
                                ? "Unpublish (hide from website)"
                                : "Publish (show on website)"
                            }
                            ariaLabel={
                              product.published
                                ? `Unpublish ${product.name}`
                                : `Publish ${product.name}`
                            }
                          >
                            {product.published ? (
                              <Eye className="h-4 w-4" strokeWidth={2.2} />
                            ) : (
                              <EyeOff className="h-4 w-4" strokeWidth={2.2} />
                            )}
                          </SubmitButton>
                        </form>

                        <form action={toggleProductFeaturedAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <SubmitButton
                            className={iconButton}
                            title={
                              product.featured
                                ? "Remove from featured"
                                : "Mark as featured"
                            }
                            ariaLabel={
                              product.featured
                                ? `Unfeature ${product.name}`
                                : `Feature ${product.name}`
                            }
                          >
                            {product.featured ? (
                              <Star
                                className="h-4 w-4 fill-safety-500 text-safety-500"
                                strokeWidth={2.2}
                              />
                            ) : (
                              <StarOff className="h-4 w-4" strokeWidth={2.2} />
                            )}
                          </SubmitButton>
                        </form>

                        <form action={duplicateProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <SubmitButton
                            className={iconButton}
                            title="Duplicate as a draft"
                            ariaLabel={`Duplicate ${product.name}`}
                          >
                            <Copy className="h-4 w-4" strokeWidth={2.2} />
                          </SubmitButton>
                        </form>

                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <ConfirmButton
                            message={`Delete “${product.name}”? This cannot be undone.`}
                            className="grid h-9 w-9 place-items-center rounded-md border border-steel-200 text-steel-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            title="Delete product"
                            ariaLabel={`Delete ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </AdminPage>
  );
}
