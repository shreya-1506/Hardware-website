"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Wand2,
  X,
} from "lucide-react";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import type { ActionState } from "@/app/admin/actions";
import type { Brand, Category } from "@/lib/types";
import { cn, imageSrc, slugify } from "@/lib/utils";

const initialState: ActionState = { status: "idle" };

type Record_ = Category | Brand;

/**
 * Shared add/edit form for categories and brands — the two differ only in the
 * label of the image field (`image` vs `logo`) and the wording.
 */
export function TaxonomyForm({
  kind,
  action,
  record,
  basePath,
}: {
  kind: "category" | "brand";
  action: (
    prev: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  record?: Record_;
  basePath: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();
  const formId = useId();

  const isCategory = kind === "category";
  const imageField = isCategory ? "image" : "logo";
  const fileField = isCategory ? "image_file" : "logo_file";
  const existingImage = isCategory
    ? ((record as Category | undefined)?.image ?? "")
    : ((record as Brand | undefined)?.logo ?? "");

  const [name, setName] = useState(record?.name ?? "");
  const [slug, setSlug] = useState(record?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(record?.slug));
  const [imageUrl, setImageUrl] = useState(existingImage);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!slugLocked) setSlug(slugify(name));
  }, [name, slugLocked]);

  // After a successful add, clear the form so the next one can be typed straight
  // away; after a successful edit, drop back to the plain list.
  useEffect(() => {
    if (state.status !== "success") return;

    if (record) {
      router.replace(basePath);
      return;
    }

    formRef.current?.reset();
    setName("");
    setSlug("");
    setSlugLocked(false);
    setImageUrl("");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [state.status, state.timestamp, record, router, basePath]);

  const shownImage = preview ?? (imageUrl || null);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      {record && <input type="hidden" name="id" value={record.id} />}
      <input type="hidden" name={imageField} value={imageUrl} />

      <div>
        <label htmlFor={`${formId}-name`} className="label">
          {isCategory ? "Category name" : "Brand name"}
          <span className="ml-0.5 text-safety-500">*</span>
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={isCategory ? "e.g. Cutting Tools" : "e.g. ANABOND"}
          className="field"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-slug`} className="label">
          URL slug
        </label>
        <div className="flex gap-2">
          <input
            id={`${formId}-slug`}
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugLocked(true);
              setSlug(event.target.value);
            }}
            placeholder={isCategory ? "cutting-tools" : "anabond"}
            className="field"
          />
          <button
            type="button"
            onClick={() => {
              setSlugLocked(false);
              setSlug(slugify(name));
            }}
            title="Regenerate from name"
            className="grid h-[46px] w-11 shrink-0 place-items-center rounded-md border border-steel-300 text-steel-500 transition hover:border-navy-400 hover:text-navy-800"
          >
            <Wand2 className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
        <p className="mt-1.5 text-[12px] text-steel-500">
          {isCategory
            ? `/categories/${slug || "…"}`
            : `/products?brand=${slug || "…"}`}
        </p>
      </div>

      <div>
        <label htmlFor={`${formId}-description`} className="label">
          Description
        </label>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={4}
          defaultValue={record?.description ?? ""}
          placeholder={
            isCategory
              ? "What this category covers — helps customers and search engines."
              : "A line or two about the brand and what it is known for."
          }
          className="field resize-y"
        />
      </div>

      {/* Image / logo */}
      <div>
        <span className="label">
          {isCategory ? "Category image" : "Brand logo"}
        </span>

        <div className="flex gap-3">
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-md border border-steel-200",
              isCategory
                ? "h-20 w-28 bg-steel-100"
                : "grid h-20 w-28 place-items-center bg-steel-50",
            )}
          >
            {shownImage ? (
              <Image
                key={shownImage}
                src={isCategory ? imageSrc(shownImage) : shownImage}
                alt=""
                fill
                sizes="112px"
                className={isCategory ? "object-cover" : "object-contain p-2"}
                unoptimized={Boolean(preview)}
              />
            ) : (
              <span className="px-2 text-center text-[11px] leading-tight text-steel-400">
                {isCategory ? "No image" : "Wordmark used"}
              </span>
            )}

            {shownImage && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                aria-label="Remove image"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded bg-white/92 text-steel-600 shadow-sm transition hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.6} />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${formId}-file`}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-steel-300 text-[13px] font-semibold text-navy-800 transition hover:border-safety-400 hover:bg-safety-50 hover:text-safety-700"
            >
              <ImagePlus className="h-4 w-4" strokeWidth={2.2} />
              Upload
            </label>
            <input
              ref={fileRef}
              id={`${formId}-file`}
              type="file"
              name={fileField}
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (preview) URL.revokeObjectURL(preview);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            <input
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setPreview(null);
              }}
              placeholder="…or paste a URL"
              aria-label="Image URL"
              className="field mt-2 text-[12.5px]"
            />
          </div>
        </div>

        <p className="mt-2 text-[12px] leading-relaxed text-steel-500">
          {isCategory
            ? "Landscape 16:10 images look best on the category cards."
            : "A transparent PNG works best. Without a logo the brand name is shown as a wordmark."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-sort`} className="label">
            Display order
          </label>
          <input
            id={`${formId}-sort`}
            name="sort_order"
            type="number"
            defaultValue={record?.sort_order ?? 0}
            className="field"
          />
          <p className="mt-1.5 text-[12px] text-steel-500">
            Lower numbers appear first.
          </p>
        </div>

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-3 pb-2.5">
            <input
              type="checkbox"
              name="active"
              defaultChecked={record ? record.active : true}
              className="h-4 w-4 rounded border-steel-300 text-safety-500 accent-safety-500"
            />
            <span className="text-[13.5px] font-semibold text-navy-900">
              Enabled
              <span className="ml-1.5 font-normal text-steel-500">
                (visible on the website)
              </span>
            </span>
          </label>
        </div>
      </div>

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

      <div className="flex flex-wrap gap-2.5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-safety-500 px-5 text-[14px] font-semibold text-white transition hover:bg-safety-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
              Saving…
            </>
          ) : record ? (
            <>
              <Save className="h-4 w-4" strokeWidth={2.4} />
              Save changes
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              Add {kind}
            </>
          )}
        </button>

        {record && (
          <button
            type="button"
            onClick={() => router.replace(basePath)}
            className="inline-flex h-11 items-center rounded-md border border-steel-300 px-5 text-[14px] font-semibold text-navy-800 transition hover:border-navy-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
