import Link from "next/link";
import { Home, PackageSearch, Search } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/icons";
import { listCategories } from "@/lib/queries";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

export function NotFoundContent() {
  const categories = listCategories({ activeOnly: true }).slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-steel-sheen py-20 lg:py-28">
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint bg-grid opacity-60"
      />

      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-lg border border-white/15 bg-white/[0.06] text-safety-400">
            <PackageSearch className="h-7 w-7" strokeWidth={1.8} />
          </span>

          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-safety-400">
            Error 404
          </p>
          <h1 className="mt-3 font-display text-[32px] font-bold leading-tight text-white sm:text-[42px]">
            This page is not on the shelf
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/65">
            The page or product you were looking for has moved or no longer
            exists. Try the catalogue search, or ask us directly — if it is an
            industrial item, there is a good chance we can supply it.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-safety-500 px-6 text-[14px] font-semibold text-white transition hover:bg-safety-600"
            >
              <Search className="h-4 w-4" strokeWidth={2.4} />
              Search the catalogue
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 bg-white/[0.06] px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10"
            >
              <Home className="h-4 w-4" strokeWidth={2.4} />
              Back to home
            </Link>
            <a
              href={generalWhatsAppUrl("Could not find a page on the website")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[#1FA855] px-6 text-[14px] font-semibold text-white transition hover:bg-[#178c46]"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Ask on WhatsApp
            </a>
          </div>

          {categories.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                Popular categories
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="rounded-md border border-white/15 bg-white/[0.05] px-4 py-2 text-[13px] font-medium text-white/75 transition hover:border-safety-400/50 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
