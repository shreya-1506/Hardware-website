import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  deleteCategoryAction,
  moveCategoryAction,
  saveCategoryAction,
  toggleCategoryActiveAction,
} from "@/app/admin/actions";
import { AdminPage, Panel } from "@/components/admin/AdminPage";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { TaxonomyForm } from "@/components/admin/TaxonomyForm";
import { Badge } from "@/components/ui/Badge";
import { getCategory, listCategories } from "@/lib/queries";
import { imageSrc, truncate } from "@/lib/utils";

export const metadata = { title: "Categories" };

const iconButton =
  "grid h-9 w-9 place-items-center rounded-md border border-steel-200 text-steel-500 transition hover:border-navy-400 hover:text-navy-900 disabled:opacity-30";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editing = edit ? getCategory(Number(edit)) : null;
  const categories = listCategories();

  return (
    <AdminPage
      title="Categories"
      description="Categories drive the website navigation, the homepage grid and the catalogue filters. Reorder them to change the order customers see."
      crumbs={[{ label: "Categories" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Form */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Panel title={editing ? `Edit “${editing.name}”` : "Add a category"}>
            <div className="p-5">
              <TaxonomyForm
                kind="category"
                action={saveCategoryAction}
                record={editing ?? undefined}
                basePath="/admin/categories"
              />
            </div>
          </Panel>
        </div>

        {/* List */}
        <Panel
          title={`${categories.length} categories`}
          description="In display order"
        >
          {categories.length === 0 ? (
            <p className="px-5 py-12 text-center text-[14px] text-steel-500">
              No categories yet. Add your first one using the form.
            </p>
          ) : (
            <ul className="divide-y divide-steel-200">
              {categories.map((category, index) => (
                <li
                  key={category.id}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-steel-50"
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-steel-200 bg-steel-100">
                    <Image
                      src={imageSrc(category.image)}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        target="_blank"
                        className="text-[14.5px] font-semibold text-navy-900 hover:text-safety-600"
                      >
                        {category.name}
                      </Link>
                      {category.active ? (
                        <Badge tone="success">Enabled</Badge>
                      ) : (
                        <Badge tone="muted">Disabled</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-[12.5px] text-steel-500">
                      /{category.slug} · {category.product_count ?? 0}{" "}
                      published {(category.product_count ?? 0) === 1 ? "product" : "products"}
                    </p>
                    {category.description && (
                      <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-steel-500">
                        {truncate(category.description, 130)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <form action={moveCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="direction" value="up" />
                      <SubmitButton
                        className={iconButton}
                        title="Move up"
                        ariaLabel={`Move ${category.name} up`}
                      >
                        <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
                      </SubmitButton>
                    </form>

                    <form action={moveCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="direction" value="down" />
                      <SubmitButton
                        className={iconButton}
                        title="Move down"
                        ariaLabel={`Move ${category.name} down`}
                      >
                        <ArrowDown className="h-4 w-4" strokeWidth={2.2} />
                      </SubmitButton>
                    </form>

                    <Link
                      href={`/admin/categories?edit=${category.id}`}
                      scroll={false}
                      title="Edit category"
                      aria-label={`Edit ${category.name}`}
                      className={iconButton}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2.2} />
                    </Link>

                    <form action={toggleCategoryActiveAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <SubmitButton
                        className={iconButton}
                        title={category.active ? "Disable" : "Enable"}
                        ariaLabel={
                          category.active
                            ? `Disable ${category.name}`
                            : `Enable ${category.name}`
                        }
                      >
                        {category.active ? (
                          <Eye className="h-4 w-4" strokeWidth={2.2} />
                        ) : (
                          <EyeOff className="h-4 w-4" strokeWidth={2.2} />
                        )}
                      </SubmitButton>
                    </form>

                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <ConfirmButton
                        message={
                          (category.product_count ?? 0) > 0
                            ? `“${category.name}” still has ${category.product_count} published product(s). Deleting the category leaves those products uncategorised. Continue?`
                            : `Delete the category “${category.name}”?`
                        }
                        className="grid h-9 w-9 place-items-center rounded-md border border-steel-200 text-steel-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        title="Delete category"
                        ariaLabel={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                      </ConfirmButton>
                    </form>
                  </div>

                  <span className="sr-only">Position {index + 1}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AdminPage>
  );
}
