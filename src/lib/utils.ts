import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turns "McCoy Industrial Adhesive 50ml" into "mccoy-industrial-adhesive-50ml". */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Formats a 10-digit Indian mobile number as "+91 91464 36464". */
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length > 10 ? digits : `91${digits}`}`;
}

export function truncate(value: string, max = 140) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}

/** Placeholder shown wherever a record has no uploaded image yet. */
export const IMAGE_FALLBACK = "/images/placeholder-product.svg";

export function imageSrc(value?: string | null) {
  return value && value.trim().length > 0 ? value : IMAGE_FALLBACK;
}
