import Link from "next/link";
import {
  ArrowRight,
  Award,
  EyeOff,
  Inbox,
  Package,
  Plus,
  Star,
  Tags,
} from "lucide-react";

import { AdminPage, Panel } from "@/components/admin/AdminPage";
import { StatusBadge } from "@/components/ui/Badge";
import {
  dashboardStats,
  enquiryCounts,
  listEnquiries,
  listProducts,
} from "@/lib/queries";
import { enquiryStatuses } from "@/lib/site";
import { formatDate, truncate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  const stats = dashboardStats();
  const { counts } = enquiryCounts();
  const recentEnquiries = listEnquiries({ limit: 6 });
  const drafts = listProducts({
    includeUnpublished: true,
    limit: 5,
    sort: "newest",
  }).filter((product) => !product.published);

  const cards = [
    {
      label: "Products",
      value: stats.products,
      sub: `${stats.published} published`,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Featured",
      value: stats.featured,
      sub: "shown on the homepage",
      href: "/admin/products?featured=1",
      icon: Star,
    },
    {
      label: "Categories",
      value: stats.categories,
      sub: `${stats.brands} brands`,
      href: "/admin/categories",
      icon: Tags,
    },
    {
      label: "New enquiries",
      value: stats.newEnquiries,
      sub: `${stats.enquiries} in total`,
      href: "/admin/enquiries?status=New",
      icon: Inbox,
      highlight: stats.newEnquiries > 0,
    },
  ];

  return (
    <AdminPage
      title="Dashboard"
      description="A quick view of the catalogue and the enquiries waiting for a reply."
      actions={
        <>
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-safety-500 px-5 text-[14px] font-semibold text-white transition hover:bg-safety-600"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Add product
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-steel-300 bg-white px-5 text-[14px] font-semibold text-navy-800 transition hover:border-navy-400"
          >
            <Inbox className="h-4 w-4" strokeWidth={2.2} />
            Enquiries
          </Link>
        </>
      }
    >
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group relative overflow-hidden rounded-lg border bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
                card.highlight
                  ? "border-safety-300"
                  : "border-steel-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-steel-500">
                  {card.label}
                </p>
                <Icon
                  className={`h-[18px] w-[18px] ${
                    card.highlight ? "text-safety-500" : "text-steel-300"
                  }`}
                  strokeWidth={2.1}
                />
              </div>
              <p className="mt-3 font-display text-[32px] font-bold leading-none text-navy-900">
                {card.value}
              </p>
              <p className="mt-2 text-[12.5px] text-steel-500">{card.sub}</p>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-safety-500 transition-transform group-hover:scale-x-100"
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Recent enquiries */}
        <Panel
          title="Recent enquiries"
          description="Newest first"
          actions={
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-safety-600 hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          }
        >
          {recentEnquiries.length === 0 ? (
            <p className="px-5 py-10 text-center text-[14px] text-steel-500">
              No enquiries yet. They will appear here as soon as the form on the
              website is used.
            </p>
          ) : (
            <ul className="divide-y divide-steel-200">
              {recentEnquiries.map((enquiry) => (
                <li key={enquiry.id}>
                  <Link
                    href={`/admin/enquiries?q=${encodeURIComponent(enquiry.phone)}`}
                    className="flex flex-col gap-2 px-5 py-4 transition hover:bg-steel-50 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="text-[14px] font-semibold text-navy-900">
                          {enquiry.name}
                        </span>
                        {enquiry.company && (
                          <span className="truncate text-[12.5px] text-steel-500">
                            {enquiry.company}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] text-steel-600">
                        {enquiry.product
                          ? truncate(enquiry.product, 60)
                          : truncate(enquiry.message, 70)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[12.5px] tabular-nums text-steel-500">
                        {enquiry.phone}
                      </span>
                      <StatusBadge status={enquiry.status} />
                      <span className="hidden text-[12px] text-steel-400 sm:inline">
                        {formatDate(enquiry.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="grid gap-6">
          {/* Enquiry pipeline */}
          <Panel title="Enquiry pipeline">
            <ul className="divide-y divide-steel-200">
              {enquiryStatuses.map((status) => (
                <li key={status}>
                  <Link
                    href={`/admin/enquiries?status=${status}`}
                    className="flex items-center justify-between px-5 py-3 transition hover:bg-steel-50"
                  >
                    <StatusBadge status={status} />
                    <span className="font-display text-[16px] font-bold tabular-nums text-navy-900">
                      {counts[status] ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Unpublished drafts */}
          <Panel title="Unpublished drafts">
            {drafts.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13.5px] text-steel-500">
                Nothing waiting. Every product is published.
              </p>
            ) : (
              <ul className="divide-y divide-steel-200">
                {drafts.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition hover:bg-steel-50"
                    >
                      <EyeOff
                        className="h-4 w-4 shrink-0 text-steel-400"
                        strokeWidth={2.2}
                      />
                      <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-navy-800">
                        {product.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Quick links */}
          <Panel title="Quick actions">
            <ul className="divide-y divide-steel-200">
              {[
                { href: "/admin/products/new", label: "Add a new product", icon: Plus },
                { href: "/admin/categories", label: "Manage categories", icon: Tags },
                { href: "/admin/brands", label: "Manage brands", icon: Award },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-5 py-3 text-[13.5px] font-medium text-navy-800 transition hover:bg-steel-50"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-steel-400"
                        strokeWidth={2.2}
                      />
                      {item.label}
                      <ArrowRight
                        className="ml-auto h-3.5 w-3.5 text-steel-300"
                        strokeWidth={2.4}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </AdminPage>
  );
}
