"use client";

import { Phone } from "lucide-react";
import { useEffect } from "react";

import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { telHref } from "@/lib/utils";

/**
 * Mobile-only sticky enquiry bar for product pages. While mounted it hides the
 * global floating bubble (see globals.css) so the two never stack.
 */
export function ProductStickyCta({
  productName,
  whatsappUrl,
}: {
  productName: string;
  whatsappUrl: string;
}) {
  useEffect(() => {
    document.documentElement.classList.add("has-sticky-cta");
    return () => document.documentElement.classList.remove("has-sticky-cta");
  }, []);

  return (
    <>
      {/* Keeps the bar from covering the end of the page content. */}
      <div aria-hidden className="h-[76px] lg:hidden" />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-steel-200 bg-white/97 px-4 py-3 shadow-[0_-8px_24px_-16px_rgba(13,31,55,0.5)] backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2.5">
          <a
            href={telHref(site.contacts[0].phone)}
            aria-label={`Call ${site.contacts[0].name}`}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-steel-300 text-navy-800 transition hover:bg-steel-50"
          >
            <Phone className="h-5 w-5" strokeWidth={2.2} />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${productName} on WhatsApp`}
            className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-md bg-[#1FA855] text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(31,168,85,0.9)] transition hover:bg-[#178c46]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
