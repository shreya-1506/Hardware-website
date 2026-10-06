import Link from "next/link";
import { ArrowRight, Building2, Handshake, PackageCheck } from "lucide-react";

import { CaliperGlyph } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

const PILLARS = [
  {
    icon: Building2,
    title: "Two firms, one counter",
    body: "Industrial Prime System and Vijay Enterprises operate together, so a single enquiry covers the combined range and stock of both firms.",
  },
  {
    icon: PackageCheck,
    title: "Maintenance and production supply",
    body: "From a single bottle of thread locker for a breakdown to monthly schedules of abrasives and fasteners for a production line.",
  },
  {
    icon: Handshake,
    title: "Relationships, not transactions",
    body: "Most of our business is repeat business from plants in and around Kolhapur — which is only possible if the last order went right.",
  },
];

export function AboutIntro() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left: statement */}
          <Reveal>
            <p className="eyebrow">
              <span aria-hidden className="h-[2px] w-6 bg-current opacity-70" />
              About the firms
            </p>
            <h2 className="mt-3 font-display text-[27px] font-bold leading-[1.15] text-navy-900 sm:text-[32px] lg:text-[38px]">
              Industrial supply, handled the way engineers expect
            </h2>

            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-steel-600">
              <p>
                <strong className="font-semibold text-navy-800">
                  {site.name}
                </strong>{" "}
                and{" "}
                <strong className="font-semibold text-navy-800">
                  {site.partner}
                </strong>{" "}
                are partner firms engaged in the sale and distribution of
                industrial hardware materials, machine tools, safety materials,
                material handling products, adhesives and allied industrial
                products.
              </p>
              <p>
                Working from MIDC Shiroli in Kolhapur, we supply manufacturing
                units, fabrication shops, foundries, automobile ancillaries and
                maintenance departments across the region. Our job is
                straightforward: understand the application, supply the correct
                specification, and do it quickly enough that production does not
                wait.
              </p>
              <p>
                Because industrial buying rarely fits a shopping cart, we work on
                enquiry and quotation. Send us a product, a drawing, a part
                number or simply a description of the problem — and we will come
                back with the right item, its price and how soon it can reach
                you.
              </p>
            </div>

            <CaliperGlyph
              aria-hidden
              className="mt-8 h-8 w-40 text-steel-300"
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="group inline-flex h-12 items-center gap-2 rounded-md border border-steel-300 px-5 text-[14px] font-semibold text-navy-800 transition hover:border-navy-400 hover:bg-steel-50"
              >
                More about us
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-navy-800 px-5 text-[14px] font-semibold text-white transition hover:bg-navy-700"
              >
                Browse the catalogue
              </Link>
            </div>
          </Reveal>

          {/* Right: pillars */}
          <div className="grid gap-4 self-center">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal
                  key={pillar.title}
                  delay={0.08 * index}
                  direction="left"
                >
                  <div className="group relative overflow-hidden rounded-lg border border-steel-200 bg-steel-50 p-6 transition-colors hover:bg-white hover:shadow-card sm:p-7">
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-blueprint-light bg-grid-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="relative flex gap-5">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-white text-navy-700 shadow-sm transition-colors group-hover:bg-safety-500 group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <div>
                        <h3 className="font-display text-[16px] font-bold text-navy-900">
                          {pillar.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-steel-600">
                          {pillar.body}
                        </p>
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-safety-500 transition-transform duration-300 group-hover:scale-y-100"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
