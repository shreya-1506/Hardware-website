import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** Builds a compact page list: 1 … 4 5 6 … 12 */
function pageWindow(current: number, total: number) {
  const pages = new Set<number>([1, total, current]);
  for (const offset of [-1, 1]) {
    const page = current + offset;
    if (page > 1 && page < total) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  /** Current query string values to carry across, minus `page`. */
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = pageWindow(page, totalPages);

  const linkClass =
    "grid h-10 min-w-10 place-items-center rounded-md border px-3 text-[13.5px] font-semibold transition";

  return (
    <nav
      aria-label="Product pages"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={cn(
            linkClass,
            "border-steel-300 text-navy-800 hover:border-navy-400 hover:bg-steel-50",
          )}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          <span className="sr-only">Previous page</span>
        </Link>
      ) : (
        <span
          className={cn(linkClass, "border-steel-200 text-steel-300")}
          aria-disabled="true"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </span>
      )}

      {pages.map((target, index) => {
        const previous = pages[index - 1];
        const gap = previous !== undefined && target - previous > 1;
        return (
          <span key={target} className="flex items-center gap-2">
            {gap && <span className="px-1 text-steel-400">…</span>}
            {target === page ? (
              <span
                aria-current="page"
                className={cn(
                  linkClass,
                  "border-navy-800 bg-navy-800 text-white",
                )}
              >
                {target}
              </span>
            ) : (
              <Link
                href={href(target)}
                className={cn(
                  linkClass,
                  "border-steel-300 text-navy-800 hover:border-navy-400 hover:bg-steel-50",
                )}
              >
                {target}
              </Link>
            )}
          </span>
        );
      })}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          rel="next"
          className={cn(
            linkClass,
            "border-steel-300 text-navy-800 hover:border-navy-400 hover:bg-steel-50",
          )}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
          <span className="sr-only">Next page</span>
        </Link>
      ) : (
        <span
          className={cn(linkClass, "border-steel-200 text-steel-300")}
          aria-disabled="true"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
        </span>
      )}
    </nav>
  );
}
