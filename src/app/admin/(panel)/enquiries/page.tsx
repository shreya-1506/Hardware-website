import Link from "next/link";
import { Suspense } from "react";
import {
  Building2,
  Hash,
  Mail,
  Phone,
  StickyNote,
  Trash2,
} from "lucide-react";

import {
  deleteEnquiryAction,
  updateEnquiryNotesAction,
} from "@/app/admin/actions";
import { AdminPage, Panel } from "@/components/admin/AdminPage";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { WhatsAppIcon } from "@/components/ui/icons";
import { enquiryCounts, listEnquiries } from "@/lib/queries";
import { enquiryStatuses } from "@/lib/site";
import { formatDateTime, telHref } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "";

  const enquiries = listEnquiries({ q: params.q, status: status || undefined });
  const { counts, total } = enquiryCounts();

  return (
    <AdminPage
      title="Enquiries"
      description="Every enquiry submitted through the website form. Update the status as you work through them."
      crumbs={[{ label: "Enquiries" }]}
    >
      {/* Status tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <StatusTab href="/admin/enquiries" label="All" count={total} active={!status} />
        {enquiryStatuses.map((option) => (
          <StatusTab
            key={option}
            href={`/admin/enquiries?status=${option}`}
            label={option}
            count={counts[option] ?? 0}
            active={status === option}
          />
        ))}
      </div>

      <div className="mb-5">
        <Suspense fallback={<div className="h-11" />}>
          <AdminSearchBar
            basePath="/admin/enquiries"
            placeholder="Search by name, company, phone, email, product or message…"
          />
        </Suspense>
      </div>

      <Panel
        title={`${enquiries.length} ${enquiries.length === 1 ? "enquiry" : "enquiries"}`}
        description="Newest first"
      >
        {enquiries.length === 0 ? (
          <p className="px-5 py-14 text-center text-[14px] text-steel-500">
            {params.q || status
              ? "No enquiries match this search or filter."
              : "No enquiries yet. They will appear here as soon as the website form is used."}
          </p>
        ) : (
          <ul className="divide-y divide-steel-200">
            {enquiries.map((enquiry) => {
              const waMessage = `Hello ${enquiry.name}, thank you for your enquiry to Industrial Prime System & Vijay Enterprises${
                enquiry.product ? ` regarding ${enquiry.product}` : ""
              }.`;
              const waUrl = `https://wa.me/91${enquiry.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(waMessage)}`;

              return (
                <li key={enquiry.id} className="px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-display text-[16px] font-bold text-navy-900">
                          {enquiry.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[12px] text-steel-400">
                          <Hash className="h-3 w-3" strokeWidth={2.6} />
                          {enquiry.id}
                        </span>
                        <span className="text-[12.5px] text-steel-400">
                          {formatDateTime(enquiry.created_at)}
                        </span>
                        {enquiry.source && enquiry.source !== "Website" && (
                          <span className="rounded bg-steel-100 px-2 py-0.5 text-[11px] font-semibold text-steel-600">
                            {enquiry.source}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-steel-600">
                        {enquiry.company && (
                          <span className="inline-flex items-center gap-1.5">
                            <Building2
                              className="h-3.5 w-3.5 text-steel-400"
                              strokeWidth={2.2}
                            />
                            {enquiry.company}
                          </span>
                        )}
                        <a
                          href={telHref(enquiry.phone)}
                          className="inline-flex items-center gap-1.5 font-medium tabular-nums text-navy-800 hover:text-safety-600"
                        >
                          <Phone
                            className="h-3.5 w-3.5 text-steel-400"
                            strokeWidth={2.2}
                          />
                          {enquiry.phone}
                        </a>
                        {enquiry.email && (
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="inline-flex items-center gap-1.5 hover:text-safety-600"
                          >
                            <Mail
                              className="h-3.5 w-3.5 text-steel-400"
                              strokeWidth={2.2}
                            />
                            {enquiry.email}
                          </a>
                        )}
                      </div>

                      {(enquiry.product || enquiry.quantity) && (
                        <dl className="mt-3.5 grid gap-x-6 gap-y-2 rounded-md border border-steel-200 bg-steel-50 px-4 py-3 sm:grid-cols-[1fr_auto]">
                          {enquiry.product && (
                            <div>
                              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel-500">
                                Product / requirement
                              </dt>
                              <dd className="mt-0.5 text-[13.5px] font-medium text-navy-900">
                                {enquiry.product}
                              </dd>
                            </div>
                          )}
                          {enquiry.quantity && (
                            <div>
                              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel-500">
                                Quantity
                              </dt>
                              <dd className="mt-0.5 text-[13.5px] font-medium text-navy-900">
                                {enquiry.quantity}
                              </dd>
                            </div>
                          )}
                        </dl>
                      )}

                      <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-steel-700">
                        {enquiry.message}
                      </p>

                      {/* Internal notes */}
                      <details className="mt-3.5 group" open={Boolean(enquiry.notes)}>
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[12.5px] font-semibold text-steel-500 transition hover:text-navy-900">
                          <StickyNote className="h-3.5 w-3.5" strokeWidth={2.2} />
                          Internal notes
                        </summary>
                        <form
                          action={updateEnquiryNotesAction}
                          className="mt-2.5 flex flex-col gap-2 sm:flex-row"
                        >
                          <input type="hidden" name="id" value={enquiry.id} />
                          <label
                            className="sr-only"
                            htmlFor={`notes-${enquiry.id}`}
                          >
                            Internal notes for {enquiry.name}
                          </label>
                          <textarea
                            id={`notes-${enquiry.id}`}
                            name="notes"
                            rows={2}
                            defaultValue={enquiry.notes}
                            placeholder="Quoted on 12 Sep, awaiting confirmation…"
                            className="field flex-1 resize-y text-[13px]"
                          />
                          <SubmitButton className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-steel-300 px-4 text-[13px] font-semibold text-navy-800 transition hover:border-navy-400 sm:self-end">
                            Save note
                          </SubmitButton>
                        </form>
                      </details>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                      <StatusSelect
                        id={enquiry.id}
                        status={enquiry.status}
                        label={enquiry.name}
                      />

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#1FA855] px-3.5 text-[12.5px] font-semibold text-white transition hover:bg-[#178c46]"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                        Reply on WhatsApp
                      </a>

                      <a
                        href={telHref(enquiry.phone)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-steel-300 px-3.5 text-[12.5px] font-semibold text-navy-800 transition hover:border-navy-400"
                      >
                        <Phone className="h-3.5 w-3.5" strokeWidth={2.4} />
                        Call
                      </a>

                      <form action={deleteEnquiryAction}>
                        <input type="hidden" name="id" value={enquiry.id} />
                        <ConfirmButton
                          message={`Delete the enquiry from ${enquiry.name}? This cannot be undone.`}
                          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-steel-200 px-3.5 text-[12.5px] font-semibold text-steel-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.4} />
                          Delete
                        </ConfirmButton>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </AdminPage>
  );
}

function StatusTab({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-[13px] font-semibold transition ${
        active
          ? "border-navy-800 bg-navy-800 text-white"
          : "border-steel-300 bg-white text-navy-800 hover:border-navy-400"
      }`}
    >
      {label}
      <span
        className={`rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
          active ? "bg-white/15 text-white" : "bg-steel-100 text-steel-600"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
