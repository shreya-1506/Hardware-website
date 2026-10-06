"use client";

import { useRef } from "react";

import { updateEnquiryStatusAction } from "@/app/admin/actions";
import { enquiryStatuses } from "@/lib/site";

const tones: Record<string, string> = {
  New: "border-safety-300 bg-safety-50 text-safety-800",
  Contacted: "border-sky-300 bg-sky-50 text-sky-800",
  Quoted: "border-violet-300 bg-violet-50 text-violet-800",
  Converted: "border-emerald-300 bg-emerald-50 text-emerald-800",
  Closed: "border-steel-300 bg-steel-100 text-steel-700",
};

/** Status dropdown that saves as soon as it changes — no extra click. */
export function StatusSelect({
  id,
  status,
  label,
}: {
  id: number;
  status: string;
  label: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateEnquiryStatusAction}>
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Status for {label}
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className={`h-9 rounded-md border px-2.5 pr-7 text-[12.5px] font-bold uppercase tracking-wider outline-none transition focus:ring-2 focus:ring-navy-500/20 ${
          tones[status] ?? tones.Closed
        }`}
      >
        {enquiryStatuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  );
}
