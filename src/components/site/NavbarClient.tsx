"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Menu,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/site/Logo";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { cn, telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

type NavCategory = { name: string; slug: string; product_count?: number };

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories", hasMenu: true },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About Us" },
  { href: "/enquiry", label: "Enquiry" },
  { href: "/contact", label: "Contact" },
];

export function NavbarClient({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever navigation happens.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
    setMobileOpen(false);
  }

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
  }

  function scheduleCloseMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 140);
  }

  return (
    <>
      {/* Utility strip: address + phone numbers */}
      <div className="hidden bg-navy-900 text-white lg:block">
        <div className="container-x flex h-9 items-center justify-between text-[12px]">
          <p className="flex items-center gap-2 text-white/70">
            <MapPin className="h-3.5 w-3.5 text-safety-400" strokeWidth={2.2} />
            {site.address.line1}, {site.address.city}
          </p>
          <div className="flex items-center gap-5">
            {site.contacts.map((contact) => (
              <a
                key={contact.phone}
                href={telHref(contact.phone)}
                className="flex items-center gap-1.5 text-white/70 transition hover:text-safety-400"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span className="font-semibold text-white">{contact.name}</span>
                <span className="tabular-nums">{contact.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-steel-200 shadow-[0_6px_24px_-16px_rgba(13,31,55,0.5)]"
            : "border-transparent",
        )}
      >
        <div className="container-x flex h-[72px] items-center gap-4">
          <Logo />

          <div className="ml-auto flex items-center gap-2">
          <nav className="hidden items-center gap-0.5 xl:flex">
            {LINKS.map((link) =>
              link.hasMenu ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={openMenu}
                  onMouseLeave={scheduleCloseMenu}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap rounded px-2.5 py-2 text-[14px] font-semibold transition",
                      isActive(link.href)
                        ? "text-safety-600"
                        : "text-navy-800 hover:text-safety-600",
                    )}
                    aria-expanded={menuOpen}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        menuOpen && "rotate-180",
                      )}
                      strokeWidth={2.5}
                    />
                  </Link>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                      >
                        <div className="overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card-hover">
                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 p-3">
                            {categories.slice(0, 12).map((category) => (
                              <Link
                                key={category.slug}
                                href={`/categories/${category.slug}`}
                                className="group flex items-center justify-between rounded px-3 py-2 text-[13.5px] font-medium text-steel-700 transition hover:bg-steel-50 hover:text-navy-900"
                              >
                                <span>{category.name}</span>
                                <span className="text-[11px] font-semibold tabular-nums text-steel-400 group-hover:text-safety-600">
                                  {category.product_count ?? 0}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/categories"
                            className="flex items-center justify-between border-t border-steel-200 bg-steel-50 px-5 py-3 text-[13px] font-semibold text-navy-800 transition hover:bg-steel-100"
                          >
                            View all categories
                            <span aria-hidden className="text-safety-600">
                              &rarr;
                            </span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative whitespace-nowrap rounded px-2.5 py-2 text-[14px] font-semibold transition",
                    isActive(link.href)
                      ? "text-safety-600"
                      : "text-navy-800 hover:text-safety-600",
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-safety-500" />
                  )}
                </Link>
              ),
            )}
          </nav>

          <form
            onSubmit={submitSearch}
            role="search"
            className="hidden w-[200px] items-center xl:flex"
          >
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
                strokeWidth={2.2}
              />
              <input
                id="nav-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products…"
                className="h-10 w-full rounded-md border border-steel-300 bg-steel-50 pl-9 pr-3 text-[13.5px] text-navy-900 outline-none transition placeholder:text-steel-400 focus:border-navy-400 focus:bg-white focus:ring-2 focus:ring-navy-500/15"
              />
            </div>
          </form>

          <ButtonAnchor
            href={generalWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="md"
            className="hidden lg:inline-flex"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">WhatsApp Enquiry</span>
            <span className="xl:hidden">Enquire</span>
          </ButtonAnchor>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="grid h-11 w-11 place-items-center rounded-md border border-steel-300 text-navy-800 transition hover:border-navy-400 hover:bg-steel-50 xl:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={2.2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2.2} />
            )}
          </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-steel-200 bg-white xl:hidden"
            >
              <div className="container-x max-h-[calc(100dvh-140px)] overflow-y-auto py-5">
                <form onSubmit={submitSearch} role="search" className="relative mb-4">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
                    strokeWidth={2.2}
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products, codes, brands…"
                    aria-label="Search products"
                    className="h-12 w-full rounded-md border border-steel-300 bg-steel-50 pl-10 pr-3 text-[15px] outline-none focus:border-navy-400 focus:bg-white"
                  />
                </form>

                <div className="grid gap-0.5">
                  {LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3.5 py-3 text-[15px] font-semibold transition",
                        isActive(link.href)
                          ? "bg-safety-50 text-safety-700"
                          : "text-navy-800 hover:bg-steel-50",
                      )}
                    >
                      {link.label}
                      <span aria-hidden className="text-steel-300">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>

                <p className="mt-5 mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-steel-500">
                  Shop by category
                </p>
                <div className="grid gap-0.5 sm:grid-cols-2">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="rounded-md px-3.5 py-2.5 text-[14px] text-steel-700 transition hover:bg-steel-50 hover:text-navy-900"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 grid gap-2.5">
                  <ButtonAnchor
                    href={generalWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    size="lg"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Enquire on WhatsApp
                  </ButtonAnchor>
                  {site.contacts.map((contact) => (
                    <ButtonAnchor
                      key={contact.phone}
                      href={telHref(contact.phone)}
                      variant="outline"
                      size="lg"
                    >
                      <Phone className="h-4 w-4" strokeWidth={2.2} />
                      {contact.name} · {contact.phone}
                    </ButtonAnchor>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
