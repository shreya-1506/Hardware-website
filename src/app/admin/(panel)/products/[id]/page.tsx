import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Copy, Trash2 } from "lucide-react";

import {
  deleteProductAction,
  duplicateProductAction,
} from "@/app/admin/actions";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct, listBrands, listCategories } from "@/lib/queries";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; duplicated?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = getProduct(Number(id));
  return { title: product ? `Edit — ${product.name}` : "Product not found" };
}

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { created, duplicated } = await searchParams;

  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const product = getProduct(productId);
  if (!product) notFound();

  const notice = created
    ? "Product created. It is now live on the website."
    : duplicated
      ? "Product duplicated as an unpublished draft. Adjust the details and publish when ready."
      : null;

  return (
    <AdminPage
      title={product.name}
      description={`Product code ${product.sku || "—"} · /products/${product.slug}`}
      crumbs={[
        { label: "Products", href: "/admin/products" },
        { label: "Edit" },
      ]}
      actions={
        <>
          <form action={duplicateProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <SubmitButton className="inline-flex h-11 items-center gap-2 rounded-md border border-steel-300 bg-white px-4 text-[13.5px] font-semibold text-navy-800 transition hover:border-navy-400">
              <Copy className="h-4 w-4" strokeWidth={2.2} />
              Duplicate
            </SubmitButton>
          </form>

          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <ConfirmButton
              message={`Delete “${product.name}”? This cannot be undone.`}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-[13.5px] font-semibold text-red-700 transition hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.2} />
              Delete
            </ConfirmButton>
          </form>
        </>
      }
    >
      {notice && (
        <p className="mb-6 flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} />
          <span>
            {notice}{" "}
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="font-semibold underline underline-offset-2"
            >
              View it on the website
            </Link>
            .
          </span>
        </p>
      )}

      <ProductForm
        product={product}
        categories={listCategories()}
        brands={listBrands()}
      />
    </AdminPage>
  );
}
