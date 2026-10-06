import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, FileText, MessageSquareText, Phone } from "lucide-react";

import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { formatPhone, telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Send an Enquiry — Request a Quotation",
  description:
    "Send your industrial hardware, machine tool, safety or adhesive requirement to Industrial Prime System & Vijay Enterprises, Kolhapur. Submit the enquiry form or send it straight to WhatsApp.",
  alternates: { canonical: "/enquiry" },
};

const STEPS = [
  {
    icon: FileText,
    title: "1. Tell us what you need",
    body: "Product name, part number, grade, size or a description of the application — whatever you have. A photo of the old part works too.",
  },
  {
    icon: MessageSquareText,
    title: "2. We check and quote",
    body: "We confirm the correct specification, check counter stock and reply with price, pack size and lead time.",
  },
  {
    icon: Clock,
    title: "3. You confirm and we dispatch",
    body: "Confirm the quotation and we raise the invoice and arrange delivery, or hold it ready for collection at Shiroli.",
  },
];

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Enquiry"
        title="Send us your requirement"
        crumbs={[{ label: "Enquiry" }]}
        intro="Industrial supply works on enquiry and quotation, not carts and checkouts. Fill in the form below, or send the same details straight to WhatsApp — whichever is quicker for you."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor
            href={generalWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="md"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            WhatsApp {site.whatsapp.contactName}
          </ButtonAnchor>
          <ButtonAnchor
            href={telHref(site.contacts[0].phone)}
            variant="outline-light"
            size="md"
          >
            <Phone className="h-4 w-4" strokeWidth={2.4} />
            {formatPhone(site.contacts[0].phone)}
          </ButtonAnchor>
        </div>
      </PageHeader>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            {/* Form */}
            <Reveal>
              <div className="rounded-lg border border-steel-200 bg-steel-50 p-6 shadow-card sm:p-8">
                <h2 className="font-display text-[21px] font-bold text-navy-900">
                  Enquiry form
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-steel-600">
                  Your enquiry is recorded and reaches our team immediately. We
                  respond the same working day for messages received during
                  business hours.
                </p>

                <div className="mt-7">
                  <Suspense fallback={<div className="h-[520px]" />}>
                    <EnquiryForm
                      defaultProduct={product ?? ""}
                      source="Enquiry page"
                    />
                  </Suspense>
                </div>
              </div>
            </Reveal>

            {/* How it works */}
            <div className="space-y-5">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} direction="left" delay={index * 0.08}>
                    <div className="flex gap-5 rounded-lg border border-steel-200 bg-white p-6 shadow-card">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-navy-800 text-safety-400">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <div>
                        <h3 className="font-display text-[15.5px] font-bold text-navy-900">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-steel-600">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}

              <Reveal direction="left" delay={0.24}>
                <div className="relative overflow-hidden rounded-lg bg-steel-sheen p-6 text-white shadow-card">
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-blueprint bg-grid-sm opacity-50"
                  />
                  <div className="relative">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-safety-400">
                      Prefer to talk?
                    </p>
                    <h3 className="mt-2 font-display text-[17px] font-bold">
                      Call or WhatsApp us directly
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {site.contacts.map((contact) => (
                        <li key={contact.phone}>
                          <a
                            href={telHref(contact.phone)}
                            className="flex items-center justify-between gap-3 rounded-md border border-white/12 bg-white/[0.06] px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                          >
                            <span>
                              <span className="block text-[14px] font-semibold text-white">
                                {contact.name}
                              </span>
                              <span className="block text-[11.5px] text-white/50">
                                {contact.role}
                              </span>
                            </span>
                            <span className="text-[13.5px] font-semibold tabular-nums text-safety-400">
                              {contact.phone}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 border-t border-white/10 pt-4 text-[12.5px] text-white/50">
                      {site.hours.map((entry) => (
                        <p key={entry.days}>
                          {entry.days} — {entry.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
