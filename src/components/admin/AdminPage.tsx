import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/** Consistent page frame for every admin screen. */
export function AdminPage({
  title,
  description,
  crumbs = [],
  actions,
  children,
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-steel-500">
            <li>
              <Link href="/admin" className="transition hover:text-navy-900">
                Dashboard
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                <ChevronRight
                  className="h-3.5 w-3.5 text-steel-300"
                  strokeWidth={2.4}
                />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition hover:text-navy-900"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-navy-800">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 border-b border-steel-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[24px] font-bold leading-tight text-navy-900 sm:text-[28px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-steel-600">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap gap-2.5">{actions}</div>
        )}
      </div>

      <div className="pt-7">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card ${className}`}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-steel-200 bg-steel-50 px-5 py-4">
          <div>
            {title && (
              <h2 className="font-display text-[15px] font-bold text-navy-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-[12.5px] text-steel-500">
                {description}
              </p>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
