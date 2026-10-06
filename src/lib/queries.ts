import { all, get, run } from "./db";
import { slugify } from "./utils";
import type { Brand, Category, Enquiry, Product, Spec, Variant } from "./types";

/* ------------------------------------------------------------------ helpers */

function bool(value: unknown) {
  return value === 1 || value === true || value === "1";
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

const PRODUCT_SELECT = `
  SELECT p.*,
         c.name AS category_name, c.slug AS category_slug,
         b.name AS brand_name,    b.slug AS brand_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN brands     b ON b.id = p.brand_id
`;

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    sku: String(row.sku ?? ""),
    category_id: row.category_id == null ? null : Number(row.category_id),
    brand_id: row.brand_id == null ? null : Number(row.brand_id),
    short_description: String(row.short_description ?? ""),
    description: String(row.description ?? ""),
    image: String(row.image ?? ""),
    gallery: parseJson<string[]>(row.gallery, []),
    specifications: parseJson<Spec[]>(row.specifications, []),
    applications: parseJson<string[]>(row.applications, []),
    variants: parseJson<Variant[]>(row.variants, []),
    featured: bool(row.featured),
    published: bool(row.published),
    meta_title: String(row.meta_title ?? ""),
    meta_description: String(row.meta_description ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    category_name: row.category_name == null ? null : String(row.category_name),
    category_slug: row.category_slug == null ? null : String(row.category_slug),
    brand_name: row.brand_name == null ? null : String(row.brand_name),
    brand_slug: row.brand_slug == null ? null : String(row.brand_slug),
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    image: String(row.image ?? ""),
    icon: String(row.icon ?? ""),
    active: bool(row.active),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    product_count:
      row.product_count == null ? undefined : Number(row.product_count),
  };
}

function mapBrand(row: Record<string, unknown>): Brand {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    logo: String(row.logo ?? ""),
    active: bool(row.active),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    product_count:
      row.product_count == null ? undefined : Number(row.product_count),
  };
}

