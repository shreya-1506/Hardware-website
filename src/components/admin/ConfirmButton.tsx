"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

/**
 * Submit button for destructive admin actions. Asks for confirmation before
 * letting the enclosing form's server action run.
 */
export function ConfirmButton({
  message,
  children,
  className,
  title,
  ariaLabel,
}: {
  message: string;
  children: ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title={title}
      aria-label={ariaLabel}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={cn(className, pending && "pointer-events-none opacity-60")}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
      ) : (
        children
      )}
    </button>
  );
}

/** Plain pending-aware submit button, for non-destructive inline forms. */
export function SubmitButton({
  children,
  className,
  title,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title={title}
      aria-label={ariaLabel}
      disabled={pending}
      className={cn(className, pending && "pointer-events-none opacity-60")}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
      ) : (
        children
      )}
    </button>
  );
}
