import { site } from "./site";

const BASE = "https://wa.me";

function buildUrl(message: string) {
  return `${BASE}/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-filled WhatsApp enquiry for a single product. The product name, brand and
 * category are injected so Anmol Patil receives a complete, actionable message.
 */
export function productWhatsAppUrl(product: {
  name: string;
  brand?: string | null;
  category?: string | null;
  sku?: string | null;
  slug?: string | null;
}) {
  const lines = [
    `Hello ${site.whatsapp.contactName},`,
    "",
    "I am interested in the following product:",
    "",
    `Product: ${product.name}`,
  ];

  if (product.brand) lines.push(`Brand: ${product.brand}`);
  if (product.category) lines.push(`Category: ${product.category}`);
  if (product.sku) lines.push(`Product Code: ${product.sku}`);
  if (product.slug) lines.push(`Link: ${site.url}/products/${product.slug}`);

  lines.push(
    "",
    "Please share the price, availability and further details.",
    "",
    "Thank you.",
  );

  return buildUrl(lines.join("\n"));
}

/** Generic enquiry used by the navbar, floating button and CTA banners. */
export function generalWhatsAppUrl(context?: string) {
  const lines = [
    `Hello ${site.whatsapp.contactName},`,
    "",
    `I found ${site.name} & ${site.partner} online and would like to enquire about your industrial products.`,
  ];

  if (context) lines.push("", `Regarding: ${context}`);

  lines.push("", "Please share details and pricing.", "", "Thank you.");

  return buildUrl(lines.join("\n"));
}

/** Sends a filled-in enquiry form to WhatsApp instead of storing it. */
export function enquiryWhatsAppUrl(values: {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  product?: string;
  quantity?: string;
  message?: string;
}) {
  const lines = [`Hello ${site.whatsapp.contactName},`, "", "New enquiry details:", ""];

  const rows: [string, string | undefined][] = [
    ["Name", values.name],
    ["Company", values.company],
    ["Phone", values.phone],
    ["Email", values.email],
    ["Product / Requirement", values.product],
    ["Quantity", values.quantity],
  ];

  for (const [label, value] of rows) {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  }

  if (values.message && values.message.trim()) {
    lines.push("", `Message: ${values.message.trim()}`);
  }

  lines.push("", "Please get in touch. Thank you.");

  return buildUrl(lines.join("\n"));
}

/** Enquiry for a whole category, used on category listing pages. */
export function categoryWhatsAppUrl(categoryName: string) {
  return buildUrl(
    [
      `Hello ${site.whatsapp.contactName},`,
      "",
      `I would like to enquire about products in the "${categoryName}" category.`,
      "",
      "Please share the available range, pricing and availability.",
      "",
      "Thank you.",
    ].join("\n"),
  );
}
