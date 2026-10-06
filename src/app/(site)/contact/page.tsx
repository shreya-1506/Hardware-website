import type { Metadata } from "next";

import { ContactSection } from "@/components/site/ContactSection";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHeader } from "@/components/site/PageHeader";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { formatPhone, telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us — MIDC Shiroli, Kolhapur",
  description:
    "Contact Industrial Prime System & Vijay Enterprises at MIDC Shiroli, Near Parmar Petrol Pump, Shiye Bawda Road, Kolhapur. Call Anmol Patil 9146436464 or Vijay Patil 9422421458.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us about your requirement"
        crumbs={[{ label: "Contact" }]}
        intro={`Call, WhatsApp or visit the counter at ${site.address.line1}, ${site.address.city}. We are happy to advise on product selection before you order.`}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor
            href={generalWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="md"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            WhatsApp {site.whatsapp.contactName}
          </ButtonAnchor>
          {site.contacts.map((contact) => (
            <ButtonAnchor
              key={contact.phone}
              href={telHref(contact.phone)}
              variant="outline-light"
              size="md"
            >
              {contact.name} · {formatPhone(contact.phone)}
            </ButtonAnchor>
          ))}
        </div>
      </PageHeader>

      <ContactSection />

      <section className="border-t border-steel-200 bg-steel-50 py-14 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <Reveal className="text-center">
              <p className="eyebrow justify-center">
                <span
                  aria-hidden
                  className="h-[2px] w-6 bg-current opacity-70"
                />
                Written enquiry
              </p>
              <h2 className="mt-3 font-display text-[26px] font-bold text-navy-900 sm:text-[31px]">
                Send your requirement in writing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-steel-600">
                Useful when you need a formal quotation, or when the requirement
                is long enough that a list is easier than a phone call.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div className="rounded-lg border border-steel-200 bg-white p-6 shadow-card sm:p-8">
                <EnquiryForm source="Contact page" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WhatsAppBanner context="Contact page enquiry" />
    </>
  );
}