function mapEnquiry(row: Record<string, unknown>): Enquiry {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    company: String(row.company ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    product: String(row.product ?? ""),
    quantity: String(row.quantity ?? ""),
    message: String(row.message ?? ""),
    source: String(row.source ?? "Website"),
    status: String(row.status ?? "New"),
    notes: String(row.notes ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

/**
 * Guarantees a unique slug. `excludeId` lets an edit keep its own slug without
 * tripping the uniqueness check.
 */
export function uniqueSlug(
  table: "products" | "categories" | "brands",
  base: string,
  excludeId?: number,
) {
  const root = slugify(base) || table.slice(0, -1);
  let candidate = root;
  let n = 2;
  for (;;) {
    const clash = get<{ id: number }>(
      `SELECT id FROM ${table} WHERE slug = ? ${excludeId ? "AND id != ?" : ""} LIMIT 1`,
      excludeId ? [candidate, excludeId] : [candidate],
    );
    if (!clash) return candidate;
    candidate = `${root}-${n++}`;
  }
}

/* --------------------------------------------------------------- categories */

export function listCategories(options: { activeOnly?: boolean } = {}) {
  const where = options.activeOnly ? "WHERE c.active = 1" : "";
  return all<Record<string, unknown>>(
    `SELECT c.*,
            (SELECT COUNT(*) FROM products p
              WHERE p.category_id = c.id AND p.published = 1) AS product_count
     FROM categories c
     ${where}
     ORDER BY c.sort_order ASC, c.name ASC`,
  ).map(mapCategory);
}

export function getCategoryBySlug(slug: string) {
  const row = get<Record<string, unknown>>(
    "SELECT * FROM categories WHERE slug = ?",
    [slug],
  );
  return row ? mapCategory(row) : null;
}

export function getCategory(id: number) {
  const row = get<Record<string, unknown>>(
    "SELECT * FROM categories WHERE id = ?",
    [id],
  );
  return row ? mapCategory(row) : null;
}

export type CategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  active?: boolean;
  sort_order?: number;
};

export function createCategory(input: CategoryInput) {
  const slug = uniqueSlug("categories", input.slug || input.name);
  const result = run(
    `INSERT INTO categories (name, slug, description, image, icon, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name.trim(),
      slug,
      input.description ?? "",
      input.image ?? "",
      input.icon ?? "",
      input.active === false ? 0 : 1,
      input.sort_order ?? 0,
    ],
  );
  return Number(result.lastInsertRowid);
}

export function updateCategory(id: number, input: CategoryInput) {
  const slug = uniqueSlug("categories", input.slug || input.name, id);
  run(
    `UPDATE categories
       SET name = ?, slug = ?, description = ?, image = ?, icon = ?,
           active = ?, sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [
      input.name.trim(),
      slug,
      input.description ?? "",
      input.image ?? "",
      input.icon ?? "",
      input.active === false ? 0 : 1,
      input.sort_order ?? 0,
      id,
    ],
  );
}

export function deleteCategory(id: number) {
  run("DELETE FROM categories WHERE id = ?", [id]);
}

export function toggleCategoryActive(id: number) {
  run(
    "UPDATE categories SET active = CASE active WHEN 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?",
    [id],
  );
}

/** Moves a category up/down in the display order by swapping sort values. */
export function moveCategory(id: number, direction: "up" | "down") {
  const ordered = listCategories();
  const index = ordered.findIndex((c) => c.id === id);
  if (index < 0) return;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= ordered.length) return;

  const next = [...ordered];
  [next[index], next[target]] = [next[target], next[index]];
  // Re-normalise every row so ties in sort_order cannot block the swap.
  next.forEach((category, position) => {
    run("UPDATE categories SET sort_order = ? WHERE id = ?", [
      position,
      category.id,
    ]);
  });
}

/* -------------------------------------------------------------------- brands */

export function listBrands(options: { activeOnly?: boolean } = {}) {
  const where = options.activeOnly ? "WHERE b.active = 1" : "";
  return all<Record<string, unknown>>(
    `SELECT b.*,
            (SELECT COUNT(*) FROM products p
              WHERE p.brand_id = b.id AND p.published = 1) AS product_count
     FROM brands b
     ${where}
     ORDER BY b.sort_order ASC, b.name ASC`,
  ).map(mapBrand);
}

export function getBrandBySlug(slug: string) {
  const row = get<Record<string, unknown>>(
    "SELECT * FROM brands WHERE slug = ?",
    [slug],
  );
  return row ? mapBrand(row) : null;
}

export function getBrand(id: number) {
  const row = get<Record<string, unknown>>(
    "SELECT * FROM brands WHERE id = ?",
    [id],
  );
  return row ? mapBrand(row) : null;
}

export type BrandInput = {
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  active?: boolean;
  sort_order?: number;
};

export function createBrand(input: BrandInput) {
  const slug = uniqueSlug("brands", input.slug || input.name);
  const result = run(
    `INSERT INTO brands (name, slug, description, logo, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.name.trim(),
      slug,
      input.description ?? "",
      input.logo ?? "",
      input.active === false ? 0 : 1,
      input.sort_order ?? 0,
    ],
  );
  return Number(result.lastInsertRowid);
}

export function updateBrand(id: number, input: BrandInput) {
  const slug = uniqueSlug("brands", input.slug || input.name, id);
  run(
    `UPDATE brands
       SET name = ?, slug = ?, description = ?, logo = ?,
           active = ?, sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [
      input.name.trim(),
      slug,
      input.description ?? "",
      input.logo ?? "",
      input.active === false ? 0 : 1,
      input.sort_order ?? 0,
      id,
    ],
  );
}

export function deleteBrand(id: number) {
  run("DELETE FROM brands WHERE id = ?", [id]);
}

export function toggleBrandActive(id: number) {
  run(
    "UPDATE brands SET active = CASE active WHEN 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?",
    [id],
  );
}

/* ------------------------------------------------------------------ products */

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "name" | "name-desc";
};

