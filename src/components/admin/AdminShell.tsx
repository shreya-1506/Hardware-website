"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Tags,
  Award,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, badgeKey: "new" },
];

export function AdminShell({
  children,
  user,
  newEnquiries,
}: {
  children: ReactNode;
  user: { name: string; email: string };
  newEnquiries: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav className="grid gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-[14px] font-semibold transition",
              active
                ? "bg-white/[0.09] text-white"
                : "text-white/60 hover:bg-white/[0.05] hover:text-white",
            )}
          >
            <Icon
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                active ? "text-safety-400" : "text-white/40",
              )}
              strokeWidth={2.1}
            />
            <span className="flex-1">{item.label}</span>
            {item.badgeKey === "new" && newEnquiries > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-safety-500 px-1.5 text-[11px] font-bold text-white">
                {newEnquiries}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[6px] bg-white/[0.08] text-white">
            <span
              aria-hidden
              className="absolute inset-0 bg-blueprint bg-grid-sm opacity-60"
            />
            <span className="relative font-display text-[13px] font-bold">
              IPS
            </span>
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-[3px] w-full bg-safety-500"
            />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[14px] font-bold text-white">
              Admin Panel
            </span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-white/40">
              IPS &amp; Vijay Ent.
            </span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">{nav}</div>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-3.5 py-2.5 text-[13.5px] font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={2.1} />
          View live website
        </Link>

        <div className="mt-3 rounded-md bg-white/[0.05] px-3.5 py-3">
          <p className="truncate text-[13px] font-semibold text-white">
            {user.name}
          </p>
          <p className="truncate text-[11.5px] text-white/40">{user.email}</p>
        </div>

        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-[13.5px] font-semibold text-white/55 transition hover:bg-red-500/15 hover:text-red-300"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={2.1} />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 bg-navy-900 lg:block">
        {sidebarBody}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[264px] bg-navy-900 lg:hidden"
            >
              {sidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-steel-200 bg-white/95 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
            className="grid h-10 w-10 place-items-center rounded-md border border-steel-300 text-navy-800"
          >
            <Menu className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <span className="font-display text-[15px] font-bold text-navy-900">
            Admin Panel
          </span>
          {newEnquiries > 0 && (
            <Link
              href="/admin/enquiries"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-safety-500 px-3 py-1 text-[12px] font-bold text-white"
            >
              {newEnquiries} new
            </Link>
          )}
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Close button floats over the drawer */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close admin menu"
          className="fixed right-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white lg:hidden"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}
