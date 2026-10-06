"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitEnquiry, type EnquiryFormState } from "@/app/actions/enquiry";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { enquiryWhatsAppUrl } from "@/lib/whatsapp";

const initialState: EnquiryFormState = { status: "idle" };

type EnquiryFormProps = {
  /** Pre-fills the "Product / Requirement" field from a product page. */
  defaultProduct?: string;
  source?: string;
  className?: string;
  tone?: "light" | "dark";
};

export function EnquiryForm({
  defaultProduct = "",
  source = "Website",
  className,
  tone = "light",
}: EnquiryFormProps) {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const dark = tone === "dark";

  // Mirrored locally so "Send on WhatsApp" can use whatever is typed right now,
  // without waiting for the form to be submitted to the server.
  const [values, setValues] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: defaultProduct,
    quantity: "",
    message: "",
  });

  useEffect(() => {
    setValues((current) => ({ ...current, product: defaultProduct }));
  }, [defaultProduct]);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setValues({
        name: "",
        company: "",
        phone: "",
        email: "",
        product: defaultProduct,
        quantity: "",
        message: "",
      });
    }
  }, [state.status, state.timestamp, defaultProduct]);

  const set = (field: keyof typeof values) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const error = (field: string) => state.errors?.[field];

  const labelClass = cn(
    "mb-1.5 block text-[13px] font-semibold",
    dark ? "text-white/85" : "text-navy-800",
  );

  const fieldClass = (field: string) =>
    cn(
      "w-full rounded-md px-3.5 py-2.5 text-[15px] shadow-sm outline-none transition",
      dark
        ? "border border-white/15 bg-white/[0.06] text-white placeholder:text-white/35 focus:border-safety-400 focus:bg-white/10 focus:ring-2 focus:ring-safety-500/25"
        : "border border-steel-300 bg-white text-navy-900 placeholder:text-steel-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-500/15",
      error(field) && "border-red-400 focus:border-red-400 focus:ring-red-500/20",
    );

  return (
    <div className={className}>
      <form ref={formRef} action={formAction} className="grid gap-4" noValidate>
        <input type="hidden" name="source" value={source} />
        {/* Honeypot: hidden from humans, tempting to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="eq-name" className={labelClass}>
              Name <span className="text-safety-500">*</span>
            </label>
            <input
              id="eq-name"
              name="name"
              required
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              placeholder="Your full name"
              aria-invalid={Boolean(error("name"))}
              className={fieldClass("name")}
            />
            <FieldError message={error("name")} />
          </div>

          <div>
            <label htmlFor="eq-company" className={labelClass}>
              Company Name
            </label>
            <input
              id="eq-company"
              name="company"
              autoComplete="organization"
              value={values.company}
              onChange={set("company")}
              placeholder="Company / firm name"
              className={fieldClass("company")}
            />
          </div>

          <div>
            <label htmlFor="eq-phone" className={labelClass}>
              Phone Number <span className="text-safety-500">*</span>
            </label>
            <input
              id="eq-phone"
              name="phone"
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={values.phone}
              onChange={set("phone")}
              placeholder="10-digit mobile number"
              aria-invalid={Boolean(error("phone"))}
              className={fieldClass("phone")}
            />
            <FieldError message={error("phone")} />
          </div>

          <div>
            <label htmlFor="eq-email" className={labelClass}>
              Email
            </label>
            <input
              id="eq-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={set("email")}
              placeholder="you@company.com"
              aria-invalid={Boolean(error("email"))}
              className={fieldClass("email")}
            />
            <FieldError message={error("email")} />
          </div>

          <div>
            <label htmlFor="eq-product" className={labelClass}>
              Product / Requirement
            </label>
            <input
              id="eq-product"
              name="product"
              value={values.product}
              onChange={set("product")}
              placeholder="e.g. ANABOND 114 Thread Locker"
              className={fieldClass("product")}
            />
          </div>

          <div>
            <label htmlFor="eq-quantity" className={labelClass}>
              Quantity
            </label>
            <input
              id="eq-quantity"
              name="quantity"
              value={values.quantity}
              onChange={set("quantity")}
              placeholder="e.g. 24 nos / 5 boxes"
              className={fieldClass("quantity")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="eq-message" className={labelClass}>
            Message <span className="text-safety-500">*</span>
          </label>
          <textarea
            id="eq-message"
            name="message"
            required
            rows={5}
            value={values.message}
            onChange={set("message")}
            placeholder="Tell us the sizes, grades or specifications you need, and where it has to be delivered."
            aria-invalid={Boolean(error("message"))}
            className={cn(fieldClass("message"), "resize-y")}
          />
          <FieldError message={error("message")} />
        </div>

        <AnimatePresence mode="wait">
          {state.status !== "idle" && state.message && (
            <motion.div
              key={`${state.status}-${state.message}`}
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              role="status"
              aria-live="polite"
              className={cn(
                "flex items-start gap-3 overflow-hidden rounded-md border px-4 py-3 text-[13.5px]",
                state.status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800",
              )}
            >
              {state.status === "success" ? (
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2.4}
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2.4}
                />
              )}
              <span>{state.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-md bg-safety-500 px-6 text-[15px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,112,8,0.9)] transition hover:bg-safety-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
                Submitting…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" strokeWidth={2.4} />
                Submit Enquiry
              </>
            )}
          </button>

          <a
            href={enquiryWhatsAppUrl(values)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-md bg-[#1FA855] px-6 text-[15px] font-semibold text-white transition hover:bg-[#178c46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Send on WhatsApp
          </a>
        </div>

        <p
          className={cn(
            "text-[12.5px]",
            dark ? "text-white/45" : "text-steel-500",
          )}
        >
          Fields marked <span className="text-safety-500">*</span> are required.
          Choosing &ldquo;Send on WhatsApp&rdquo; opens a chat with whatever you
          have typed above already filled in.
        </p>
      </form>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
      {message}
    </p>
  );
}
