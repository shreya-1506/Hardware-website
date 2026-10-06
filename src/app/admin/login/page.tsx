import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/site/Logo";
import { GearGlyph } from "@/components/ui/icons";
import { ensureDefaultAdmin } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Guarantees the very first install has a usable account.
  ensureDefaultAdmin();

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-steel-sheen px-4 py-12">
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint bg-grid opacity-60"
      />
      <GearGlyph
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] animate-spin-slow text-white/[0.06]"
      />
      <GearGlyph
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[360px] w-[360px] animate-spin-slower text-safety-400/[0.08]"
      />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-7 flex justify-center">
          <Logo tone="light" />
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
          <div className="border-b border-steel-200 px-7 py-6">
            <span className="inline-flex items-center gap-2 rounded bg-navy-800 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-safety-400">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
              Restricted area
            </span>
            <h1 className="mt-3.5 font-display text-[22px] font-bold text-navy-900">
              Admin sign in
            </h1>
            <p className="mt-1.5 text-[13.5px] text-steel-600">
              Manage products, categories, brands and enquiries.
            </p>
          </div>

          <div className="px-7 py-7">
            <LoginForm next={next} />
          </div>

          <div className="border-t border-steel-200 bg-steel-50 px-7 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-steel-600 transition hover:text-navy-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              Back to {site.name}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-white/40">
          First-time setup? The default credentials are printed by{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/70">
            npm run seed
          </code>{" "}
          and can be changed via the ADMIN_EMAIL / ADMIN_PASSWORD environment
          variables.
        </p>
      </div>
    </div>
  );
}
