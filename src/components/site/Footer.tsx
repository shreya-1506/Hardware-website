import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { listCategories } from "@/lib/queries";
import { site } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

const QUICK_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Product Categories" },
  { href: "/brands", label: "Brands We Supply" },
  { href: "/about", label: "About Us" },
  { href: "/enquiry", label: "Send an Enquiry" },
  { href: "/contact", label: "Contact & Location" },
];

export function Footer() {
  const categories = listCategories({ activeOnly: true }).slice(0, 8);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint bg-grid opacity-[0.55]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-safety-500 via-safety-400 to-transparent"
      />

      <div className="container-x relative py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-8">
          {/* Company */}
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/65">
              Suppliers and distributors of industrial hardware, machine tools,
              safety materials, material handling equipment, adhesives and
              industrial consumables — serving manufacturing units across
              Kolhapur and Western Maharashtra.
            </p>

            <ButtonAnchor
              href={generalWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="md"
              className="mt-6"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Enquire on WhatsApp
            </ButtonAnchor>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-white">
              Categories
            </h3>
            <span
              aria-hidden
              className="mt-3 block h-[2px] w-8 bg-safety-500"
            />
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-[14px] text-white/65 transition hover:text-safety-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-[14px] font-semibold text-safety-400 transition hover:text-safety-300"
                >
                  View all &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-white">
              Quick Links
            </h3>
            <span
              aria-hidden
              className="mt-3 block h-[2px] w-8 bg-safety-500"
            />
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/65 transition hover:text-safety-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="text-[13px] text-white/35 transition hover:text-white/60"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-white">
              Get in Touch
            </h3>
            <span
              aria-hidden
              className="mt-3 block h-[2px] w-8 bg-safety-500"
            />

            <address className="mt-4 flex gap-3 not-italic">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-safety-400"
                strokeWidth={2.2}
              />
              <span className="text-[14px] leading-relaxed text-white/65">
                {site.address.line1},
                <br />
                {site.address.line2},
                <br />
                {site.address.city}, {site.address.state} —{" "}
                {site.address.postalCode}
              </span>
            </address>

            <ul className="mt-4 space-y-2.5">
              {site.contacts.map((contact) => (
                <li key={contact.phone}>
                  <a
                    href={telHref(contact.phone)}
                    className="flex items-center gap-3 text-[14px] text-white/65 transition hover:text-safety-400"
                  >
                    <Phone
                      className="h-4 w-4 shrink-0 text-safety-400"
                      strokeWidth={2.2}
                    />
                    <span>
                      <span className="font-semibold text-white">
                        {contact.name}
                      </span>{" "}
                      <span className="tabular-nums">{contact.phone}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3 text-[14px] text-white/65">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-safety-400"
                  strokeWidth={2.2}
                />
                <span>
                  {site.hours.map((entry) => (
                    <span key={entry.days} className="block">
                      {entry.days}: {entry.time}
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <Link
                  href="/enquiry"
                  className="flex items-center gap-3 text-[14px] text-white/65 transition hover:text-safety-400"
                >
                  <Mail
                    className="h-4 w-4 shrink-0 text-safety-400"
                    strokeWidth={2.2}
                  />
                  Send a written enquiry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Service areas */}
        <div className="mt-12 border-t border-white/10 pt-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Areas we serve
          </p>
          <p className="mt-2 text-[13.5px] text-white/55">
            {site.serviceAreas.join(" · ")}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-7 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name} &amp; {site.partner}. All rights reserved.
          </p>
          <p>
            Industrial hardware &amp; machine tools distributor · MIDC Shiroli,
            Kolhapur
          </p>
        </div>
      </div>
    </footer>
  );
}
