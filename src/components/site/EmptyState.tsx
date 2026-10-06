import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { ReactNode } from "react";

import { WhatsAppIcon } from "@/components/ui/icons";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Friendly "nothing here" panel. Always offers a WhatsApp route out, because a
 * product we do not list yet is still a product we can usually source.
 */
export function EmptyState({
  title = "No products found",
  body = "We could not find anything matching your search. Try a different keyword or clear the filters — or ask us directly, we stock more than is listed here.",
  action,
  context,
}: {
  title?: string;
  body?: string;
  action?: ReactNode;
  context?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-steel-300 bg-steel-50 px-6 py-14 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-steel-400 shadow-sm">
        <PackageSearch className="h-6 w-6" strokeWidth={1.9} />
      </span>

      <h3 className="mt-5 font-display text-[19px] font-bold text-navy-900">
        {title}
      </h3>
      <p className="mx-auto mt-2.5 max-w-md text-[14px] leading-relaxed text-steel-600">
        {body}
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {action ?? (
          <Link
            href="/products"
            className="inline-flex h-11 items-center rounded-md border border-steel-300 bg-white px-5 text-[14px] font-semibold text-navy-800 transition hover:border-navy-400"
          >
            View all products
          </Link>
        )}
        <a
          href={generalWhatsAppUrl(context)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-[#1FA855] px-5 text-[14px] font-semibold text-white transition hover:bg-[#178c46]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