function buildProductWhere(filters: ProductFilters) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (!filters.includeUnpublished) clauses.push("p.published = 1");
  if (filters.featured) clauses.push("p.featured = 1");

  if (filters.category) {
    clauses.push("c.slug = ?");
    params.push(filters.category);
  }

  if (filters.brand) {
    clauses.push("b.slug = ?");
    params.push(filters.brand);
  }

  if (filters.q && filters.q.trim()) {
    // Search across name, code, brand, category, descriptions and specs.
    const like = `%${filters.q.trim().toLowerCase()}%`;
    clauses.push(`(
      LOWER(p.name) LIKE ?
      OR LOWER(p.sku) LIKE ?
      OR LOWER(p.short_description) LIKE ?
      OR LOWER(p.description) LIKE ?
      OR LOWER(COALESCE(b.name, '')) LIKE ?
      OR LOWER(COALESCE(c.name, '')) LIKE ?
      OR LOWER(p.specifications) LIKE ?
      OR LOWER(p.applications) LIKE ?
    )`);
    params.push(like, like, like, like, like, like, like, like);
  }

  return { where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

const SORTS: Record<NonNullable<ProductFilters["sort"]>, string> = {
  newest: "p.created_at DESC, p.id DESC",
  oldest: "p.created_at ASC, p.id ASC",
  name: "p.name ASC",
  "name-desc": "p.name DESC",
};

export function listProducts(filters: ProductFilters = {}) {
  const { where, params } = buildProductWhere(filters);
  const order = SORTS[filters.sort ?? "newest"];
  const limit = filters.limit ? `LIMIT ${Number(filters.limit)}` : "";
  const offset = filters.offset ? `OFFSET ${Number(filters.offset)}` : "";

  return all<Record<string, unknown>>(
    `${PRODUCT_SELECT} ${where}
     ORDER BY p.featured DESC, ${order}
     ${limit} ${offset}`,
    params,
  ).map(mapProduct);
}

export function countProducts(filters: ProductFilters = {}) {
  const { where, params } = buildProductWhere(filters);
  const row = get<{ total: number }>(
    `SELECT COUNT(*) AS total
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN brands     b ON b.id = p.brand_id
     ${where}`,
    params,
  );
  return Number(row?.total ?? 0);
}

export function getProductBySlug(slug: string, includeUnpublished = false) {
  const row = get<Record<string, unknown>>(
    `${PRODUCT_SELECT} WHERE p.slug = ? ${
      includeUnpublished ? "" : "AND p.published = 1"
    }`,
    [slug],
  );
  return row ? mapProduct(row) : null;
}

export function getProduct(id: number) {
  const row = get<Record<string, unknown>>(`${PRODUCT_SELECT} WHERE p.id = ?`, [
    id,
  ]);
  return row ? mapProduct(row) : null;
}

export function listProductSlugs() {
  return all<{ slug: string; updated_at: string }>(
    "SELECT slug, updated_at FROM products WHERE published = 1",
  );
}

/** Same category first, then any other published product, to fill the row. */
export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = product.category_id
    ? all<Record<string, unknown>>(
        `${PRODUCT_SELECT}
         WHERE p.published = 1 AND p.id != ? AND p.category_id = ?
         ORDER BY p.featured DESC, RANDOM()
         LIMIT ?`,
        [product.id, product.category_id, limit],
      ).map(mapProduct)
    : [];

  if (sameCategory.length >= limit) return sameCategory;

  const exclude = [product.id, ...sameCategory.map((p) => p.id)];
  const placeholders = exclude.map(() => "?").join(", ");
  const filler = all<Record<string, unknown>>(
    `${PRODUCT_SELECT}
     WHERE p.published = 1 AND p.id NOT IN (${placeholders})
     ORDER BY p.featured DESC, RANDOM()
     LIMIT ?`,
    [...exclude, limit - sameCategory.length],
  ).map(mapProduct);

  return [...sameCategory, ...filler];
}

export type ProductInput = {
  name: string;
  slug?: string;
  sku?: string;
  category_id?: number | null;
  brand_id?: number | null;
  short_description?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  specifications?: Spec[];
  applications?: string[];
  variants?: Variant[];
  featured?: boolean;
  published?: boolean;
  meta_title?: string;
  meta_description?: string;
};

function productValues(input: ProductInput, slug: string) {
  return [
    input.name.trim(),
    slug,
    input.sku ?? "",
    input.category_id ?? null,
    input.brand_id ?? null,
    input.short_description ?? "",
    input.description ?? "",
    input.image ?? "",
    JSON.stringify(input.gallery ?? []),
    JSON.stringify(input.specifications ?? []),
    JSON.stringify(input.applications ?? []),
    JSON.stringify(input.variants ?? []),
    input.featured ? 1 : 0,
    input.published === false ? 0 : 1,
    input.meta_title ?? "",
    input.meta_description ?? "",
  ];
}

