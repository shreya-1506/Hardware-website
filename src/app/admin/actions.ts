"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { login, logout, requireAdmin } from "@/lib/auth";
import {
  createBrand,
  createCategory,
  createProduct,
  deleteBrand,
  deleteCategory,
  deleteEnquiry,
  deleteProduct,
  duplicateProduct,
  getBrand,
  getCategory,
  getProduct,
  moveCategory,
  toggleBrandActive,
  toggleCategoryActive,
  toggleProductFeatured,
  toggleProductPublished,
  updateBrand,
  updateCategory,
  updateEnquiryNotes,
  updateEnquiryStatus,
  updateProduct,
} from "@/lib/queries";
import { enquiryStatuses } from "@/lib/site";
import type { Spec, Variant } from "@/lib/types";
import { deleteUpload, saveUpload } from "@/lib/upload";

/* ------------------------------------------------------------------- shared */

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  timestamp?: number;
};

const ok = (message: string): ActionState => ({
  status: "success",
  message,
  timestamp: Date.now(),
});

const fail = (message: string): ActionState => ({
  status: "error",
  message,
  timestamp: Date.now(),
});

/**
 * Public pages read straight from SQLite, so every mutation has to drop the
 * cached HTML. The dynamic segments are named explicitly because a layout-level
 * revalidation does not always reach prerendered `generateStaticParams` pages.
 */
function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/categories/[slug]", "page");
  revalidatePath("/products");
  revalidatePath("/categories");
  revalidatePath("/brands");
  revalidatePath("/sitemap.xml");
}

const str = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const checked = (formData: FormData, key: string) =>
  formData.get(key) === "on" || formData.get(key) === "true";

