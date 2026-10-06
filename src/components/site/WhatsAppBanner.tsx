import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { GearGlyph, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

/** Full-width conversion banner used near the bottom of long pages. */
export function WhatsAppBanner({
  title = "Send us your requirement on WhatsApp",
  body = "Share the product, grade and quantity you need. We will reply with price, availability and delivery time — usually the same working day.",
  context,
}: {
  title?: string;
  body?: string;
  context?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-steel-sheen py-14 lg:py-20">
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint bg-grid opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(100%_100%_at_80%_20%,rgba(249,112,8,0.16),transparent_55%)]"
      />
      <GearGlyph
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-[340px] w-[340px] animate-spin-slow text-white/[0.06]"
      />

      <div className="container-x relative">
        <Reveal className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow-light">
              <span aria-hidden className="h-[2px] w-6 bg-current opacity-70" />
              Fastest way to order
            </p>
            <h2 className="mt-3 font-display text-[26px] font-bold leading-tight text-white sm:text-[32px] lg:text-[36px]">
              {title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65 sm:text-base">
              {body}
            </p>
            <p className="mt-4 text-[13px] text-white/45">
              Messages go directly to{" "}
              <span className="font-semibold text-white/80">
                {site.whatsapp.contactName}
              </span>{" "}
              — {site.whatsapp.displayNumber}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={generalWhatsAppUrl(context)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-md bg-[#1FA855] px-7 text-[15px] font-semibold text-white shadow-[0_16px_36px_-16px_rgba(31,168,85,0.9)] transition hover:bg-[#178c46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>

            <a
              href={telHref(site.contacts[0].phone)}
              className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-md border border-white/25 bg-white/[0.06] px-7 text-[15px] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" strokeWidth={2.4} />
              Call {site.contacts[0].phone}
            </a>

            <Link
              href="/enquiry"
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-md px-4 text-[14px] font-semibold text-white/70 transition hover:text-safety-400"
            >
              Use the enquiry form
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
