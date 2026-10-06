"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

type SelectFilter = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};

/**
 * Shared search + dropdown filter strip for the admin list screens. Everything
 * is driven through the URL so links are shareable and the back button works.
 */
export function AdminSearchBar({
  basePath,
  placeholder = "Search…",
  filters = [],
}: {
  basePath: string;
  placeholder?: string;
  filters?: SelectFilter[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const q = params.get("q") ?? "";
  const [term, setTerm] = useState(q);

  useEffect(() => setTerm(q), [q]);

  function push(next: Record<string, string | null>) {
    const search = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) search.delete(key);
      else search.set(key, value);
    }
    const query = search.toString();
    startTransition(() => router.push(query ? `${basePath}?${query}` : basePath));
  }

  const hasFilters =
    Boolean(q) || filters.some((filter) => params.get(filter.name));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          push({ q: term.trim() || null });
        }}
        className="relative flex-1"
      >
        <label htmlFor={`${basePath}-search`} className="sr-only">
          {placeholder}
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
          strokeWidth={2.2}
        />
        <input
          id={`${basePath}-search`}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-md border border-steel-300 bg-white pl-10 pr-3.5 text-[14px] text-navy-900 outline-none transition placeholder:text-steel-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-500/15"
        />
      </form>

      {filters.map((filter) => (
        <div key={filter.name} className="sm:w-[190px]">
          <label htmlFor={`filter-${filter.name}`} className="sr-only">
            {filter.label}
          </label>
          <select
            id={`filter-${filter.name}`}
            value={params.get(filter.name) ?? ""}
            onChange={(event) => push({ [filter.name]: event.target.value })}
            className="h-11 w-full rounded-md border border-steel-300 bg-white px-3.5 text-[14px] font-medium text-navy-900 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-500/15"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasFilters && (
        <button
          type="button"
          onClick={() =>
            push(
              Object.fromEntries([
                ["q", null],
                ...filters.map((filter) => [filter.name, null] as const),
              ]),
            )
          }
          className="inline-flex h-11 items-center gap-1.5 rounded-md border border-steel-300 px-4 text-[13.5px] font-semibold text-steel-600 transition hover:border-navy-400 hover:text-navy-900"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.6} />
          Clear
        </button>
      )}
    </div>
  );
}