export function createProduct(input: ProductInput) {
  const slug = uniqueSlug("products", input.slug || input.name);
  const result = run(
    `INSERT INTO products
      (name, slug, sku, category_id, brand_id, short_description, description,
       image, gallery, specifications, applications, variants, featured,
       published, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    productValues(input, slug),
  );
  return { id: Number(result.lastInsertRowid), slug };
}

export function updateProduct(id: number, input: ProductInput) {
  const slug = uniqueSlug("products", input.slug || input.name, id);
  run(
    `UPDATE products SET
       name = ?, slug = ?, sku = ?, category_id = ?, brand_id = ?,
       short_description = ?, description = ?, image = ?, gallery = ?,
       specifications = ?, applications = ?, variants = ?, featured = ?,
       published = ?, meta_title = ?, meta_description = ?,
       updated_at = datetime('now')
     WHERE id = ?`,
    [...productValues(input, slug), id],
  );
  return { id, slug };
}

export function deleteProduct(id: number) {
  run("DELETE FROM products WHERE id = ?", [id]);
}

export function toggleProductPublished(id: number) {
  run(
    "UPDATE products SET published = CASE published WHEN 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?",
    [id],
  );
}

export function toggleProductFeatured(id: number) {
  run(
    "UPDATE products SET featured = CASE featured WHEN 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?",
    [id],
  );
}

/** Copies a product as an unpublished draft so the admin can tweak and publish. */
export function duplicateProduct(id: number) {
  const source = getProduct(id);
  if (!source) return null;
  return createProduct({
    ...source,
    name: `${source.name} (Copy)`,
    slug: undefined,
    sku: source.sku ? `${source.sku}-COPY` : "",
    published: false,
    featured: false,
  });
}

/* ----------------------------------------------------------------- enquiries */

export type EnquiryInput = {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  product?: string;
  quantity?: string;
  message: string;
  source?: string;
};

export function createEnquiry(input: EnquiryInput) {
  const result = run(
    `INSERT INTO enquiries (name, company, phone, email, product, quantity, message, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name.trim(),
      input.company?.trim() ?? "",
      input.phone.trim(),
      input.email?.trim() ?? "",
      input.product?.trim() ?? "",
      input.quantity?.trim() ?? "",
      input.message.trim(),
      input.source ?? "Website",
    ],
  );
  return Number(result.lastInsertRowid);
}

export function listEnquiries(
  filters: { q?: string; status?: string; limit?: number } = {},
) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.status && filters.status !== "All") {
    clauses.push("status = ?");
    params.push(filters.status);
  }

  if (filters.q && filters.q.trim()) {
    const like = `%${filters.q.trim().toLowerCase()}%`;
    clauses.push(`(
      LOWER(name) LIKE ? OR LOWER(company) LIKE ? OR phone LIKE ?
      OR LOWER(email) LIKE ? OR LOWER(product) LIKE ? OR LOWER(message) LIKE ?
    )`);
    params.push(like, like, like, like, like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = filters.limit ? `LIMIT ${Number(filters.limit)}` : "";

  return all<Record<string, unknown>>(
    `SELECT * FROM enquiries ${where} ORDER BY created_at DESC, id DESC ${limit}`,
    params,
  ).map(mapEnquiry);
}

export function getEnquiry(id: number) {
  const row = get<Record<string, unknown>>(
    "SELECT * FROM enquiries WHERE id = ?",
    [id],
  );
  return row ? mapEnquiry(row) : null;
}

export function updateEnquiryStatus(id: number, status: string) {
  run(
    "UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?",
    [status, id],
  );
}

export function updateEnquiryNotes(id: number, notes: string) {
  run(
    "UPDATE enquiries SET notes = ?, updated_at = datetime('now') WHERE id = ?",
    [notes, id],
  );
}

export function deleteEnquiry(id: number) {
  run("DELETE FROM enquiries WHERE id = ?", [id]);
}

export function enquiryCounts() {
  const rows = all<{ status: string; total: number }>(
    "SELECT status, COUNT(*) AS total FROM enquiries GROUP BY status",
  );
  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    counts[row.status] = Number(row.total);
    total += Number(row.total);
  }
  return { counts, total };
}

/* ---------------------------------------------------------------- dashboard */

export function dashboardStats() {
  const one = (sql: string) => Number(get<{ n: number }>(sql)?.n ?? 0);
  return {
    products: one("SELECT COUNT(*) AS n FROM products"),
    published: one("SELECT COUNT(*) AS n FROM products WHERE published = 1"),
    featured: one("SELECT COUNT(*) AS n FROM products WHERE featured = 1"),
    categories: one("SELECT COUNT(*) AS n FROM categories"),
    brands: one("SELECT COUNT(*) AS n FROM brands"),
    enquiries: one("SELECT COUNT(*) AS n FROM enquiries"),
    newEnquiries: one("SELECT COUNT(*) AS n FROM enquiries WHERE status = 'New'"),
  };
}
