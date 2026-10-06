import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Factory,
  MapPin,
  PackageCheck,
  Target,
  Users,
} from "lucide-react";

import { ContactSection } from "@/components/site/ContactSection";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppBanner } from "@/components/site/WhatsAppBanner";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Counter } from "@/components/ui/Counter";
import { CaliperGlyph } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { countProducts, listBrands, listCategories } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — Industrial Hardware Distributors in MIDC Shiroli, Kolhapur",
  description:
    "Industrial Prime System and Vijay Enterprises are partner firms distributing industrial hardware, machine tools, safety materials, material handling products and adhesives from MIDC Shiroli, Kolhapur.",
  alternates: { canonical: "/about" },
};

const SERVES = [
  "Automobile ancillary units",
  "Foundries and forging shops",
  "Fabrication and structural workshops",
  "CNC machining and toolroom units",
  "Textile and processing plants",
  "Plant maintenance departments",
  "Contractors and erection teams",
  "Government and institutional buyers",
];

/**
 * Rendered per request: the catalogue lives in SQLite and the admin panel edits
 * it at runtime, so a build-time snapshot would keep serving withdrawn products.
 */
export const dynamic = "force-dynamic";

export default function AboutPage() {
  const categories = listCategories({ activeOnly: true });
  const brands = listBrands({ activeOnly: true });
  const products = countProducts();

  return (
    <>
      <PageHeader
        eyebrow="About the firms"
        title="Two partner firms, one industrial supply counter"
        crumbs={[{ label: "About Us" }]}
        intro={`${site.name} and ${site.partner} supply industrial hardware materials, machine tools, safety materials, material handling products, adhesives and related industrial products to manufacturing units across Kolhapur and Western Maharashtra.`}
      />

      {/* Story */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">
                <span
                  aria-hidden
                  className="h-[2px] w-6 bg-current opacity-70"
                />
                Who we are
              </p>
              <h2 className="mt-3 font-display text-[27px] font-bold leading-[1.15] text-navy-900 sm:text-[32px]">
                Supplying the shop floor, not a shopping cart
              </h2>

              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-steel-600">
                <p>
                  Industrial buying is not retail. The buyer already knows the
                  application; what they need is the correct grade, the correct
                  size, an honest answer on availability, and a delivery that
                  arrives before the line stops. That is the business we are in.
                </p>
                <p>
                  <strong className="font-semibold text-navy-800">
                    {site.name}
                  </strong>{" "}
                  and{" "}
                  <strong className="font-semibold text-navy-800">
                    {site.partner}
                  </strong>{" "}
                  operate together from MIDC Shiroli, Kolhapur. Between the two
                  firms we cover industrial hardware, machine tools and
                  workholding, cutting and measuring tools, safety materials,
                  material handling equipment, adhesives and sealants,
                  lubricants and everyday shop-floor consumables.
                </p>
                <p>
                  We carry brands including{" "}
                  {brands.map((brand, index) => (
                    <span key={brand.id}>
                      <strong className="font-semibold text-navy-800">
                        {brand.name}
                      </strong>
                      {index < brands.length - 2
                        ? ", "
                        : index === brands.length - 2
                          ? " and "
                          : ""}
                    </span>
                  ))}{" "}
                  alongside a broad general line. Where a specification is
                  critical, we supply the branded item; where it is not, we help
                  the buyer save money without compromising the job.
                </p>
                <p>
                  Enquiries come to us the way our customers actually work — a
                  WhatsApp message, a phone call, or a walk-in at the counter.
                  There is no portal to log into and no minimum order value.
                </p>
              </div>

              <CaliperGlyph aria-hidden className="mt-8 h-8 w-40 text-steel-300" />
            </Reveal>

            {/* Numbers + firms */}
            <div className="space-y-5">
              <Reveal direction="left">
                <div className="relative overflow-hidden rounded-lg bg-steel-sheen p-7 text-white shadow-card">
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-blueprint bg-grid opacity-60"
                  />
                  <div className="relative">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-safety-400">
                      At a glance
                    </p>
                    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
                      {[
                        { value: categories.length, label: "Product categories" },
                        { value: products, label: "Products listed online" },
                        { value: brands.length, label: "Featured brands" },
                        { value: 15, label: "Years in the trade", suffix: "+" },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <dd className="font-display text-[30px] font-bold leading-none text-white">
                            <Counter to={stat.value} suffix={stat.suffix ?? ""} />
                          </dd>
                          <dt className="mt-2 text-[12.5px] leading-snug text-white/55">
                            {stat.label}
                          </dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </Reveal>

              {[
                {
                  icon: Building2,
                  name: site.name,
                  body: "Industrial hardware, machine tools, cutting and measuring tools, and workholding equipment for production and toolroom requirements.",
                },
                {
                  icon: Factory,
                  name: site.partner,
                  body: "Safety materials, material handling equipment, adhesives, sealants, lubricants and shop-floor consumables for plant maintenance.",
                },
              ].map((firm) => {
                const Icon = firm.icon;
                return (
                  <Reveal key={firm.name} direction="left" delay={0.08}>
                    <div className="flex gap-5 rounded-lg border border-steel-200 bg-white p-6 shadow-card">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-navy-800 text-safety-400">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <div>
                        <h3 className="font-display text-[16px] font-bold text-navy-900">
                          {firm.name}
                        </h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-steel-600">
                          {firm.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="relative overflow-hidden bg-steel-50 py-16 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-blueprint-light bg-grid opacity-60"
        />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built around how industrial buyers actually purchase"
            intro="Our customers are purchase officers, maintenance engineers, production supervisors and proprietors — people who need the right part today, not a catalogue."
          />

          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVES.map((item) => (
              <RevealItem key={item}>
                <div className="flex h-full items-start gap-3 rounded-lg border border-steel-200 bg-white p-5 shadow-sm">
                  <PackageCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-safety-500"
                    strokeWidth={2.2}
                  />
                  <span className="text-[13.5px] font-medium leading-snug text-navy-800">
                    {item}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-12">
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "Where we deliver",
                  body: site.serviceAreas.join(", ") + ".",
                },
                {
                  icon: Target,
                  title: "How we quote",
                  body: "Enquiry in, quotation out — with the exact make, grade and pack size stated so there are no surprises at goods inward.",
                },
                {
                  icon: Users,
                  title: "Who you deal with",
                  body: `${site.contacts.map((contact) => contact.name).join(" and ")} handle enquiries personally. You are not routed through a call centre.`,
                },
              ].map((block) => {
                const Icon = block.icon;
                return (
                  <div
                    key={block.title}
                    className="rounded-lg border border-steel-200 bg-white p-6 shadow-card"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-steel-100 text-navy-700">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="mt-4 font-display text-[15.5px] font-bold text-navy-900">
                      {block.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-steel-600">
                      {block.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.14} className="mt-10">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-safety-500 px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,112,8,0.9)] transition hover:bg-safety-600"
            >
              Explore the product catalogue
              <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <WhyChooseUs />
      <WhatsAppBanner context="About page enquiry" />
      <ContactSection />
    </>
  );
}
