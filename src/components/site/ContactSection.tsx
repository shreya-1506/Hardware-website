import { Clock, MapPin, Navigation, Phone } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { formatPhone, telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;

export function ContactSection() {
  return (
    <section id="contact" className="bg-white py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Location & contact"
          title="Visit us at MIDC Shiroli, Kolhapur"
          intro="Walk in for over-the-counter supply, or send your requirement ahead on WhatsApp and we will have it ready."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Details */}
          <Reveal className="grid gap-4">
            <div className="rounded-lg border border-steel-200 bg-white p-6 shadow-card sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-navy-800 text-safety-400">
                  <MapPin className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-bold text-navy-900">
                    {site.name} &amp; {site.partner}
                  </h3>
                  <address className="mt-2 text-[14px] not-italic leading-relaxed text-steel-600">
                    {site.address.line1},
                    <br />
                    {site.address.line2},
                    <br />
                    {site.address.city}, {site.address.state} —{" "}
                    {site.address.postalCode}
                    <br />
                    {site.address.country}
                  </address>

                  <ButtonAnchor
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Navigation className="h-3.5 w-3.5" strokeWidth={2.4} />
                    Get directions
                  </ButtonAnchor>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {site.contacts.map((contact) => (
                <div
                  key={contact.phone}
                  className="flex flex-col rounded-lg border border-steel-200 bg-white p-6 shadow-card"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">
                    {contact.role}
                  </p>
                  <h3 className="mt-2 font-display text-[16.5px] font-bold text-navy-900">
                    {contact.name}
                  </h3>
                  <p className="mt-1 text-[15px] font-semibold tabular-nums text-safety-600">
                    {formatPhone(contact.phone)}
                  </p>

                  <div className="mt-auto grid gap-2 pt-5">
                    <ButtonAnchor
                      href={telHref(contact.phone)}
                      variant="dark"
                      size="sm"
                    >
                      <Phone className="h-3.5 w-3.5" strokeWidth={2.4} />
                      Call now
                    </ButtonAnchor>
                    {contact.whatsapp && (
                      <ButtonAnchor
                        href={generalWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="whatsapp"
                        size="sm"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                        WhatsApp
                      </ButtonAnchor>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-steel-200 bg-steel-50 p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white text-navy-700 shadow-sm">
                  <Clock className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-navy-900">
                    Business hours
                  </h3>
                  <dl className="mt-2.5 space-y-1.5">
                    {site.hours.map((entry) => (
                      <div
                        key={entry.days}
                        className="flex flex-wrap gap-x-3 text-[14px]"
                      >
                        <dt className="font-medium text-steel-700">
                          {entry.days}
                        </dt>
                        <dd className="text-steel-500">{entry.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.12} className="min-h-[420px]">
            <div className="relative h-full overflow-hidden rounded-lg border border-steel-200 shadow-card">
              <iframe
                title={`Map showing ${site.name} at ${site.mapQuery}`}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[420px] w-full border-0"
                allowFullScreen
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-navy-900/10"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
