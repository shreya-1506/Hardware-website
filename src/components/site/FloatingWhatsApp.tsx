"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Always-available enquiry shortcut. Expands into a small card so the visitor
 * can see who they are messaging before leaving the site.
 */
export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="floating-wa"
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(86vw,320px)] overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card-hover"
          >
            <div className="relative bg-steel-sheen px-5 py-4 text-white">
              <span
                aria-hidden
                className="absolute inset-0 bg-blueprint bg-grid-sm opacity-50"
              />
              <p className="relative text-[13px] font-semibold uppercase tracking-[0.14em] text-safety-400">
                Quick enquiry
              </p>
              <p className="relative mt-1 font-display text-[17px] font-bold">
                Talk to {site.whatsapp.contactName}
              </p>
              <p className="relative mt-1 text-[12.5px] text-white/65">
                Usually replies during business hours
              </p>
            </div>

            <div className="p-4">
              <p className="text-[13.5px] leading-relaxed text-steel-600">
                Send us the product you need — we will share price, availability
                and technical details.
              </p>

              <a
                href={generalWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1FA855] text-[14px] font-semibold text-white transition hover:bg-[#178c46]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                Chat on WhatsApp
              </a>

              <a
                href={telHref(site.contacts[0].phone)}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-steel-300 text-[14px] font-semibold text-navy-800 transition hover:bg-steel-50"
              >
                <Phone className="h-4 w-4" strokeWidth={2.2} />
                Call {site.contacts[0].phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close WhatsApp enquiry" : "Enquire on WhatsApp"}
        aria-expanded={open}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.6,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1FA855] text-white shadow-[0_14px_32px_-12px_rgba(31,168,85,0.85)] transition hover:bg-[#178c46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2"
      >
        {!open && (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-[#1FA855] opacity-25"
            style={{ animationDuration: "2.6s" }}
          />
        )}
        {open ? (
          <X className="relative h-6 w-6" strokeWidth={2.4} />
        ) : (
          <WhatsAppIcon className="relative h-7 w-7" />
        )}
      </motion.button>
    </div>
  );
}
