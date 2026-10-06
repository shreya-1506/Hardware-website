"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";

import { Counter } from "@/components/ui/Counter";
import { GearGlyph, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

const HIGHLIGHTS = [
  "Genuine, brand-warranted products",
  "Technical support on product selection",
  "Same-day response on enquiries",
];

const STATS = [
  { value: 13, suffix: "+", label: "Product categories" },
  { value: 500, suffix: "+", label: "Line items supplied" },
  { value: 15, suffix: "+", label: "Years in the trade" },
  { value: 200, suffix: "+", label: "Industrial customers" },
];

type HeroProps = {
  productCount: number;
  brandNames: string[];
};

export function Hero({ productCount, brandNames }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-steel-sheen">
      {/* Blueprint grid + gear motifs */}
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint bg-grid opacity-70"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,rgba(43,76,126,0.55),transparent_60%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <GearGlyph className="absolute -right-24 -top-24 h-[420px] w-[420px] animate-spin-slow text-white/[0.07]" />
        <GearGlyph className="absolute -bottom-40 right-56 h-[300px] w-[300px] animate-spin-slower text-safety-400/[0.09]" />
      </div>
      {/* Fades into the light section below so the page never reads as "all dark" */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white/[0.04]"
      />

      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-24">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-safety-400" strokeWidth={2.4} />
            MIDC Shiroli, Kolhapur
            <span aria-hidden className="h-3 w-px bg-white/20" />
            <span className="text-safety-400">B2B Supply</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[34px] font-bold leading-[1.08] text-white sm:text-[46px] lg:text-[56px]"
          >
            Industrial Hardware &amp;
            <br />
            <span className="relative inline-block">
              Machine Tool Solutions
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-[4px] w-full rounded-full bg-safety-500/80"
              />
            </span>
            <br />
            You Can Trust
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/70 sm:text-[17px]"
          >
            <strong className="font-semibold text-white">{site.name}</strong> and{" "}
            <strong className="font-semibold text-white">{site.partner}</strong>{" "}
            supply industrial hardware, machine tools, safety materials,
            material handling equipment, adhesives and industrial consumables to
            manufacturing units across Kolhapur and Western Maharashtra.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-7 grid gap-2.5 sm:grid-cols-2"
          >
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[13.5px] text-white/75"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-safety-400"
                  strokeWidth={2.4}
                />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/products"
              className="group inline-flex h-[54px] items-center justify-center gap-2.5 rounded-md bg-safety-500 px-7 text-[15px] font-semibold text-white shadow-[0_16px_36px_-16px_rgba(249,112,8,0.95)] transition-all hover:bg-safety-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              Explore Products
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </Link>

            <a
              href={generalWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-md border border-white/25 bg-white/[0.06] px-7 text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#4ADE80]" />
              Enquire on WhatsApp
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="mt-5 text-[12.5px] text-white/45"
          >
            No account or payment needed — send an enquiry and we will reply with
            price and availability.
          </motion.p>
        </div>

        {/* Technical spec panel */}
        <motion.div
          initial={{ opacity: 0, y: 28, rotateX: 6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.05] p-1.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            <div className="rounded-lg border border-white/10 bg-navy-950/60 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-safety-400">
                  Supply Capability
                </p>
                <ShieldCheck
                  className="h-5 w-5 text-safety-400"
                  strokeWidth={2}
                />
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-display text-[30px] font-bold leading-none text-white sm:text-[34px]">
                      <Counter to={stat.value} suffix={stat.suffix} />
                    </dd>
                    <dt className="mt-2 text-[12.5px] leading-snug text-white/50">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  Brands in stock
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brandNames.map((brand) => (
                    <span
                      key={brand}
                      className="rounded border border-white/15 bg-white/[0.06] px-2.5 py-1 font-display text-[12.5px] font-semibold tracking-wide text-white/85"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-md border border-safety-500/25 bg-safety-500/10 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-safety-300">
                    Live catalogue
                  </p>
                  <p className="mt-0.5 font-display text-[15px] font-bold text-white">
                    {productCount} products listed
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-[12.5px] font-semibold text-safety-300 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Browse &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Corner registration marks, like a drawing sheet */}
          <span
            aria-hidden
            className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-safety-500/60"
          />
          <span
            aria-hidden
            className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-safety-500/60"
          />
        </motion.div>
      </div>
    </section>
  );
}
