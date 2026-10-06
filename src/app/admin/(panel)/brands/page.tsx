import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

import {
  deleteBrandAction,
  saveBrandAction,
  toggleBrandActiveAction,
} from "@/app/admin/actions";
import { AdminPage, Panel } from "@/components/admin/AdminPage";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { TaxonomyForm } from "@/components/admin/TaxonomyForm";
import { Badge } from "@/components/ui/Badge";
import { getBrand, listBrands } from "@/lib/queries";
import { truncate } from "@/lib/utils";

export const metadata = { title: "Brands" };

const iconButton =
  "grid h-9 w-9 place-items-center rounded-md border border-steel-200 text-steel-500 transition hover:border-navy-400 hover:text-navy-900";

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editing = edit ? getBrand(Number(edit)) : null;
  const brands = listBrands();

  return (
    <AdminPage
      title="Brands"
      description="Brands appear on the Brands page, in the homepage strip and as a filter in the catalogue. Products without a brand are shown as general line."
      crumbs={[{ label: "Brands" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Panel title={editing ? `Edit “${editing.name}”` : "Add a brand"}>
            <div className="p-5">
              <TaxonomyForm
                kind="brand"
                action={saveBrandAction}
                record={editing ?? undefined}
                basePath="/admin/brands"
              />
            </div>
          </Panel>
        </div>

        <Panel
          title={`${brands.length} brands`}
          description="In display order"
        >
          {brands.length === 0 ? (
            <p className="px-5 py-12 text-center text-[14px] text-steel-500">
              No brands yet. Add ANABOND, BOSS, McCoy and Golden Bullet using the
              form.
            </p>
          ) : (
            <ul className="divide-y divide-steel-200">
              {brands.map((brand) => (
                <li
                  key={brand.id}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-steel-50"
                >
                  <div className="grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded border border-steel-200 bg-steel-50">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={96}
                        height={56}
                        className="max-h-12 w-auto object-contain"
                      />
                    ) : (
                      <span className="px-1 text-center font-display text-[12px] font-bold uppercase leading-tight text-navy-700">
                        {brand.name}
                      </span>
                    )}
                  </div>

                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/products?brand=${brand.slug}`}
                        target="_blank"
                        className="text-[14.5px] font-semibold text-navy-900 hover:text-safety-600"
                      >
                        {brand.name}
                      </Link>
                      {brand.active ? (
                        <Badge tone="success">Enabled</Badge>
                      ) : (
                        <Badge tone="muted">Disabled</Badge>
                      )}
                      {!brand.logo && <Badge tone="outline">No logo</Badge>}
                    </div>
                    <p className="mt-1 text-[12.5px] text-steel-500">
                      /{brand.slug} · {brand.product_count ?? 0} published{" "}
                      {(brand.product_count ?? 0) === 1 ? "product" : "products"}
                    </p>
                    {brand.description && (
                      <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-steel-500">
                        {truncate(brand.description, 130)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/brands?edit=${brand.id}`}
                      scroll={false}
                      title="Edit brand"
                      aria-label={`Edit ${brand.name}`}
                      className={iconButton}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2.2} />
                    </Link>

                    <form action={toggleBrandActiveAction}>
                      <input type="hidden" name="id" value={brand.id} />
                      <SubmitButton
                        className={iconButton}
                        title={brand.active ? "Disable" : "Enable"}
                        ariaLabel={
                          brand.active
                            ? `Disable ${brand.name}`
                            : `Enable ${brand.name}`
                        }
                      >
                        {brand.active ? (
                          <Eye className="h-4 w-4" strokeWidth={2.2} />
                        ) : (
                          <EyeOff className="h-4 w-4" strokeWidth={2.2} />
                        )}
                      </SubmitButton>
                    </form>

                    <form action={deleteBrandAction}>
                      <input type="hidden" name="id" value={brand.id} />
                      <ConfirmButton
                        message={
                          (brand.product_count ?? 0) > 0
                            ? `“${brand.name}” still has ${brand.product_count} published product(s). Deleting the brand leaves those products without a brand. Continue?`
                            : `Delete the brand “${brand.name}”?`
                        }
                        className="grid h-9 w-9 place-items-center rounded-md border border-steel-200 text-steel-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        title="Delete brand"
                        ariaLabel={`Delete ${brand.name}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                      </ConfirmButton>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AdminPage>
  );
}
