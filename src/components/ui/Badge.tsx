import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone =
  | "navy"
  | "steel"
  | "safety"
  | "success"
  | "muted"
  | "outline"
  | "light";

const tones: Record<Tone, string> = {
  navy: "bg-navy-800 text-white",
  steel: "bg-steel-100 text-steel-700 border border-steel-200",
  safety: "bg-safety-50 text-safety-700 border border-safety-200",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  muted: "bg-steel-100 text-steel-600",
  outline: "border border-steel-300 text-steel-600",
  light: "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
};

export function Badge({
  children,
  tone = "steel",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTones: Record<string, string> = {
  New: "bg-safety-100 text-safety-800 border-safety-200",
  Contacted: "bg-sky-50 text-sky-700 border-sky-200",
  Quoted: "bg-violet-50 text-violet-700 border-violet-200",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-steel-100 text-steel-600 border-steel-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        statusTones[status] ?? statusTones.Closed,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
