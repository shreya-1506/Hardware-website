"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";

import { saveProductAction, type ActionState } from "@/app/admin/actions";
import type { Brand, Category, Product, Spec, Variant } from "@/lib/types";
import { cn, imageSrc, slugify } from "@/lib/utils";

const initialState: ActionState = { status: "idle" };

type Row<T> = T & { key: string };

const withKeys = <T,>(rows: T[]): Row<T>[] =>
  rows.map((row, index) => ({
    ...row,
    key: `${index}-${Math.random().toString(36).slice(2, 8)}`,
  }));

const newKey = () => Math.random().toString(36).slice(2, 10);

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}) {
  const [state, formAction, pending] = useActionState(
    saveProductAction,
    initialState,
  );
  const formId = useId();

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(product?.slug));

  const [specs, setSpecs] = useState<Row<Spec>[]>(() =>
    product?.specifications?.length
      ? withKeys(product.specifications)
      : withKeys([
          { name: "Brand", value: "" },
          { name: "Product Type", value: "" },
          { name: "Application", value: "" },
          { name: "Pack Size", value: "" },
        ]),
  );

  const [variants, setVariants] = useState<Row<Variant>[]>(() =>
    withKeys(product?.variants ?? []),
  );

  const [imageUrl, setImageUrl] = useState(product?.image ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-slug from the name until the admin edits the slug themselves.
  useEffect(() => {
    if (!slugLocked) setSlug(slugify(name));
  }, [name, slugLocked]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shownImage = preview ?? (imageUrl || null);

  const suggestedMetaTitle = useMemo(() => {
    const brand = brands.find(
      (item) => String(item.id) === String(product?.brand_id ?? ""),
    );
    return name ? `${name}${brand ? ` — ${brand.name}` : ""} | Kolhapur` : "";
  }, [name, brands, product?.brand_id]);

  function updateSpec(key: string, patch: Partial<Spec>) {
    setSpecs((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function moveSpec(index: number, direction: -1 | 1) {
    setSpecs((rows) => {
      const target = index + direction;
      if (target < 0 || target >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_330px]">
      {product && <input type="hidden" name="id" value={product.id} />}
      {/* Preserves the current image when no new file is chosen. */}
      <input type="hidden" name="image" value={imageUrl} />

      {/* ------------------------------------------------------ main column */}
      <div className="grid min-w-0 gap-6">
        <Section
          title="Product details"
          hint="The name and short description are what customers see on product cards."
        >
          <Field label="Product name" required htmlFor={`${formId}-name`}>
            <input
              id={`${formId}-name`}
              name="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. ANABOND 114 Thread Locking Compound"
              className="field"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="SKU / Product code"
              htmlFor={`${formId}-sku`}
              hint="Shown on the product card and included in the WhatsApp message."
            >
              <input
                id={`${formId}-sku`}
                name="sku"
                defaultValue={product?.sku ?? ""}
                placeholder="e.g. AB-114-50"
                className="field"
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor={`${formId}-slug`}
              hint={slug ? `/products/${slug}` : "Generated from the name."}
            >
              <div className="flex gap-2">
                <input
                  id={`${formId}-slug`}
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugLocked(true);
                    setSlug(event.target.value);
                  }}
                  placeholder="anabond-114-thread-locking-compound"
                  className="field"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSlugLocked(false);
                    setSlug(slugify(name));
                  }}
                  title="Regenerate from product name"
                  className="grid h-[46px] w-11 shrink-0 place-items-center rounded-md border border-steel-300 text-steel-500 transition hover:border-navy-400 hover:text-navy-800"
                >
                  <Wand2 className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor={`${formId}-category`}>
              <select
                id={`${formId}-category`}
                name="category_id"
                defaultValue={product?.category_id ?? ""}
                className="field"
              >
                <option value="">— Not set —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {category.active ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Brand" htmlFor={`${formId}-brand`}>
              <select
                id={`${formId}-brand`}
                name="brand_id"
                defaultValue={product?.brand_id ?? ""}
                className="field"
              >
                <option value="">— No brand / general line —</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                    {brand.active ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Short description"
            htmlFor={`${formId}-short`}
            hint="One or two lines. Appears on product cards and in search results."
          >
            <textarea
              id={`${formId}-short`}
              name="short_description"
              rows={3}
              defaultValue={product?.short_description ?? ""}
              placeholder="Medium-strength anaerobic thread locker for fasteners up to M20 that need to be serviced with hand tools."
              className="field resize-y"
            />
          </Field>

          <Field
            label="Detailed description"
            htmlFor={`${formId}-description`}
            hint="Leave a blank line between paragraphs. Shown in the “Product Description” section."
          >
            <textarea
              id={`${formId}-description`}
              name="description"
              rows={10}
              defaultValue={product?.description ?? ""}
              placeholder="Explain what the product is, how it performs and where it is typically used…"
              className="field resize-y font-sans"
            />
          </Field>
        </Section>

        {/* ------------------------------------------------ specifications */}
        <Section
          title="Specifications"
          hint="Add as many rows as the product needs — every product can have different specifications."
        >
          <div className="grid gap-2.5">
            <div className="hidden gap-2.5 px-1 sm:grid sm:grid-cols-[24px_1fr_1.4fr_40px]">
              <span />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel-500">
                Specification name
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel-500">
                Value
              </span>
              <span />
            </div>

            {specs.map((spec, index) => (
              <div
                key={spec.key}
                className="grid gap-2.5 rounded-md border border-steel-200 bg-steel-50 p-2.5 sm:grid-cols-[24px_1fr_1.4fr_40px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
              >
                <div className="hidden flex-col items-center sm:flex">
                  <button
                    type="button"
                    onClick={() => moveSpec(index, -1)}
                    disabled={index === 0}
                    aria-label="Move specification up"
                    className="text-steel-300 transition hover:text-navy-700 disabled:opacity-30"
                  >
                    <GripVertical className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>

                <input
                  name="spec_name"
                  value={spec.name}
                  onChange={(event) =>
                    updateSpec(spec.key, { name: event.target.value })
                  }
                  aria-label={`Specification ${index + 1} name`}
                  placeholder="Material"
                  className="field"
                />
                <input
                  name="spec_value"
                  value={spec.value}
                  onChange={(event) =>
                    updateSpec(spec.key, { value: event.target.value })
                  }
                  aria-label={`Specification ${index + 1} value`}
                  placeholder="Stainless Steel"
                  className="field"
                />

                <button
                  type="button"
                  onClick={() =>
                    setSpecs((rows) => rows.filter((row) => row.key !== spec.key))
                  }
                  aria-label={`Remove specification ${index + 1}`}
                  className="grid h-[46px] w-full place-items-center rounded-md border border-steel-200 text-steel-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-10"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setSpecs((rows) => [
                ...rows,
                { key: newKey(), name: "", value: "" },
              ])
            }
            className="mt-1 inline-flex h-11 items-center gap-2 rounded-md border border-dashed border-steel-300 px-4 text-[13.5px] font-semibold text-navy-800 transition hover:border-safety-400 hover:bg-safety-50 hover:text-safety-700"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Add specification
          </button>

          <p className="text-[12.5px] text-steel-500">
            Rows with an empty specification name are ignored when saving.
          </p>
        </Section>

        {/* ---------------------------------------------------- applications */}
        <Section
          title="Applications"
          hint="One application per line. Displayed as a checklist on the product page."
        >
          <textarea
            name="applications"
            rows={6}
            defaultValue={(product?.applications ?? []).join("\n")}
            placeholder={
              "Locking machine guard and cover bolts against vibration\nMotor, pump and gearbox mounting fasteners\nSealing threaded assemblies against oil seepage"
            }
            aria-label="Applications, one per line"
            className="field resize-y"
          />
        </Section>

        {/* ------------------------------------------------------- variants */}
        <Section
          title="Variants"
          hint="Pack sizes, grades or ranges. Optional — leave empty if the product has only one form."
        >
          <div className="grid gap-2.5">
            {variants.map((variant, index) => (
              <div
                key={variant.key}
                className="grid gap-2.5 sm:grid-cols-[1fr_1.4fr_40px] sm:items-center"
              >
                <input
                  name="variant_name"
                  value={variant.name}
                  onChange={(event) =>
                    setVariants((rows) =>
                      rows.map((row) =>
                        row.key === variant.key
                          ? { ...row, name: event.target.value }
                          : row,
                      ),
                    )
                  }
                  aria-label={`Variant ${index + 1} name`}
                  placeholder="50 ml"
                  className="field"
                />
                <input
                  name="variant_detail"
                  value={variant.detail}
                  onChange={(event) =>
                    setVariants((rows) =>
                      rows.map((row) =>
                        row.key === variant.key
                          ? { ...row, detail: event.target.value }
                          : row,
                      ),
                    )
                  }
                  aria-label={`Variant ${index + 1} detail`}
                  placeholder="Standard workshop bottle"
                  className="field"
                />
                <button
                  type="button"
                  onClick={() =>
                    setVariants((rows) =>
                      rows.filter((row) => row.key !== variant.key),
                    )
                  }
                  aria-label={`Remove variant ${index + 1}`}
                  className="grid h-[46px] w-full place-items-center rounded-md border border-steel-200 text-steel-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-10"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setVariants((rows) => [
                ...rows,
                { key: newKey(), name: "", detail: "" },
              ])
            }
            className="inline-flex h-11 items-center gap-2 rounded-md border border-dashed border-steel-300 px-4 text-[13.5px] font-semibold text-navy-800 transition hover:border-safety-400 hover:bg-safety-50 hover:text-safety-700"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Add variant
          </button>
        </Section>

        {/* ------------------------------------------------------------ SEO */}
        <Section
          title="Search engine listing"
          hint="Optional. Leave blank and we generate sensible defaults from the product details."
        >
          <Field
            label="SEO title"
            htmlFor={`${formId}-metatitle`}
            hint={suggestedMetaTitle ? `Suggested: ${suggestedMetaTitle}` : undefined}
          >
            <input
              id={`${formId}-metatitle`}
              name="meta_title"
              defaultValue={product?.meta_title ?? ""}
              maxLength={120}
              placeholder={suggestedMetaTitle}
              className="field"
            />
          </Field>

          <Field
            label="Meta description"
            htmlFor={`${formId}-metadesc`}
            hint="Around 150–160 characters works best."
          >
            <textarea
              id={`${formId}-metadesc`}
              name="meta_description"
              rows={3}
              maxLength={320}
              defaultValue={product?.meta_description ?? ""}
              placeholder="Short summary shown in Google results…"
              className="field resize-y"
            />
          </Field>
        </Section>
      </div>

      {/* ------------------------------------------------------- side column */}
      <div className="grid content-start gap-6 lg:sticky lg:top-6 lg:self-start">
        {/* Save box */}
        <div className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card">
          <div className="border-b border-steel-200 bg-steel-50 px-5 py-3.5">
            <h2 className="font-display text-[14px] font-bold text-navy-900">
              Publish
            </h2>
          </div>

          <div className="grid gap-4 p-5">
            <Toggle
              name="published"
              label="Published"
              hint="Visible on the website."
              defaultChecked={product ? product.published : true}
            />
            <Toggle
              name="featured"
              label="Featured"
              hint="Also shown in the homepage Featured Products section."
              defaultChecked={product?.featured ?? false}
            />

            {state.status !== "idle" && state.message && (
              <p
                role="status"
                className={cn(
                  "flex items-start gap-2.5 rounded-md border px-3.5 py-2.5 text-[13px]",
                  state.status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800",
                )}
              >
                {state.status === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} />
                )}
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-safety-500 text-[15px] font-semibold text-white transition hover:bg-safety-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" strokeWidth={2.4} />
                  {product ? "Save changes" : "Create product"}
                </>
              )}
            </button>

            {product && (
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-steel-300 text-[13.5px] font-semibold text-navy-800 transition hover:border-navy-400"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2.2} />
                View on website
              </Link>
            )}
          </div>
        </div>

        {/* Image box */}
        <div className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card">
          <div className="border-b border-steel-200 bg-steel-50 px-5 py-3.5">
            <h2 className="font-display text-[14px] font-bold text-navy-900">
              Product image
            </h2>
          </div>

          <div className="p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-steel-200 bg-steel-100">
              <Image
                key={shownImage ?? "placeholder"}
                src={imageSrc(shownImage)}
                alt="Product image preview"
                fill
                sizes="320px"
                className="object-cover"
                unoptimized={Boolean(preview)}
              />
              {shownImage && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("");
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md bg-white/92 text-steel-600 shadow-sm backdrop-blur-sm transition hover:text-red-600"
                >
                  <X className="h-4 w-4" strokeWidth={2.4} />
                </button>
              )}
            </div>

            <label
              htmlFor={`${formId}-file`}
              className="mt-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-steel-300 text-[13.5px] font-semibold text-navy-800 transition hover:border-safety-400 hover:bg-safety-50 hover:text-safety-700"
            >
              <ImagePlus className="h-4 w-4" strokeWidth={2.2} />
              Upload image
            </label>
            <input
              ref={fileRef}
              id={`${formId}-file`}
              type="file"
              name="image_file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (preview) URL.revokeObjectURL(preview);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />

            <p className="mt-2 text-[12px] leading-relaxed text-steel-500">
              JPG, PNG, WebP, AVIF or GIF, up to 5 MB. Landscape 4:3 images look
              best. Uploads are saved to <code>/public/uploads</code>.
            </p>

            <div className="mt-4 border-t border-steel-200 pt-4">
              <label
                htmlFor={`${formId}-imageurl`}
                className="mb-1.5 block text-[12.5px] font-semibold text-navy-800"
              >
                …or paste an image URL
              </label>
              <input
                id={`${formId}-imageurl`}
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  setPreview(null);
                }}
                placeholder="/images/catalog/adhesives.svg"
                className="field text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Gallery box */}
        <div className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card">
          <div className="border-b border-steel-200 bg-steel-50 px-5 py-3.5">
            <h2 className="font-display text-[14px] font-bold text-navy-900">
              Extra images
            </h2>
          </div>
          <div className="p-5">
            <textarea
              name="gallery"
              rows={4}
              defaultValue={(product?.gallery ?? []).join("\n")}
              placeholder={"/uploads/product-a.jpg\n/uploads/product-b.jpg"}
              aria-label="Gallery image URLs, one per line"
              className="field resize-y text-[13px]"
            />
            <p className="mt-2 text-[12px] leading-relaxed text-steel-500">
              One image URL per line. These appear as thumbnails under the main
              product image. Upload the files first, then paste their URLs here.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------- primitives */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card">
      <header className="border-b border-steel-200 bg-steel-50 px-5 py-4">
        <h2 className="font-display text-[15px] font-bold text-navy-900">
          {title}
        </h2>
        {hint && (
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-steel-500">
            {hint}
          </p>
        )}
      </header>
      <div className="grid gap-4 p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="ml-0.5 text-safety-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-steel-500">
          {hint}
        </p>
      )}
    </div>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(Boolean(defaultChecked));

  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        checked={on}
        onChange={(event) => setOn(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
          on ? "bg-safety-500" : "bg-steel-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            on ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
      <span>
        <span className="block text-[13.5px] font-semibold text-navy-900">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[12px] leading-relaxed text-steel-500">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