const numberOrNull = (formData: FormData, key: string) => {
  const value = str(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Repeated form fields arrive as parallel arrays (spec_name[] / spec_value[]).
 * Rows where the label is blank are dropped, so the admin can leave spare rows
 * empty without polluting the product.
 */
function readSpecs(formData: FormData): Spec[] {
  const names = formData.getAll("spec_name").map(String);
  const values = formData.getAll("spec_value").map(String);
  return names
    .map((name, index) => ({
      name: name.trim(),
      value: (values[index] ?? "").trim(),
    }))
    .filter((spec) => spec.name.length > 0);
}

function readVariants(formData: FormData): Variant[] {
  const names = formData.getAll("variant_name").map(String);
  const details = formData.getAll("variant_detail").map(String);
  return names
    .map((name, index) => ({
      name: name.trim(),
      detail: (details[index] ?? "").trim(),
    }))
    .filter((variant) => variant.name.length > 0);
}

/** One application or gallery URL per line. */
function readLines(formData: FormData, key: string) {
  return str(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/* --------------------------------------------------------------------- auth */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = str(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = str(formData, "next");

  if (!email || !password) {
    return fail("Enter both your email and password.");
  }

  const result = await login(email, password);
  if (!result.ok) return fail(result.error);

  redirect(next && next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

/* ----------------------------------------------------------------- products */

type BuiltProduct =
  | { ok: false; error: string }
  | { ok: true; input: Parameters<typeof createProduct>[0] };

async function productInputFromForm(
  formData: FormData,
  existingImage = "",
): Promise<BuiltProduct> {
  const name = str(formData, "name");
  const upload = formData.get("image_file");
  let image = str(formData, "image") || existingImage;

  if (upload instanceof File && upload.size > 0) {
    const result = await saveUpload(upload, name || "product");
    if (!result.ok) return { ok: false, error: result.error };
    image = result.url;
  }

  return {
    ok: true,
    input: {
      name,
      slug: str(formData, "slug") || name,
      sku: str(formData, "sku"),
      category_id: numberOrNull(formData, "category_id"),
      brand_id: numberOrNull(formData, "brand_id"),
      short_description: str(formData, "short_description"),
      description: str(formData, "description"),
      image,
      gallery: readLines(formData, "gallery"),
      specifications: readSpecs(formData),
      applications: readLines(formData, "applications"),
      variants: readVariants(formData),
      featured: checked(formData, "featured"),
      published: checked(formData, "published"),
      meta_title: str(formData, "meta_title"),
      meta_description: str(formData, "meta_description"),
    },
  };
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = numberOrNull(formData, "id");
  const name = str(formData, "name");

  if (name.length < 2) return fail("Product name is required.");

  const existing = id ? getProduct(id) : null;
  const built = await productInputFromForm(formData, existing?.image ?? "");
  if (!built.ok) return fail(built.error);

  let createdId: number | null = null;

  try {
    if (id && existing) {
      updateProduct(id, built.input);
    } else {
      createdId = createProduct(built.input).id;
    }
    revalidateSite();
    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Failed to save product:", error);
    return fail("Could not save the product. Please try again.");
  }

  // redirect() throws internally, so it must sit outside the try/catch.
  if (createdId !== null) redirect(`/admin/products/${createdId}?created=1`);

  return ok(`“${built.input.name}” updated.`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;

  const product = getProduct(id);
  deleteProduct(id);
  await deleteUpload(product?.image);

  revalidateSite();
  redirect("/admin/products?deleted=1");
}

export async function duplicateProductAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;

  const created = duplicateProduct(id);
  revalidateSite();
  if (created) redirect(`/admin/products/${created.id}?duplicated=1`);
}

export async function toggleProductPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  toggleProductPublished(id);
  revalidateSite();
  revalidatePath("/admin/products");
}

export async function toggleProductFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  toggleProductFeatured(id);
  revalidateSite();
  revalidatePath("/admin/products");
}

/* --------------------------------------------------------------- categories */

export async function saveCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = numberOrNull(formData, "id");
  const name = str(formData, "name");
  if (name.length < 2) return fail("Category name is required.");

  const existing = id ? getCategory(id) : null;
  let image = str(formData, "image") || existing?.image || "";

  const upload = formData.get("image_file");
  if (upload instanceof File && upload.size > 0) {
    const result = await saveUpload(upload, `category-${name}`);
    if (!result.ok) return fail(result.error);
    image = result.url;
  }

  const input = {
    name,
    slug: str(formData, "slug") || name,
    description: str(formData, "description"),
    image,
    active: checked(formData, "active"),
    sort_order: Number(str(formData, "sort_order") || 0) || 0,
  };

  try {
    if (id && existing) {
      updateCategory(id, input);
      revalidateSite();
      revalidatePath("/admin/categories");
      return ok(`“${name}” updated.`);
    }
    createCategory(input);
    revalidateSite();
    revalidatePath("/admin/categories");
    return ok(`“${name}” added.`);
  } catch (error) {
    console.error("Failed to save category:", error);
    return fail("Could not save the category. Please try again.");
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  const category = getCategory(id);
  deleteCategory(id);
  await deleteUpload(category?.image);
  revalidateSite();
  revalidatePath("/admin/categories");
}

export async function toggleCategoryActiveAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  toggleCategoryActive(id);
  revalidateSite();
  revalidatePath("/admin/categories");
}

export async function moveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  const direction = str(formData, "direction") === "up" ? "up" : "down";
  if (!id) return;
  moveCategory(id, direction);
  revalidateSite();
  revalidatePath("/admin/categories");
}

/* ------------------------------------------------------------------- brands */

export async function saveBrandAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = numberOrNull(formData, "id");
  const name = str(formData, "name");
  if (name.length < 1) return fail("Brand name is required.");

  const existing = id ? getBrand(id) : null;
  let logo = str(formData, "logo") || existing?.logo || "";

  const upload = formData.get("logo_file");
  if (upload instanceof File && upload.size > 0) {
    const result = await saveUpload(upload, `brand-${name}`);
    if (!result.ok) return fail(result.error);
    logo = result.url;
  }

  const input = {
    name,
    slug: str(formData, "slug") || name,
    description: str(formData, "description"),
    logo,
    active: checked(formData, "active"),
    sort_order: Number(str(formData, "sort_order") || 0) || 0,
  };

  try {
    if (id && existing) {
      updateBrand(id, input);
      revalidateSite();
      revalidatePath("/admin/brands");
      return ok(`“${name}” updated.`);
    }
    createBrand(input);
    revalidateSite();
    revalidatePath("/admin/brands");
    return ok(`“${name}” added.`);
  } catch (error) {
    console.error("Failed to save brand:", error);
    return fail("Could not save the brand. Please try again.");
  }
}

export async function deleteBrandAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  const brand = getBrand(id);
  deleteBrand(id);
  await deleteUpload(brand?.logo);
  revalidateSite();
  revalidatePath("/admin/brands");
}

export async function toggleBrandActiveAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  toggleBrandActive(id);
  revalidateSite();
  revalidatePath("/admin/brands");
}

/* ---------------------------------------------------------------- enquiries */

export async function updateEnquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  const status = str(formData, "status");
  if (!id) return;
  if (!(enquiryStatuses as readonly string[]).includes(status)) return;
  updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function updateEnquiryNotesAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  updateEnquiryNotes(id, str(formData, "notes"));
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = numberOrNull(formData, "id");
  if (!id) return;
  deleteEnquiry(id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
