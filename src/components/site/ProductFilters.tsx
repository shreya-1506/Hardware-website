"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";

type Option = { name: string; slug: string; product_count?: number };

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "name", label: "Name (A – Z)" },
  { value: "name-desc", label: "Name (Z – A)" },
  { value: "oldest", label: "Oldest first" },
];

export function ProductFilters({
  categories,
  brands,
  total,
}: {
  categories: Option[];
  brands: Option[];
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const sort = params.get("sort") ?? "newest";

  const [term, setTerm] = useState(q);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keep the input in step when the URL changes from elsewhere (nav search,
  // back button, cleared chips).
  useEffect(() => setTerm(q), [q]);

  function push(next: Record<string, string | null>) {
    const search = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") search.delete(key);
      else search.set(key, value);
    }
    search.delete("page");
    const query = search.toString();
    startTransition(() => {
      router.push(query ? `/products?${query}` : "/products", { scroll: false });
    });
  }

  const activeCount = [q, category, brand].filter(Boolean).length;

  const selectClass =
    "h-11 w-full appearance-none rounded-md border border-steel-300 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2377869A%22 stroke-width=%222.4%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pl-3.5 pr-10 text-[14px] font-medium text-navy-900 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-500/15";

  return (
    <div className="sticky top-[72px] z-30 -mx-4 border-b border-steel-200 bg-white/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            push({ q: term.trim() || null });
          }}
          className="relative flex-1 lg:max-w-md"
        >
          <label htmlFor="catalog-search" className="sr-only">
            Search products
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
            strokeWidth={2.2}
          />
          <input
            id="catalog-search"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by product, code, brand or specification…"
            className="h-11 w-full rounded-md border border-steel-300 bg-steel-50 pl-10 pr-24 text-[14px] text-navy-900 outline-none transition placeholder:text-steel-400 focus:border-navy-400 focus:bg-white focus:ring-2 focus:ring-navy-500/15"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded bg-navy-800 px-3.5 text-[12.5px] font-semibold text-white transition hover:bg-navy-700"
          >
            Search
          </button>
        </form>

        {/* Desktop selects */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-[190px]">
            <label htmlFor="filter-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(event) => push({ category: event.target.value })}
              className={selectClass}
            >
              <option value="">All categories</option>
              {categories.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name} ({option.product_count ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div className="w-[170px]">
            <label htmlFor="filter-brand" className="sr-only">
              Filter by brand
            </label>
            <select
              id="filter-brand"
              value={brand}
              onChange={(event) => push({ brand: event.target.value })}
              className={selectClass}
            >
              <option value="">All brands</option>
              {brands.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name} ({option.product_count ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div className="w-[160px]">
            <label htmlFor="filter-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(event) => push({ sort: event.target.value })}
              className={selectClass}
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          className="flex h-11 items-center justify-center gap-2 rounded-md border border-steel-300 px-4 text-[14px] font-semibold text-navy-800 transition hover:bg-steel-50 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
          Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-safety-500 px-1 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile selects */}
      {mobileOpen && (
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:hidden">
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => push({ category: event.target.value })}
            className={selectClass}
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name} ({option.product_count ?? 0})
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by brand"
            value={brand}
            onChange={(event) => push({ brand: event.target.value })}
            className={selectClass}
          >
            <option value="">All brands</option>
            {brands.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name} ({option.product_count ?? 0})
              </option>
            ))}
          </select>

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => push({ sort: event.target.value })}
            className={selectClass}
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Result count + active chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
        <span
          className={cn(
            "font-semibold text-steel-600 transition-opacity",
            pending && "opacity-50",
          )}
        >
          <Filter className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2.2} />
          {total} {total === 1 ? "product" : "products"}
        </span>

        {q && (
          <Chip label={`“${q}”`} onClear={() => push({ q: null })} />
        )}
        {category && (
          <Chip
            label={
              categories.find((option) => option.slug === category)?.name ??
              category
            }
            onClear={() => push({ category: null })}
          />
        )}
        {brand && (
          <Chip
            label={
              brands.find((option) => option.slug === brand)?.name ?? brand
            }
            onClear={() => push({ brand: null })}
          />
        )}
        {activeCount > 1 && (
          <button
            type="button"
            onClick={() => push({ q: null, category: null, brand: null })}
            className="text-[12.5px] font-semibold text-safety-600 underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-steel-300 bg-steel-50 py-1 pl-3 pr-1.5 text-[12.5px] font-medium text-navy-800">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove filter ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full text-steel-500 transition hover:bg-steel-200 hover:text-navy-900"
      >
        <X className="h-3 w-3" strokeWidth={2.6} />
      </button>
    </span>
  );
}
